import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";

/* ============================================================
   PATH & EXPRESS SETUP
   ============================================================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/* ============================================================
   CACHE (SQLite) — avanzata con TTL + LRU
   ============================================================ */

const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const DB_PATH = path.join(CACHE_DIR, "overpass.db");
const db = new sqlite3.Database(DB_PATH);

// CONFIG CACHE
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;    // 7 giorni
const CACHE_MAX_ITEMS = 5000;
const CACHE_CLEAN_INTERVAL_MS = 1000 * 60 * 30; // ogni 30 minuti

// Helpers Promisified
function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

// Inizializzazione DB + migrazioni
async function initDatabase() {
    // Tabella base (se non esiste)
    await dbRun(`
        CREATE TABLE IF NOT EXISTS overpass_cache (
            key TEXT PRIMARY KEY,
            query TEXT,
            response TEXT,
            created_at INTEGER,
            last_access INTEGER,
            type TEXT,
            tile_lat INTEGER,
            tile_lon INTEGER,
            radius INTEGER
        )
    `);

    // Verifica colonne effettivamente presenti
    const rows = await dbAll(`PRAGMA table_info(overpass_cache)`);
    const existing = rows.map(r => r.name);

    const ensureColumn = async (col, def) => {
        if (!existing.includes(col)) {
            console.log(`⚠️ MIGRATION: aggiungo colonna mancante "${col}"`);
            await dbRun(`ALTER TABLE overpass_cache ADD COLUMN ${col} ${def}`);
        }
    };

    await ensureColumn("last_access", "INTEGER");
    await ensureColumn("type", "TEXT");
    await ensureColumn("tile_lat", "INTEGER");
    await ensureColumn("tile_lon", "INTEGER");
    await ensureColumn("radius", "INTEGER");

    // Indici
    await dbRun(`CREATE INDEX IF NOT EXISTS idx_cache_created_at ON overpass_cache(created_at)`);
    await dbRun(`CREATE INDEX IF NOT EXISTS idx_cache_last_access ON overpass_cache(last_access)`);
    await dbRun(`CREATE INDEX IF NOT EXISTS idx_cache_tile ON overpass_cache(type, tile_lat, tile_lon, radius)`);

    console.log("✅ Database Overpass pronto.");
}

/* ============================================================
   CACHE CLEANUP (TTL + LRU)
   ============================================================ */

async function cleanCache() {
    console.log("🧹 Pulizia cache…");
    const now = Date.now();

    try {
        // 1) Rimuovi scadute (TTL)
        await dbRun(
            `DELETE FROM overpass_cache WHERE created_at < ?`,
            [now - CACHE_TTL_MS]
        );

        // 2) LRU se si supera il limite
        const countRow = await dbGet(`SELECT COUNT(*) AS count FROM overpass_cache`);
        const total = countRow?.count || 0;

        if (total > CACHE_MAX_ITEMS) {
            const remove = total - CACHE_MAX_ITEMS;
            console.log(`⚠️ Cache piena (${total}), rimuovo ${remove} record meno usati (LRU)…`);

            await dbRun(
                `DELETE FROM overpass_cache
                 WHERE key IN (
                     SELECT key FROM overpass_cache
                     ORDER BY last_access ASC
                     LIMIT ?
                 )`,
                [remove]
            );
        }

        console.log("🧹 Pulizia cache completata.");
    } catch (err) {
        console.error("❌ Errore pulizia cache:", err);
    }
}

// pulizia periodica
setInterval(() => {
    cleanCache().catch(err => console.error("Errore cleanCache:", err));
}, CACHE_CLEAN_INTERVAL_MS);

/* ============================================================
   OVERPASS FALLBACK + RATE LIMIT + DEDUP
   ============================================================ */

const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter"
];

let currentServerIndex = 0;

// rate limit Overpass (per evitare ban)
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1000;

async function rateLimit() {
    const now = Date.now();
    const delta = now - lastRequestTime;

    if (delta < RATE_LIMIT_MS) {
        await new Promise(r => setTimeout(r, RATE_LIMIT_MS - delta));
    }

    lastRequestTime = Date.now();
}

// dedup richieste identiche
const pendingRequests = new Map();

async function fetchOverpass(query) {
    await rateLimit();

    const maxRetries = OVERPASS_SERVERS.length;
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
        const url = OVERPASS_SERVERS[currentServerIndex];

        try {
            console.log(`🌍 Overpass → ${url}`);

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ data: query }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            return await response.json();
        } catch (err) {
            console.warn(`⚠️ Server Overpass fallito (${url}):`, err.message);
            lastError = err;

            // passa al server successivo
            currentServerIndex = (currentServerIndex + 1) % OVERPASS_SERVERS.length;
            console.log(`🔁 Provo server alternativo: ${OVERPASS_SERVERS[currentServerIndex]}`);

            await new Promise(r => setTimeout(r, 500));
        }
    }

    throw new Error("Tutti i server Overpass non rispondono. Ultimo errore: " + (lastError?.message || "sconosciuto"));
}

/* ============================================================
   UTILITY CACHE
   ============================================================ */

function buildCacheKeyFromQuery(query) {
    // chiave deterministica semplice
    return Buffer.from(query).toString("base64");
}

// tile spaziale (griglia ~100m)
function tileFromLatLon(lat, lon) {
    const factor = 1000;
    return {
        tile_lat: Math.round(lat * factor),
        tile_lon: Math.round(lon * factor)
    };
}

/* ============================================================
   ENDPOINT 1 — lista nazioni (proxy semplice)
   ============================================================ */

app.get("/api/listaNazioni", async (req, res) => {
    const url = "https://www.viaggiaresicuri.it/schede_paese/lista_nazioni.json";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({
                error: `Errore nel recupero dei dati: ${response.status}`
            });
        }

        const text = await response.text();
        res.send(text);
    } catch (error) {
        console.error("Errore proxy listaNazioni:", error);
        res.status(500).json({ error: "Errore interno al proxy" });
    }
});

/* ============================================================
   ENDPOINT 2 — /api/overpass (generico, solo { query })
   ============================================================ */

app.post("/api/overpass", async (req, res) => {
    const { query } = req.body || {};
    if (!query) {
        return res.status(400).json({ error: "Manca il campo 'query'" });
    }

    const key = buildCacheKeyFromQuery(query);

    try {
        // 1) cache hit?
        const cachedRow = await dbGet(
            "SELECT response FROM overpass_cache WHERE key = ?",
            [key]
        );

        if (cachedRow) {
            await dbRun(
                "UPDATE overpass_cache SET last_access = ? WHERE key = ?",
                [Date.now(), key]
            );

            return res.json({
                fromCache: true,
                ...JSON.parse(cachedRow.response)
            });
        }

        // 2) dedup richieste identiche
        if (pendingRequests.has(key)) {
            const result = await pendingRequests.get(key);
            return res.json({
                fromCache: false,
                ...result
            });
        }

        // 3) nuova richiesta
        const promise = (async () => {
            try {
                const json = await fetchOverpass(query);

                await dbRun(
                    `INSERT OR REPLACE INTO overpass_cache
                     (key, query, response, created_at, last_access, type, tile_lat, tile_lon, radius)
                     VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)`,
                    [
                        key,
                        query,
                        JSON.stringify(json),
                        Date.now(),
                        Date.now()
                    ]
                );

                return json;
            } finally {
                pendingRequests.delete(key);
            }
        })();

        pendingRequests.set(key, promise);

        const result = await promise;
        res.json({
            fromCache: false,
            ...result
        });
    } catch (error) {
        console.error("Errore proxy /api/overpass:", error);
        res.status(500).json({ error: "Errore interno proxy Overpass" });
    }
});

/* ============================================================
   ENDPOINT 3 — /api/overpass/surfacePoint
   body: { lat, lon, radius, type }
   ============================================================ */

app.post("/api/overpass/surfacePoint", async (req, res) => {
    const { lat, lon, radius = 20, type = "surface" } = req.body || {};

    if (typeof lat !== "number" || typeof lon !== "number") {
        return res.status(400).json({ error: "lat e lon devono essere numerici" });
    }

    const radiusInt = Math.round(radius);
    const { tile_lat, tile_lon } = tileFromLatLon(lat, lon);

    // Query Overpass per strade/sentieri attorno al punto
    const query = `
        [out:json][timeout:25];
        way(around:${radiusInt}, ${lat}, ${lon})["highway"];
        out tags;
    `;
    const cacheKey = buildCacheKeyFromQuery(query);

    try {
        // 1) cache spaziale (bucket)
        const spatialRow = await dbGet(
            `SELECT response FROM overpass_cache
             WHERE type = ?
               AND tile_lat = ?
               AND tile_lon = ?
               AND radius = ?
                 LIMIT 1`,
            [type, tile_lat, tile_lon, radiusInt]
        );

        if (spatialRow) {
            await dbRun(
                "UPDATE overpass_cache SET last_access = ? WHERE key = ?",
                [Date.now(), cacheKey]
            );

            return res.json({
                fromCache: true,
                ...JSON.parse(spatialRow.response)
            });
        }

        // 2) cache generica per la stessa query
        const cachedRow = await dbGet(
            "SELECT response FROM overpass_cache WHERE key = ?",
            [cacheKey]
        );

        if (cachedRow) {
            await dbRun(
                "UPDATE overpass_cache SET last_access = ? WHERE key = ?",
                [Date.now(), cacheKey]
            );

            return res.json({
                fromCache: true,
                ...JSON.parse(cachedRow.response)
            });
        }

        // 3) dedup su questa query
        if (pendingRequests.has(cacheKey)) {
            const result = await pendingRequests.get(cacheKey);
            return res.json({
                fromCache: false,
                ...result
            });
        }

        // 4) nuova richiesta
        const promise = (async () => {
            try {
                const json = await fetchOverpass(query);

                await dbRun(
                    `INSERT OR REPLACE INTO overpass_cache
                     (key, query, response, created_at, last_access, type, tile_lat, tile_lon, radius)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        cacheKey,
                        query,
                        JSON.stringify(json),
                        Date.now(),
                        Date.now(),
                        type,
                        tile_lat,
                        tile_lon,
                        radiusInt
                    ]
                );

                return json;
            } finally {
                pendingRequests.delete(cacheKey);
            }
        })();

        pendingRequests.set(cacheKey, promise);

        const result = await promise;

        res.json({
            fromCache: false,
            ...result
        });
    } catch (error) {
        console.error("Errore proxy /api/overpass/surfacePoint:", error);
        res.status(500).json({ error: "Errore interno proxy surfacePoint" });
    }
});

/* ============================================================
   ENDPOINT 4 — /api/overpass/batch
   body: { queries: [ "...", "..." ] }
   ============================================================ */

app.post("/api/overpass/batch", async (req, res) => {
    const { queries } = req.body || {};

    if (!Array.isArray(queries) || !queries.length) {
        return res.status(400).json({ error: "queries deve essere un array non vuoto" });
    }

    const results = [];

    for (const q of queries) {
        if (!q || typeof q !== "string") {
            results.push({ error: "query non valida", elements: [] });
            continue;
        }

        const key = buildCacheKeyFromQuery(q);

        try {
            // cache?
            const cachedRow = await dbGet(
                "SELECT response FROM overpass_cache WHERE key = ?",
                [key]
            );

            if (cachedRow) {
                await dbRun(
                    "UPDATE overpass_cache SET last_access = ? WHERE key = ?",
                    [Date.now(), key]
                );

                results.push({
                    fromCache: true,
                    ...JSON.parse(cachedRow.response)
                });

                continue;
            }

            // dedup
            let promise;
            if (pendingRequests.has(key)) {
                promise = pendingRequests.get(key);
            } else {
                promise = (async () => {
                    try {
                        const json = await fetchOverpass(q);

                        await dbRun(
                            `INSERT OR REPLACE INTO overpass_cache
                             (key, query, response, created_at, last_access, type, tile_lat, tile_lon, radius)
                             VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)`,
                            [
                                key,
                                q,
                                JSON.stringify(json),
                                Date.now(),
                                Date.now()
                            ]
                        );

                        return json;
                    } finally {
                        pendingRequests.delete(key);
                    }
                })();

                pendingRequests.set(key, promise);
            }

            const result = await promise;

            results.push({
                fromCache: false,
                ...result
            });
        } catch (error) {
            console.error("Errore batch item:", error);
            results.push({
                error: String(error),
                elements: [],
                fallback: true
            });
        }
    }

    res.json({ results });
});

/* ============================================================
   ENDPOINT 5 — /api/cache/status
   ============================================================ */

app.get("/api/cache/status", async (req, res) => {
    try {
        const countRow = await dbGet("SELECT COUNT(*) AS count FROM overpass_cache");
        const oldest = await dbGet("SELECT MIN(created_at) AS oldest FROM overpass_cache");
        const newest = await dbGet("SELECT MAX(created_at) AS newest FROM overpass_cache");

        res.json({
            items: countRow.count,
            oldest: oldest?.oldest ? new Date(oldest.oldest).toISOString() : null,
            newest: newest?.newest ? new Date(newest.newest).toISOString() : null,
            ttl_days: CACHE_TTL_MS / (1000 * 60 * 60 * 24),
            max_items: CACHE_MAX_ITEMS
        });
    } catch (error) {
        console.error("Errore /api/cache/status:", error);
        res.status(500).json({ error: "Errore lettura stato cache" });
    }
});

/* ============================================================
   AVVIO SERVER (dopo init DB)
   ============================================================ */

(async () => {
    try {
        await initDatabase();

        app.listen(PORT, () => {
            console.log(`🔥 Proxy Overpass attivo su http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Errore inizializzazione DB:", err);
        process.exit(1);
    }
})();
