<template>
    <!-- Legenda -->
    <div class="flex flex-wrap text-xs text-gray-600 mb-2">
        <div v-for="(range,i) in slopeRanges"
             :key="i"
             class="relative flex items-center mr-[10px] group cursor-help">

            <span class="w-4 h-2 rounded-sm block mr-[5px]"
                  :style="{ background: range.color }"></span>
            <span>{{ range.label }} ({{ getKmForRange(range).toFixed(1) }} km)</span>

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
        style="cursor: crosshair"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
    ></canvas>

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
        onResetMap: Function,
        onSelectSegment: Function,
        disableFollow: Function,
        enableFollow: Function
    },
    data() {
        return {
            chart: null,
            hoverIndex: null,
            slopes: [],
            cumDist: [],
            cumGain: [],
            cumLoss: [],
            slopeKm: [],
            isBrushing: false,
            brushStartX: null,
            brushEndX: null,
            zoomRange: null
        };
    },
    methods: {

        /* -----------------------------------
         * Plugin: Riempimento salite
         ----------------------------------- */
        createFillClimbPlugin() {
            return {
                id: "fillClimbPlugin",

                afterDatasetsDraw(chart, args, opts) {
                    const meta = chart.getDatasetMeta(0);

                    const { ctx, chartArea } = chart;
                    const elevations = chart.data.datasets[0].data;
                    const slopes = opts.slopes;
                    const ranges = opts.slopeRanges;

                    const getColor = slope => {
                        for (const r of ranges) {
                            if (slope >= r.min && slope < r.max) return r.color;
                        }
                        return null;
                    };

                    ctx.save();

                    for (let i = 1; i < elevations.length; i++) {
                        const slope = slopes[i];
                        if (slope <= 0) continue;

                        const prevPoint = meta.data[i - 1];
                        const currentPoint = meta.data[i];

                        if (!prevPoint || !currentPoint) continue;

                        const p0 = prevPoint.getProps(["x", "y"], true);
                        const p1 = currentPoint.getProps(["x", "y"], true);

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
         * Plugin: Cursore verticale
         ----------------------------------- */
        createVerticalCursorPlugin() {
            const self = this;

            return {
                id: "verticalCursorPlugin",

                afterDatasetsDraw(chart) {
                    const index = self.hoverIndex;
                    if (index === null || index === undefined) return;

                    const meta = chart.getDatasetMeta(0);
                    if (!meta || !meta.data || !meta.data[index]) return;

                    const point = meta.data[index];
                    const { x } = point.getProps(["x"], true);
                    const { ctx, chartArea } = chart;

                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.moveTo(x, chartArea.top);
                    ctx.lineTo(x, chartArea.bottom);
                    ctx.stroke();
                    ctx.restore();
                }
            };
        },

        /* -----------------------------------
         * Plugin: Tooltip personalizzato
         ----------------------------------- */
        createTooltipCursorPlugin() {
            const self = this;

            return {
                id: "customTooltipPlugin",

                afterDraw(chart) {
                    const index = self.hoverIndex;
                    if (index == null) return;

                    const meta = chart.getDatasetMeta(0);
                    if (!meta || !meta.data || !meta.data[index]) return;

                    const point = meta.data[index];
                    const { ctx, chartArea } = chart;

                    // -----------------------------------------------------
                    // 1) Calcolo X esatta (usiamo la stessa del cursore)
                    // -----------------------------------------------------
                    const xScale = chart.scales.x;
                    const xValue = self.cumDist[index];
                    const x = xScale.getPixelForValue(xValue);   // ← X CORRETTA

                    // -----------------------------------------------------
                    // 2) Calcolo Y reale del punto (solo Y è del dataset)
                    // -----------------------------------------------------
                    const y = point.getProps(["y"], true).y;

                    // -----------------------------------------------------
                    // 3) Recupero dati per il tooltip
                    // -----------------------------------------------------
                    const altitude = (self.chart.data.datasets[0].data[index].y || 0).toFixed(0);
                    const slope = (self.slopes[index] || 0).toFixed(1);
                    const dist = (self.cumDist[index] || 0).toFixed(2);
                    const gain = (self.cumGain[index] || 0).toFixed(0);
                    const loss = (self.cumLoss[index] || 0).toFixed(0);

                    const lines = [
                        `Distance: ${dist} km`,
                        `+${gain} / -${loss} m`,
                        `-------`,
                        `Altitude: ${altitude} m`,
                        `Slope: ${slope} %`
                    ];

                    // -----------------------------------------------------
                    // 4) Tooltip box (dimensioni)
                    // -----------------------------------------------------
                    ctx.font = "12px sans-serif";
                    const padding = 8;
                    const lineHeight = 16;

                    const textWidths = lines.map(t => ctx.measureText(t).width);
                    const boxWidth = Math.max(...textWidths) + padding * 2;
                    const boxHeight = lines.length * lineHeight + padding * 2;

                    // -----------------------------------------------------
                    // 5) Posizione tooltip (sopra o sotto)
                    // -----------------------------------------------------
                    let boxX = x + 12;
                    let boxY = y - boxHeight - 12;

                    if (boxY < chartArea.top + 5) {
                        boxY = y + 12;
                    }

                    // limiti orizzontali
                    if (boxX + boxWidth > chart.width - 5) {
                        boxX = x - boxWidth - 12;
                    }
                    if (boxX < 5) boxX = 5;

                    // -----------------------------------------------------
                    // 6) Disegno pallino blu sincronizzato
                    // -----------------------------------------------------
                    ctx.save();
                    ctx.fillStyle = "#3b82f6"; // blu tailwind
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();

                    // -----------------------------------------------------
                    // 7) Tooltip box
                    // -----------------------------------------------------
                    ctx.save();
                    ctx.fillStyle = "rgba(0,0,0,0.75)";
                    ctx.strokeStyle = "rgba(255,255,255,0.35)";
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
                    ctx.fill();
                    ctx.stroke();

                    // -----------------------------------------------------
                    // 8) Testo del tooltip
                    // -----------------------------------------------------
                    ctx.fillStyle = "#fff";
                    let textY = boxY + padding + 12;

                    lines.forEach(line => {
                        ctx.fillText(line, boxX + padding, textY);
                        textY += lineHeight;
                    });

                    ctx.restore();
                }
            };
        },

        /* -----------------------------------
         * Plugin: Selezione (brush) sul grafico
         * ----------------------------------- */
        createBrushSelectionPlugin() {
            const self = this;

            return {
                id: "brushSelectionPlugin",

                // Disegna overlay di selezione
                afterDraw(chart) {
                    if (!self.isBrushing || self.brushStartX == null || self.brushEndX == null) {
                        return;
                    }

                    const { ctx, chartArea } = chart;
                    const x1 = self.brushStartX;
                    const x2 = self.brushEndX;

                    const left = Math.max(Math.min(x1, x2), chartArea.left);
                    const right = Math.min(Math.max(x1, x2), chartArea.right);
                    const width = right - left;
                    if (width <= 0) return;

                    ctx.save();
                    // oscura il resto
                    ctx.fillStyle = "rgba(0,0,0,0.05)";
                    ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);

                    // evidenzia la selezione
                    ctx.fillStyle = "rgba(72, 187, 120, 0.25)"; // verdino
                    ctx.strokeStyle = "rgba(34, 139, 94, 0.8)";
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.rect(left, chartArea.top, width, chartArea.bottom - chartArea.top);
                    ctx.fill();
                    ctx.stroke();

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

            let startX = 0;
            let endX = cumDist[cumDist.length - 1];

            if(this.brushStartX && this.brushEndX) {

                const minX = Math.min(this.brushStartX, this.brushEndX);
                const maxX = Math.max(this.brushStartX, this.brushEndX);

                if (maxX - minX < 5) return;

                const xScale = this.chart.scales.x;

                const startVal = xScale.getValueForPixel(minX);
                const endVal = xScale.getValueForPixel(maxX);

                let startIndex = this.cumDist.findIndex(v => v >= startVal);
                let endIndex = this.cumDist.length - 1;

                for (let i = this.cumDist.length - 1; i >= 0; i--) {
                    if (this.cumDist[i] <= endVal) {
                        endIndex = i;
                        break;
                    }
                }

                startX = this.cumDist[startIndex];
                endX = this.cumDist[endIndex];

                this.brushStartX = null;
                this.brushEndX = null;
            }

            if (this.chart) this.chart.destroy();

            const fillPlugin = this.createFillClimbPlugin();
            const verticalCursorPlugin = this.createVerticalCursorPlugin();
            const tooltipCursorPlugin = this.createTooltipCursorPlugin();
            const brushSelectionPlugin = this.createBrushSelectionPlugin();

            const ctx = this.$refs.chartCanvas.getContext("2d");

            this.chart = new Chart(ctx, {
                type: "line",
                data: {
                    //labels: cumDist,
                    datasets: [
                        {
                            label: "Altitude (m)",
                            data: elevations.map((y, i) => ({ x: Number(cumDist[i]), y: Number(y) })),
                            parsing: {
                                xAxisKey: "x",
                                yAxisKey: "y"
                            },
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
                    interaction: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: false
                        },
                        fillClimbPlugin: {
                            slopes,
                            slopeRanges: this.slopeRanges
                        }
                    },
                    scales: {
                        x: {
                            type: "linear",
                            title: { display: true, text: "Distance (km)" },
                            min: startX,
                            max: endX
                        },
                        y: {
                            title: { display: true, text: "Altitude (m)" }
                        }
                    },
                },
                plugins: [
                    fillPlugin,
                    verticalCursorPlugin,
                    tooltipCursorPlugin,
                    brushSelectionPlugin
                ]
            });
        },

        /** -----------------------------------
         * Hover proveniente dalla MAPPA
         * ----------------------------------- */
        setHoverIndex(index) {
            if (!this.chart) return;

            const meta = this.chart.getDatasetMeta(0);
            if (!meta?.data?.[index]) return;

            // Aggiorna solo l’indice
            this.hoverIndex = index;

            // Ridisegna il layer overlay (cursor + tooltip)
            requestAnimationFrame(() => {
                this.chart.draw();
            });
        },
        clearHoverIndex() {
            console.log('leave');
        },

        /* -----------------------------------
         * Gestione segmento selezionato
         * ----------------------------------- */
        handleSegmentSelection(start, end) {

            // callback verso il padre
            this.onSelectSegment?.({ start, end });

            // Disattiva il follow sulla mappa
            // this.disableFollow?.();

            // usa il plugin per zoomare
            this.$nextTick(() => {
                this.buildChart();
            });
        },

        resetZoom() {
            this.$nextTick(() => {
                this.buildChart();
            });
        },

        /* -----------------------------------
         * Aggiorno la posizione del cursore
         * ----------------------------------- */
        updateCursorPosition(evt) {
            const rect = this.$refs.chartCanvas.getBoundingClientRect();
            const xPixel = evt.clientX - rect.left;

            const scale = this.chart.scales.x;
            const area = this.chart.chartArea;

            if (!scale) return;

            // fuori area → reset
            if (xPixel < area.left || xPixel > area.right) {
                this.hoverIndex = null;
                this.onResetMap?.();
                requestAnimationFrame(() => this.chart.draw());
                return;
            }

            // pixel → valore km
            const xValue = scale.getValueForPixel(xPixel);

            // trova indice più vicino con ricerca binaria
            const index = this.findClosestIndex(this.cumDist, xValue);

            // se indice è uguale al precedente → NON ridisegnare
            if (index === this.hoverIndex) return;

            this.hoverIndex = index;

            this.onHoverPoint?.(index);
            this.onCenterMap?.(index);

            requestAnimationFrame(() => this.chart.draw());
        },

        findClosestIndex(arr, target) {
            let low = 0;
            let high = arr.length - 1;

            while (low < high) {
                const mid = Math.floor((low + high) / 2);

                if (arr[mid] < target) low = mid + 1;
                else high = mid;
            }

            // arr[low] è il primo >= target
            // scegli tra low e low-1 quello più vicino
            if (low === 0) return 0;
            if (low >= arr.length) return arr.length - 1;

            return Math.abs(arr[low] - target) < Math.abs(arr[low-1] - target)
                ? low : low - 1;
        },

        /* -----------------------------------
         * Handle mouse event
         * ----------------------------------- */
        handleMouseDown(evt) {
            if (!this.chart) return;

            const rect = this.$refs.chartCanvas.getBoundingClientRect();
            const x = evt.clientX - rect.left;
            const y = evt.clientY - rect.top;
            const area = this.chart.chartArea;
            if (!area) return;

            // dentro area del grafico?
            if (x < area.left || x > area.right || y < area.top || y > area.bottom) {
                this.isBrushing = false;
                return;
            }

            this.isBrushing = true;
            this.brushStartX = x;
            this.brushEndX = x;

            this.chart.draw();
        },

        handleMouseMove(evt) {
            if (!this.chart) return;

            this.updateCursorPosition(evt);

            const rect = this.$refs.chartCanvas.getBoundingClientRect();
            const x = evt.clientX - rect.left;
            const area = this.chart.chartArea;
            if (!area) return;

            const clampedX = Math.min(Math.max(x, area.left), area.right);
            this.brushEndX = clampedX;

            this.chart.draw();
        },

        handleMouseUp(evt) {
            if (!this.chart) return;
            if (!this.isBrushing) return;

            const area = this.chart.chartArea;
            if (!area) return;

            this.isBrushing = false;

            const minX = Math.min(this.brushStartX, this.brushEndX);
            const maxX = Math.max(this.brushStartX, this.brushEndX);

            if (maxX - minX < 5) return;

            const xScale = this.chart.scales.x;

            const startVal = xScale.getValueForPixel(minX);
            const endVal = xScale.getValueForPixel(maxX);

            let startIndex = this.cumDist.findIndex(v => v >= startVal);
            let endIndex = this.cumDist.length - 1;

            for (let i = this.cumDist.length - 1; i >= 0; i--) {
                if (this.cumDist[i] <= endVal) {
                    endIndex = i;
                    break;
                }
            }

            this.handleSegmentSelection(startIndex, endIndex);

        },

        handleMouseLeave(evt) {

            if (!this.chart) return;

            this.hoverIndex = null;
            this.isBrushing = false;
            this.brushStartX = null;
            this.brushEndX = null;

            this.onResetMap?.();

            this.chart.draw();
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