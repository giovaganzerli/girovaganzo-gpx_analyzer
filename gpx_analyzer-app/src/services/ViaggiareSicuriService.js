export async function getCountryList() {
    try {
        const response = await fetch("http://localhost:3001/api/listaNazioni");

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        return await response.text(); // o .json() se sai che è JSON
    } catch (error) {
        console.error("Errore nel servizio ViaggiareSicuri:", error);
        throw error;
    }
}