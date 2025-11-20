const gpxUtils = {
    haversine(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const toRad = deg => deg * Math.PI / 180;

        const a =
            Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(toRad(lon2 - lon1) / 2) ** 2;

        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
    getRoutePoints(xmlData) {
        // Estrazione dei punti
        const trkpts = [...xmlData.getElementsByTagName("trkpt")].map(p => ({
            lat: parseFloat(p.getAttribute("lat")),
            lon: parseFloat(p.getAttribute("lon")),
            ele: parseFloat(p.getElementsByTagName("ele")[0]?.textContent || 0),
            time: p.getElementsByTagName("time")[0]?.textContent
        }));

        if (trkpts.length < 2) {
            // GPX non valido o senza traccia!
            return;
        }

        return trkpts;
    },
    getRouteDistance(points) {
        let total = 0;
        for (let i = 1; i < points.length; i++) {
            total += this.haversine(
                points[i - 1].lat, points[i - 1].lon,
                points[i].lat, points[i].lon
            );
        }
        return Number((total / 1000).toFixed(2));
    },
    getRouteElevation(points) {

        let gain = 0;
        for (let i = 1; i < points.length; i++) {
            const diff = points[i].ele - points[i - 1].ele;
            if (diff > 0) gain += diff;
        }

        let loss = 0;
        for (let i = 1; i < points.length; i++) {
            const diff = points[i].ele - points[i - 1].ele;
            if (diff < 0) loss += Math.abs(diff);
        }

        return {gain: Math.round(gain), loss: Math.round(loss)};
    },
    getRouteAltitude(points) {
        const minAltitude = Math.min(...points.map(p => p.ele));
        const maxAltitude = Math.max(...points.map(p => p.ele));

        return { min: Math.round(minAltitude), max: Math.round(maxAltitude) };
    },
    getHills(points, elevationGainThreshold = 30) {
        // Definizione semplice: un "hill" se ci sono >30m di salita continua
        let hills = 0;
        let currentGain = 0;

        for (let i = 1; i < points.length; i++) {
            const diff = points[i].ele - points[i - 1].ele;

            if (diff > 0) {
                currentGain += diff;
            } else {
                if (currentGain > elevationGainThreshold) hills++;
                currentGain = 0;
            }
        }
        return hills;
    }
}

export default gpxUtils