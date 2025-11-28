<template>
    <div class="w-full mt-4">
        <!-- Barra timeline -->
        <div class="w-full h-3 rounded-full overflow-hidden bg-gray-200 flex">
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
export default {
    name: "SurfaceTimeline",
    props: {
        segments: {
            type: Array,
            required: true
        },
        totalDist: {
            type: Number,
            required: true
        }
    },
    computed: {
        normalizedSegments() {
            if (!this.totalDist || !this.segments.length) return [];

            return this.segments.map(seg => {
                const length = seg.to - seg.from;
                const width = (length / this.totalDist) * 100;
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
                        label: this.mapTypeToLabel(seg.type.split('#')[0])
                    });
                }
            });
            return Array.from(map.values());
        }
    },
    methods: {
        mapTypeToLabel(type) {
            switch (type) {
                case "paved":            return "Paved";
                case "cobbled":          return "Coppbled";
                case "hard_packed":      return "Hard-packed";
                case "unpaved":          return "Unpaved";
                case "single_track":     return "Single track";
                case "bike_path":        return "Bike path";
                default:                 return "Unknown";
            }
        }
    }
};
</script>
