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
import { ref } from "vue"

export default {
    name: "MapView",
    props: {
        points: { type: Array, required: true },
        enableFollow: Boolean,
        onHover: Function,
        onSegmentSelect: Function,
        onSegmentReset: Function
    },

    setup() {
        const fixedZoom = ref(14);

        return {
            fixedZoom
        }
    },

    data() {
        return {
            map: null,
            mapMarker: null,
            gpxTrack: null,
            selectedSegment: {
                segment: null,
                segmentStart: null,
                segmentEnd: null,
                segmentSelection: null
            }
        }
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

            if (this.gpxTrack) this.map.removeLayer(this.gpxTrack);
            if (this.mapMarker) this.map.removeLayer(this.mapMarker);

            const latlngs = points.map(p => [p.lat, p.lon]);

            this.gpxTrack = L.polyline(latlngs, {
                color: "#3300ff",
                weight: 4,
                interactive: true,
                bubblingMouseEvents: false,
                renderer: L.svg()
            }).addTo(this.map);

            this.map.fitBounds(this.gpxTrack.getBounds(), {
                padding: [50, 50]
            });

            this.mapMarker = L.circleMarker(latlngs[0], {
                radius: 6,
                color: "#ff0000",
                fillColor: "#ff0000",
                fillOpacity: 1,
                interactive: false
            }).addTo(this.map);

            /* ------------------------------------------
             * Hover sulla traccia → highlight grafico
             * ------------------------------------------ */
            this.gpxTrack.on("mousemove", this.handleTrackHover);
            this.gpxTrack.on("click", this.handleTrackClick);
        },

        /* ------------------------------------------
         * GRAFICO → MAPPA  (sposta marker)
         * ------------------------------------------ */
        updateMarker(index) {
            if (!this.points || !this.points[index] || !this.mapMarker) return;

            const p = this.points[index];
            this.mapMarker.setLatLng([p.lat, p.lon]);
            if(this.enableFollow) this.centerMap(index);
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
            this.mapMarker.setLatLng([latlng.lat, latlng.lng]);

            // Emette evento su Report.vue
            this.onHover?.(...[nearestIndex, 'Map']);
        },

        handleTrackClick(e) {
            if (!this.points || !this.points.length) return;

            if(this.selectedSegment.segmentEnd) {
                this.clearHighlightedSegment(false);
            }

            const latlng = e.latlng;

            // Trova indice più vicino sulla traccia (come handleTrackHover)
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

            // 1º CLICK → inizio
            if (this.selectedSegment.segmentStart === null) {
                this.selectedSegment.segmentStart = nearestIndex;

                // evidenza il singolo punto cliccato
                this.highlightSinglePoint(nearestIndex);

                return;
            }

            // 2º CLICK → fine
            this.selectedSegment.segmentEnd = nearestIndex;

            // Normalizza (start < end)
            const start = Math.min(this.selectedSegment.segmentStart, this.selectedSegment.segmentEnd);
            const end = Math.max(this.selectedSegment.segmentStart, this.selectedSegment.segmentEnd);

            // evidenzia il segmento completo
            this.highlightSegment({ start, end });
        },

        /* ------------------------------------------
         * Evidenzia segmento selezionato + zoom mappa
         * ------------------------------------------ */
        highlightSegment(coords, bypass = false) {
            if (!this.gpxTrack) return;

            const segmentPoints = this.points.slice(coords.start, coords.end + 1);

            // Evita errori: serve minimo 2 punti validi
            if (!segmentPoints || segmentPoints.length < 2) {
                console.warn("Segmento troppo corto, impossibile calcolare bounds");
                return;
            }

            // Filtra eventuali punti invalidi
            const validPoints = segmentPoints.filter(p => p.lat && p.lon);
            if (validPoints.length < 2) {
                console.warn("Punti non validi per fitBounds()");
                return;
            }

            // Rimuovi precedente highlight
            if (this.selectedSegment.segment) {
                this.map.removeLayer(this.selectedSegment.segment);
            }

            this.selectedSegment.segment = L.polyline(segmentPoints.map(p => [p.lat, p.lon]), {
                color: "#f97316",
                weight: 6,
                opacity: 0.8,
                className: "!pointer-events-none"
            }).addTo(this.map);

            // Zoom sulla porzione
            this.map.fitBounds(this.selectedSegment.segment.getBounds(), {
                padding: [30, 30]
            });

            // comunica al parent → Report.vue
            if(!bypass) this.onSegmentSelect?.(...[coords, 'Map']);
        },

        clearHighlightedSegment(clearZoom = true) {
            if (this.selectedSegment.segmentSelection) {
                this.map.removeLayer(this.selectedSegment.segmentSelection);
                this.selectedSegment.segmentSelection = null;
            }

            if (this.selectedSegment.segment) {
                this.map.removeLayer(this.selectedSegment.segment);
                this.selectedSegment.segment = null;
            }

            // Reset zoom to full track
            if (this.gpxTrack && clearZoom) {
                this.map.fitBounds(this.gpxTrack.getBounds(), {
                    padding: [50, 50]
                });
            }

            // reset selettore interno
            this.selectedSegment.segmentStart = null;
            this.selectedSegment.segmentEnd = null;
        },

        highlightSinglePoint(index) {
            if (!this.points[index] || !this.map) return;

            const p = this.points[index];

            // rimuovi marker precedente
            if (this.selectedSegment.segmentSelection) {
                this.map.removeLayer(this.selectedSegment.segmentSelection);
            }

            this.selectedSegment.segmentSelection = L.circleMarker([p.lat, p.lon], {
                radius: 7,
                color: "#f97316",
                fillColor: "#f97316",
                fillOpacity: 0.9
            }).addTo(this.map);
        }
    },

    watch: {
        points(newVal) {
            if (newVal) this.renderMap(newVal);
        }
    }
};
</script>