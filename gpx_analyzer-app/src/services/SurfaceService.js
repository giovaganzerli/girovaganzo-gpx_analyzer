// services/SurfaceService.js

// ------------------------------
// 1. Funzione per chiamare Overpass
// ------------------------------
async function fetchSurfaceTags(lat, lon, radius = 20) {
    const res = await fetch("http://localhost:3001/api/overpass/surfacePoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon, radius, type: "surface_highway" })
    });

    if (!res.ok) {
        console.warn("Errore proxy surfacePoint:", res.status);
        return null;
    }

    const json = await res.json();
    const ways = json.elements || [];
    if (!ways.length) return null;

    return ways[0].tags || null;
}

// ------------------------------
// 2. Classifica superficie in base ai tag OSM
// ------------------------------
function classifySurface(tags = {}) {
    const highway = tags.highway || "";
    const surface = tags.surface || "";
    const tracktype = tags.tracktype || "";
    const mtbscale = tags["mtb:scale"] || "";

    let surfaceType = "unknown";
    let surfaceGrade = (tracktype) ? tracktype.replace("grade", "") : "0";

    // singletrack / sentieri mtb
    if (highway === "path" || highway === "footway" || mtbscale) {
        surfaceType = "single_track";
    }

    // ciclabile
    else if (highway === "cycleway") {
        surfaceType = "bike_path";
    }

    else if (surface === "asphalt" || surface === "concrete" || surface === "paved") {
        surfaceType = "paved";
    }

    else if (surface === "paving_stones" || surface === "sett" || surface === "cobblestone") {
        surfaceType = "cobbled";
    }

    else if (surface === 'gravel' || surface === "compacted" || surface === "fine_gravel") {
        surfaceType = "hard_packed";
    }

    else if (surface === "dirt" || surface === "ground") {
        surfaceType = "unpaved";
    }

    // mapping di base
    return surfaceType +"#"+ surfaceGrade;
}

// ------------------------------
// 3. Colore per ogni tipo di superficie
// ------------------------------
function getSurfaceColor(_type) {

    const type = _type.split("#")[0];
    const grade = Number(_type.split("#")[1]);

    switch (type) {
        case "paved":            return darkenColor("#365ec3", 100-grade*25);
        case "cobbled":          return darkenColor("#6b7280", 100-grade*25);
        case "hard_packed":      return darkenColor("#fbbf24", 100-grade*25);
        case "unpaved":          return darkenColor("#4daa17", 100-grade*25);
        case "single_track":     return darkenColor("#c034e8", 100-grade*25);
        case "bike_path":        return darkenColor("#e4354e", 100-grade*25);
        default:                 return darkenColor("#1a1a1b", 100-grade*25);
    }
}

function darkenColor(color, percent) {
    // Strip the leading # if it's there
    color = color.replace(/^\s*#|\s*$/g, "");

    // Convert 3 char codes -> 6, e.g. `E0F` -> `EE00FF`
    if (color.length === 3) {
        color = color.replace(/(.)/g, "$1$1");
    }

    // Split HEX Color
    const hexR = color.substring(0, 2);
    const hexG = color.substring(2, 4);
    const hexB = color.substring(4, 6);

    // HEX to RGB
    let r = parseInt(hexR, 16);
    let g = parseInt(hexG, 16);
    let b = parseInt(hexB, 16);

    if (isNaN(r)) r = 0;
    if (isNaN(g)) g = 0;
    if (isNaN(b)) b = 0;

    // Manipulate
    const newR = Math.min(255, Math.floor(r + (r * percent) / 100));
    const newG = Math.min(255, Math.floor(g + (g * percent) / 100));
    const newB = Math.min(255, Math.floor(b + (b * percent) / 100));

    // RGB to HEX
    const newHexRColor = `${newR.toString(16)}`.padStart(2, "0");
    const newHexGColor = `${newG.toString(16)}`.padStart(2, "0");
    const newHexBColor = `${newB.toString(16)}`.padStart(2, "0");

    return "#" + newHexRColor + newHexGColor + newHexBColor;
}

// ------------------------------
// 4. Utility: distanza Haversine in metri
// ------------------------------
function haversineMeters(p1, p2) {
    const toRad = d => (d * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lon - p1.lon);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(p1.lat)) *
        Math.cos(toRad(p2.lat)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ------------------------------
// 5. Costruisci cumDist (km) dalla traccia
// ------------------------------
function buildCumDist(points) {
    const cumDist = [0];
    let dist = 0;

    for (let i = 1; i < points.length; i++) {
        const d = haversineMeters(points[i - 1], points[i]) / 1000;
        dist += d;
        cumDist.push(Number(dist.toFixed(3)));
    }

    return cumDist;
}

// ------------------------------
// 6. Funzione principale: calcola segmenti superficie
// ------------------------------
//
// Ritorna:
// [
//   { from: 0.0, to: 1.23, type: 'asfaltato', color: '#...' },
//   { from: 1.23, to: 3.8, type: 'sterrato',  color: '#...' },
//   ...
// ]
//
export async function detectSurfaceSegments(points) {
    if (!points || points.length < 2) return [];

    const cumDist = buildCumDist(points);
    const totalDist = cumDist[cumDist.length - 1];

    // per non stressare Overpass: max ~50 richieste
    const maxSamples = 50;
    const step = Math.max(1, Math.floor(points.length / maxSamples));

    const surfaceByIndex = new Array(points.length).fill("unknown#0");

    // 1) campiona alcuni punti lungo la traccia
    for (let i = 0; i < points.length; i += step) {
        const p = points[i];
        try {
            const tags = await fetchSurfaceTags(p.lat, p.lon);
            const type = classifySurface(tags || {});
            surfaceByIndex[i] = type;
        } catch (e) {
            console.warn("Errore fetch surface", e);
        }
    }

    // 2) riempi i buchi interpolando il tipo fra due punti noti
    let lastKnownType = surfaceByIndex[0] || "unknown#0";
    for (let i = 0; i < surfaceByIndex.length; i++) {
        if (surfaceByIndex[i] && surfaceByIndex[i] !== "unknown#0") {
            lastKnownType = surfaceByIndex[i];
        } else {
            surfaceByIndex[i] = lastKnownType;
        }
    }

    // 3) costruisci segmenti compatti (merge di tratti con stesso tipo)
    const segments = [];
    let currentType = surfaceByIndex[0];
    let segStartDist = cumDist[0];

    for (let i = 1; i < surfaceByIndex.length; i++) {
        if (surfaceByIndex[i] !== currentType) {
            segments.push({
                from: segStartDist,
                to: cumDist[i],
                type: currentType,
                color: getSurfaceColor(currentType)
            });
            segStartDist = cumDist[i];
            currentType = surfaceByIndex[i];
        }
    }

    // ultimo segmento
    segments.push({
        from: segStartDist,
        to: totalDist,
        type: currentType,
        color: getSurfaceColor(currentType)
    });

    return { segments, cumDist, totalDist };
}
