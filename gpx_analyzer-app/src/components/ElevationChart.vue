<template>
    <!-- Legenda -->
    <div class="flex flex-wrap text-xs text-gray-600 mb-2">
        <div v-for="(range,i) in slopeRanges"
             :key="i"
             class="relative flex items-center mr-[10px] group cursor-help">

            <span class="w-4 h-2 rounded-sm block mr-[5px]"
                  :style="{ background: range.color }"></span>

            <span>
                {{ range.label }} ({{ getKmForRange(range).toFixed(1) }} km)
            </span>

            <!-- Tooltip -->
            <div class="absolute z-10 left-0 top-full mt-1 invisible opacity-0
                        group-hover:visible group-hover:opacity-100
                        bg-black text-white text-[10px] px-2 py-1
                        rounded shadow-lg whitespace-nowrap transition-all">
                {{ formatSlopeRange(range) }} – {{ getKmForRange(range).toFixed(2) }} km
            </div>

        </div>
    </div>

    <canvas
        ref="chartCanvas"
        class="w-full h-[270px]"
        @mouseleave="handleLeave"></canvas>

</template>


<script>
import { Chart } from "chart.js/auto";

export default {
    name: "ElevationChart",
    props: {
        points: { type: Array, required: true },
        slopeRanges: { type: Array, required: true },
        onHoverPoint: Function,
        onCenterMap: Function,
        onResetMap: Function
    },
    data() {
        return {
            chart: null,
            slopes: [],
            cumDist: [],
            cumGain: [],
            cumLoss: [],
            slopeKm: []
        };
    },
    methods: {

        /* -----------------------------------
         * Plugin: riempimento salite
         ----------------------------------- */
        createFillClimbPlugin() {
            return {
                id: "fillClimbPlugin",

                afterDatasetDraw: (chart, args, pluginOptions) => {
                    const { ctx, chartArea } = chart;
                    const meta = chart.getDatasetMeta(0);

                    const elevations = chart.data.datasets[0].data;
                    const slopes = pluginOptions.slopes;
                    const ranges = pluginOptions.slopeRanges;

                    const getColor = slope => {
                        for (const r of ranges) {
                            if (slope >= r.min && slope < r.max)
                                return r.color;
                        }
                        return null;
                    };

                    ctx.save();

                    for (let i = 1; i < elevations.length; i++) {
                        const slope = slopes[i];
                        if (slope <= 0) continue;

                        const p0 = meta.data[i - 1].getProps(["x", "y"], true);
                        const p1 = meta.data[i].getProps(["x", "y"], true);

                        const color = getColor(slope);
                        if (!color) continue;

                        const hex = color.replace("#", "");
                        const r = parseInt(hex.substring(0, 2), 16);
                        const g = parseInt(hex.substring(2, 4), 16);
                        const b = parseInt(hex.substring(4, 6), 16);

                        ctx.fillStyle = `rgba(${r},${g},${b},0.25)`;

                        ctx.beginPath();
                        ctx.moveTo(p0.x, p0.y);
                        ctx.lineTo(p1.x, p1.y);
                        ctx.lineTo(p1.x, chartArea.bottom);
                        ctx.lineTo(p0.x, chartArea.bottom);
                        ctx.closePath();
                        ctx.fill();
                    }

                    ctx.restore();
                }
            };
        },

        /* -----------------------------------
         * Utility legenda
         ----------------------------------- */
        getKmForRange(range) {
            const item = this.slopeKm.find(
                r => r.min === range.min && r.max === range.max
            );
            return item ? item.km : 0;
        },

        formatSlopeRange(range) {
            if (range.min === -999) return `≤ ${range.max}%`;
            if (range.max === 999) return `≥ ${range.min}%`;
            return `${range.min}% – ${range.max}%`;
        },

        getSlopeRangeColor(slope) {
            for (const r of this.slopeRanges) {
                if (slope >= r.min && slope < r.max) return r.color;
            }
            return "#000";
        },

        /* -----------------------------------
         * Costruzione grafico
         ----------------------------------- */
        buildChart() {
            if (!this.points?.length) return;

            const elevations = [];
            const slopes = [];
            const cumDist = [];
            const cumGain = [];
            const cumLoss = [];

            const slopeKm = this.slopeRanges.map(r => ({ ...r, km: 0 }));

            const hav = (lat1, lon1, lat2, lon2) => {
                const toRad = d => d * Math.PI / 180;
                const R = 6371000;
                const dLat = toRad(lat2 - lat1);
                const dLon = toRad(lon2 - lon1);
                const a =
                    Math.sin(dLat/2)**2 +
                    Math.cos(toRad(lat1)) *
                    Math.cos(toRad(lat2)) *
                    Math.sin(dLon/2)**2;
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            };

            let dist = 0;
            let gain = 0;
            let loss = 0;

            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];

                if (i === 0) {
                    elevations.push(p.ele);
                    slopes.push(0);
                    cumDist.push(0);
                    cumGain.push(0);
                    cumLoss.push(0);
                    continue;
                }

                const prev = this.points[i - 1];
                const d = hav(prev.lat, prev.lon, p.lat, p.lon);
                const dKm = d / 1000;

                dist += dKm;
                cumDist.push(Number(dist.toFixed(2)));

                elevations.push(p.ele);

                const deltaEle = p.ele - prev.ele;
                const slope = d > 0 ? (deltaEle / d) * 100 : 0;
                slopes.push(slope);

                for (let r of slopeKm) {
                    if (slope >= r.min && slope < r.max) {
                        r.km += dKm;
                        break;
                    }
                }

                if (deltaEle > 0) gain += deltaEle;
                if (deltaEle < 0) loss += Math.abs(deltaEle);

                cumGain.push(gain);
                cumLoss.push(loss);
            }

            this.slopes = slopes;
            this.cumDist = cumDist;
            this.cumGain = cumGain;
            this.cumLoss = cumLoss;
            this.slopeKm = slopeKm;

            if (this.chart) this.chart.destroy();

            const fillPlugin = this.createFillClimbPlugin();

            const ctx = this.$refs.chartCanvas.getContext("2d");

            this.chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: cumDist,
                    datasets: [
                        {
                            label: "Altitude (m)",
                            data: elevations,
                            borderWidth: 2,
                            pointRadius: 0,
                            tension: 0.2,
                            segment: {
                                borderColor: ctx => {
                                    const i = ctx.p1DataIndex;
                                    return this.getSlopeRangeColor(this.slopes[i] ?? 0);
                                }
                            }
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    interaction: { mode: "nearest", intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: true,
                            displayColors: false,
                            callbacks: {
                                title: items => {
                                    const idx = items[0].dataIndex;
                                    return [
                                        `Altitude: ${elevations[idx].toFixed(0)} m`,
                                        `Slope: ${(slopes[idx] ?? 0).toFixed(1)} %`
                                    ];
                                },
                                label: item => {
                                    const idx = item.dataIndex;
                                    return [
                                        `Distance: ${cumDist[idx].toFixed(2)} km`,
                                        `+ Gain: ${cumGain[idx].toFixed(0)} m`,
                                        `– Loss: ${cumLoss[idx].toFixed(0)} m`
                                    ];
                                }
                            }
                        },
                        fillClimbPlugin: { slopes, slopeRanges: this.slopeRanges }
                    },
                    scales: {
                        x: { title: { display: true, text: "Distance (km)" } },
                        y: { title: { display: true, text: "Altitude (m)" } }
                    },

                    /* -----------------------------------
                     * Hover → mappa
                     ----------------------------------- */
                    onHover: (event, chartElement) => {
                        if (!chartElement.length) return;
                        const index = chartElement[0].index;

                        this.onHoverPoint?.(index);
                        this.onCenterMap?.(index);
                    }
                },
                plugins: [fillPlugin]
            });
        },

        /** -----------------------------------
         * Evento uscita mouse → reset
         ----------------------------------- */
        handleLeave() {
            this.onResetMap?.();
        },

        /** -----------------------------------
         * Hover proveniente dalla MAPPA
         ----------------------------------- */
        setHoverIndex(index) {
            /*
            if (!this.chart) return;

            const meta = this.chart.getDatasetMeta(0);
            const element = meta.data[index];

            this.chart.setActiveElements([{ datasetIndex: 0, index }]);

            this.chart.tooltip.setActiveElements(
                [{ datasetIndex: 0, index }],
                { x: element.x, y: element.y }
            );

            this.chart.update();
            */
        },

        clearHoverIndex() {
            /*
            if (!this.chart) return;

            this.chart.setActiveElements([]);
            this.chart.tooltip.setActiveElements([], {});
            this.chart.update();
            */
        }
    },

    watch: {
        points: {
            immediate: true,
            handler() {
                this.$nextTick(() => this.buildChart());
            }
        }
    }
};
</script>