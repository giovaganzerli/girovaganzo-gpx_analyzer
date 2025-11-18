import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3001;

// Abilita CORS (per permettere le richieste dal frontend)
app.use(cors());

// Endpoint proxy
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
        console.error("Errore proxy:", error);
        res.status(500).json({ error: "Errore interno al proxy" });
    }
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Proxy attivo su http://localhost:${PORT}`);
});
