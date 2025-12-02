<template>
    <div class="w-full mt-4">

        <!-- Barra timeline -->
        <div
            class="relative overflow-hidden w-full h-3 rounded-full bg-gray-200 flex"
            ref="timelineBar"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseLeave"
        >

            <!-- Overlay selezione (mentre trascini) -->
            <div
                v-if="selectedSegment.isSelecting && selectedSegment.segmentStart !== null && selectedSegment.segmentEnd !== null"
                class="absolute top-0 bottom-0 bg-green-400 bg-opacity-25 pointer-events-none border border-green-600"
                :style="{
                    left: Math.min(selectedSegment.segmentStart, selectedSegment.segmentEnd) + 'px',
                    width: Math.abs(selectedSegment.segmentEnd - selectedSegment.segmentStart) + 'px'
                }"
            ></div>

            <!-- Cursore -->
            <div
                v-if="timelineMarker !== null"
                class="absolute top-0 bottom-0 w-[2px] bg-black opacity-50 pointer-events-none"
                :style="{ left: cursorLeft + 'px' }"
            ></div>

            <div
                v-for="(seg, i) in normalizedSegments"
                :key="i"
                class="h-full"
                :style="{
                    width: seg.width + '%',
                    backgroundColor: seg.color
                }"
            ></div>
        </div>

        <!-- Legenda -->
        <div class="flex flex-wrap gap-3 mt-3 text-xs text-gray-700">
            <div
                v-for="type in surfaceLegend"
                :key="type.type"
                class="flex items-center gap-1"
            >
                <span
                    class="w-3 h-3 rounded-sm block"
                    :style="{ backgroundColor: type.color }"
                ></span>
                <span>{{ type.label }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

// SERVICES
import { detectSurfaceSegments } from "../services/SurfaceService.js";

export default {
    name: "SurfaceTimeline",
    props: {
        points: { type: Array, required: true },
        totalDist: Number,
        onHover: Function,
        onSegmentSelect: Function,
        onResetMap: Function
    },

    setup() {
        const surfacesLegend = ref([
            { label: "Unknown", value: "unknown", color: "#1a1a1b" },
            { label: "Paved", value: "paved", color: "#365ec3" },
            { label: "Coppbled", value: "coppled", color: "#6b7280" },
            { label: "Hard packed", value: "hard_packed", color: "#fbbf24" },
            { label: "Unpaved", value: "unpaved", color: "#4daa17" },
            { label: "Single track", value: "single_track", color: "#c034e8" },
            { label: "Bike path", value: "bike_path", color: "#e4354e" }
        ]);

        // Config zoom → percentuale di percorso visibile e precisione in metri
        const zoomPrecisionSteps = [
            { maxPercent: 100, precision: 5000 }, // vista intera: 5 km
            { maxPercent: 40,  precision: 3000 },
            { maxPercent: 15,  precision: 2000 },
            { maxPercent: 5,   precision: 1000 },
            { maxPercent: 2,   precision: 500 },
            { maxPercent: 1,   precision: 250 }, // zoom massimo
        ];

        return {
            surfacesLegend,
            zoomPrecisionSteps
        };
    },

    data() {
        return {
            timelineMarker: null,
            timelineProps: {

            },
            segments: [{
                from: 0,
                to: 0,
                type: '',
                color: ''
            }],
            selectedSegment: {
                segmentStart: null,
                segmentEnd: null,
                isSelecting: false
            },
            cumDist: [],
            visibleTotalDist: 0,
            timelineWidth: 0
        };
    },

    computed: {
        normalizedSegments() {
            if (!this.visibleTotalDist || !this.segments.length) return [];

            return this.segments.map(seg => {
                const length = seg.to - seg.from;
                const width = (length / this.visibleTotalDist) * 100;
                return {
                    ...seg,
                    width: Math.max(width, 0.5) // minimo visivo
                };
            });
        },

        surfaceLegend() {
            // prendi tipi unici presenti
            const map = new Map();
            this.segments.forEach(seg => {
                if (!map.has(seg.type)) {
                    map.set(seg.type.split('#')[0], {
                        type: seg.type,
                        color: seg.color,
                        label: this.mapTypeToLabel(seg.type.split('#')[0]).label
                    });
                }
            });
            return Array.from(map.values());
        },

        // posizione cursore in px
        cursorLeft() {
            if (this.timelineMarker == null || !this.cumDist.length || !this.visibleTotalDist || !this.timelineWidth) {
                return 0;
            }

            const dist = this.cumDist[this.timelineMarker];
            const ratio = dist / this.visibleTotalDist;
            return ratio * this.timelineWidth;
        }
    },

    methods: {
        mapTypeToLabel(_type) {
            const type = this.surfacesLegend[0];
            const type_obj = this.surfacesLegend.find((surface) => {
                return surface.value === _type;
            });
            return (type_obj) ? type_obj : type;
        },

        findClosestIndex(arr, target) {
            let low = 0;
            let high = arr.length - 1;

            while (low < high) {
                const mid = Math.floor((low + high) / 2);
                if (arr[mid] < target) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }

            if (low === 0) return 0;
            if (low >= arr.length) return arr.length - 1;

            return Math.abs(arr[low] - target) < Math.abs(arr[low - 1] - target)
                ? low
                : low - 1;
        },

        /* -------------------------------------
         * Calcolo distanze cumulative da una lista di punti
         * ------------------------------------- */
        computeCumDistFromPoints(pts) {
            const hav = (lat1, lon1, lat2, lon2) => {
                const toRad = d => d * Math.PI / 180;
                const R = 6371000;
                const dLat = toRad(lat2 - lat1);
                const dLon = toRad(lon2 - lon1);
                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(lat1)) *
                    Math.cos(toRad(lat2)) *
                    Math.sin(dLon / 2) ** 2;

                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            };

            const cum = [];
            let dist = 0;

            for (let i = 0; i < pts.length; i++) {
                if (i === 0) {
                    cum.push(0);
                    continue;
                }

                const prev = pts[i - 1];
                const p = pts[i];
                const d = hav(prev.lat, prev.lon, p.lat, p.lon);

                dist += d / 1000;
                cum.push(Number(dist.toFixed(2)));
            }

            return {
                totalDistKm: dist,
                cumDist: cum
            };
        },

        /* -------------------------------------
         * Ricostruisce la timeline in base al range corrente
         * ------------------------------------- */
        async rebuildTimelineFromRange() {
            const allPoints = this.points || [];
            if (!allPoints.length) {
                this.segments = [];
                this.cumDist = [];
                this.visibleTotalDist = 0;
                this.timelineMarker = null;
                return;
            }

            const start = Math.max(0, this.selectedSegment.segmentStart || 0);
            const end = (this.selectedSegment.segmentEnd != null)
                ? Math.min(this.selectedSegment.segmentEnd, allPoints.length - 1)
                : allPoints.length - 1;

            if (end <= start) {
                this.segments = [];
                this.cumDist = [];
                this.visibleTotalDist = 0;
                this.timelineMarker = null;
                return;
            }

            const pts = allPoints.slice(start, end + 1);

            const { totalDistKm, cumDist } = this.computeCumDistFromPoints(pts);
            this.cumDist = cumDist;
            this.visibleTotalDist = totalDistKm;

            this.segments = await detectSurfaceSegments(pts, totalDistKm, { surfacesLegend: this.surfacesLegend });

            //this.saveToLocalStorage();

            this.timelineMarker = null;
            this.selectedSegment.segmentStart = null;
            this.selectedSegment.segmentEnd = null;
            this.selectedSegment.isSelecting = false;

            this.$nextTick(() => {
                if (this.$refs.timelineBar) {
                    this.timelineWidth = this.$refs.timelineBar.offsetWidth;
                }
            });
        },

        /* -------------------------------------
         * SELEZIONE DEL SEGMENTO: zoom su un range specifico
         * ------------------------------------- */
        highlightSegment(coords, bypass = false) {

            // Aggiorna il range visibile
            this.selectedSegment.segmentStart = coords.start;
            this.selectedSegment.segmentEnd = coords.end;

            // Ricostruisci timeline nel nuovo range
            this.rebuildTimelineFromRange();

            // Notifica al parent (Report.vue)
            if(!bypass) this.onSegmentSelect?.(...[coords, 'surfaceTimeline']);
        },

        /* -------------------------------------
         * RIMOZIONE DEL SEGMENTO
         * ------------------------------------- */
        clearHighlightedSegment() {

        },

        /* -------------------------------------
         * Gestione selezione (brush) sulla timeline
         * ------------------------------------- */
        handleMouseDown(evt) {
            if (!this.timelineWidth || !this.visibleTotalDist) return;

            const rect = this.$refs.timelineBar.getBoundingClientRect();
            const x = evt.clientX - rect.left;

            this.selectedSegment.isSelecting = true;
            this.selectedSegment.segmentStart = x;
            this.selectedSegment.segmentEnd = x;
        },

        handleMouseMove(evt) {
            if (!this.timelineWidth || !this.visibleTotalDist || !this.cumDist.length) return;

            const rect = this.$refs.timelineBar.getBoundingClientRect();
            const x = evt.clientX - rect.left;

            // se sto selezionando, aggiorno solo l'overlay
            if (this.selectedSegment.isSelecting) {
                const clampedX = Math.max(0, Math.min(x, this.timelineWidth));
                this.selectedSegment.segmentEnd = clampedX;
                return;
            }

            // altrimenti → hover normale
            const ratio = Math.min(Math.max(x / this.timelineWidth, 0), 1);
            const targetDist = ratio * this.visibleTotalDist;

            const localIndex = this.findClosestIndex(this.cumDist, targetDist);
            this.timelineMarker = localIndex;

            // indice globale = start range + indice locale
            const globalIndex = (this.selectedSegment.segmentStart || 0) + localIndex;
            this.onHover?.(...[globalIndex, 'SurfaceTimeline']);
        },

        handleMouseUp(evt) {
            if (!this.selectedSegment.isSelecting || !this.timelineWidth || !this.visibleTotalDist || !this.cumDist.length) {
                this.selectedSegment.isSelecting = false;
                return;
            }

            this.selectedSegment.isSelecting = false;

            const leftPx = Math.min(this.selectedSegment.segmentStart, this.selectedSegment.segmentEnd);
            const rightPx = Math.max(this.selectedSegment.segmentStart, this.selectedSegment.segmentEnd);

            // selezione troppo piccola → ignorata
            if (rightPx - leftPx < 5) {
                return;
            }

            const distStart = (leftPx / this.timelineWidth) * this.visibleTotalDist;
            const distEnd = (rightPx / this.timelineWidth) * this.visibleTotalDist;

            const localStartIndex = this.findClosestIndex(this.cumDist, distStart);
            const localEndIndex = this.findClosestIndex(this.cumDist, distEnd);

            const baseStart = this.selectedSegment.segmentStart || 0;
            const globalStart = baseStart + Math.min(localStartIndex, localEndIndex);
            const globalEnd = baseStart + Math.max(localStartIndex, localEndIndex);

            // comunico al parent il segmento selezionato (indici GLOBALI)
            this.highlightSegment({start: globalStart, end: globalEnd});
        },

        handleMouseLeave() {
            if (!this.selectedSegment.isSelecting) {
                this.timelineMarker = null;
            }
            this.onResetMap?.();
        },

        /* -------------------------------------
         * API: aggiornamento da grafico / mappa
         * ------------------------------------- */
        updateMarker(index) {
            if (!this.cumDist.length) return;

            const baseStart = this.selectedSegment.segmentStart || 0;
            const localIndex = index - baseStart;

            if (localIndex < 0 || localIndex >= this.cumDist.length) {
                this.timelineMarker = null;
                return;
            }

            this.timelineMarker = localIndex;
        },

        saveToLocalStorage() {
            const data = {
                segments: this.segments,
                cumDist: this.cumDist,
                visibleTotalDist: this.visibleTotalDist,
                selectedSegment: {
                    segmentStart: this.selectedSegment.segmentStart,
                    segmentEnd: this.selectedSegment.segmentEnd
                }
            };

            localStorage.setItem("reportSurface", JSON.stringify(data));
        },

        loadFromLocalStorage() {
            const raw = localStorage.getItem("reportSurface");
            if (!raw) return null;

            try {
                return JSON.parse(raw);
            } catch (e) {
                console.warn("reportSurface corrotto, lo ignoro.");
                return null;
            }
        }
    },

    mounted() {
        const init = async () => {
            const allPoints = this.points || [];
            if (!allPoints.length) return;

            this.selectedSegment.segmentStart = 0;
            this.selectedSegment.segmentEnd = allPoints.length - 1;

            const cache = this.loadFromLocalStorage();

            if (cache) {
                this.segments = cache.segments || [];
                this.cumDist = cache.cumDist || [];
                this.visibleTotalDist = cache.visibleTotalDist || 0;
                this.selectedSegment.segmentStart = cache.selectedSegment.segmentStart || 0;
                this.selectedSegment.segmentEnd = cache.selectedSegment.segmentEnd || (allPoints.length - 1);

                this.$nextTick(() => {
                    if (this.$refs.timelineBar) {
                        this.timelineWidth = this.$refs.timelineBar.offsetWidth;
                    }
                });

            } else {
                await this.rebuildTimelineFromRange();
                this.saveToLocalStorage();
            }
        };

        init();
    }
};
</script>