<template>
    <div class="w-full h-[calc(100vh-140px)] bg-white rounded-xl border border-gray-200">
        <div ref="mapContainer" class="w-full h-full"></div>
    </div>
</template>

<style scoped>
.leaflet-container {
    width: 100%;
    height: 100%;
}
</style>

<script>
import L from "leaflet";

export default {
    name: "MapView",
    props: {
        points: Array,
        enableFollow: Boolean,  // follow solo da grafico → mappa
        fixedZoom: Number       // zoom fisso se follow attivo
    },
    data() {
        return {
            map: null,
            polyline: null,
            movingMarker: null,
        };
    },

    methods: {
        /* ------------------------------------------
         * Render iniziale mappa
         * ------------------------------------------ */
        renderMap(points) {
            if (!points?.length) return;

            if (!this.map) {
                this.map = L.map(this.$refs.mapContainer).setView(
                    [points[0].lat, points[0].lon],
                    13
                );

                L.tileLayer(
                    "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
                    {
                        maxZoom: 20,
                        attribution: "© CyclOSM & OSM contributors"
                    }
                ).addTo(this.map);

                L.tileLayer(
                    "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
                    {
                        attribution: "Esri Hillshade",
                        opacity: 0.35
                    }
                ).addTo(this.map);
            }

            if (this.polyline) this.map.removeLayer(this.polyline);
            if (this.movingMarker) this.map.removeLayer(this.movingMarker);

            const latlngs = points.map(p => [p.lat, p.lon]);

            this.polyline = L.polyline(latlngs, {
                color: "#3300ff",
                weight: 4
            }).addTo(this.map);

            this.map.fitBounds(this.polyline.getBounds(), {
                padding: [50, 50]
            });

            this.movingMarker = L.circleMarker(latlngs[0], {
                radius: 6,
                color: "#ff0000",
                fillColor: "#ff0000",
                fillOpacity: 1
            }).addTo(this.map);

            /* ------------------------------------------
             * Hover sulla traccia → highlight grafico
             * ------------------------------------------ */
            this.polyline.on("mousemove", this.handleTrackHover);
            this.polyline.on("mouseout", this.handleTrackLeave);
        },

        /* ------------------------------------------
         * GRAFICO → MAPPA  (sposta marker)
         * ------------------------------------------ */
        updateMarker(index) {
            if (!this.points || !this.points[index] || !this.movingMarker) return;

            const p = this.points[index];
            this.movingMarker.setLatLng([p.lat, p.lon]);
        },

        /* ------------------------------------------
         * GRAFICO → MAPPA  (centra vista)
         * ------------------------------------------ */
        centerMap(index) {
            if (!this.enableFollow) return;
            if (!this.points[index] || !this.map) return;

            const p = this.points[index];

            this.map.setView(
                [p.lat, p.lon],
                this.fixedZoom ?? this.map.getZoom(),
                { animate: false }
            );
        },

        /* ------------------------------------------
         * MAPPA → GRAFICO (hover sulla linea)
         * ------------------------------------------ */
        handleTrackHover(e) {
            const latlng = e.latlng;

            // Trova il punto più vicino sulla traccia
            let nearestIndex = 0;
            let minDist = Infinity;

            this.points.forEach((p, i) => {
                const d =
                    Math.pow(p.lat - latlng.lat, 2) +
                    Math.pow(p.lon - latlng.lng, 2);

                if (d < minDist) {
                    minDist = d;
                    nearestIndex = i;
                }
            });

            // Aggiorna marker SOLO visivamente, NON follow/zoom
            this.movingMarker.setLatLng([latlng.lat, latlng.lng]);

            // Chiama highlight grafico
            this.$emit("hover-from-map", nearestIndex);
        },

        /* ------------------------------------------
         * MAPPA → GRAFICO (uscita hover)
         * ------------------------------------------ */
        handleTrackLeave() {
            this.$emit("hover-from-map-end");
        }
    },

    watch: {
        points(newVal) {
            if (newVal) this.renderMap(newVal);
        }
    }
};
</script>
