<template>

    <section id="section-intro_banner" class="mt-[125px] px-[20px]">
        <div class="section-wrapper relative w-boxed flex justify-center items-center bg-[url(../src/assets/images/home-intro.jpg)] bg-cover bg-bottom rounded-box overflow-hidden">
            <div class="z-5 w-full p-[20px] text-center">
                <h1><b>Undress your Adventure</b></h1>
                <p class="mt-3"><i>Lascia che a sorprenderti sia l'avventura, non gli imprevisti.<br>Carica ora il tuo percorso e scopri subito cosa ti aspetta!</i></p>
                <p><a href="/upload" class="btn btn-secondary mt-5">Start your analysis now ></a></p>
            </div>
        </div>
    </section>

    <section id="section-features" class="w-full py-16 px-[20px] md:py-24 bg-primary-content/10 dark:bg-primary-content/5">
        <div class="section-wrapper w-boxed">

            <div class="mb-12 text-center">
                <h2 class="font-display text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">Discover every detail of Your Adventure</h2>
                <p class="mx-auto mt-3 max-w-[650px] text-base text-gray-600 dark:text-gray-400">Our powerful analysis engine breaks down your track into meaningful insights, helping you prepare better and relive your journey.</p>
            </div>

            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

                <div class="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-sm dark:bg-background-dark">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#25f46a]/20">
                        <span class="material-symbols-outlined text-2xl text-primary">timeline</span>
                    </div>
                    <h4 class="font-display text-lg font-bold text-gray-900 dark:text-white">In-Depth Route Metrics</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Get detailed stats like distance, elevation gain/loss, average speed, and segment analysis to understand your performance.</p>
                </div>

                <div class="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-sm dark:bg-background-dark">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fd7e14]/20">
                        <span class="material-symbols-outlined text-2xl text-[#fd7e14]">terrain</span>
                    </div>
                    <h4 class="font-display text-lg font-bold text-gray-900 dark:text-white">Terrain Analysis</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Visualize the terrain profile, analyze gradient steepness, and identify the most challenging parts of your route.</p>
                </div>

                <div class="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-sm dark:bg-background-dark">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ffc107]/20">
                        <span class="material-symbols-outlined text-2xl text-[#ffc107]">wb_sunny</span>
                    </div>
                    <h4 class="font-display text-lg font-bold text-gray-900 dark:text-white">Historical Weather Data</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Understand the conditions you faced with data on temperature, wind, and precipitation for the time of your activity.</p>
                </div>

                <div class="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-sm dark:bg-background-dark">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#007bff]/20">
                        <span class="material-symbols-outlined text-2xl text-[#007bff]">place</span>
                    </div>
                    <h4 class="font-display text-lg font-bold text-gray-900 dark:text-white">Points of Interest</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Automatically identify potential landmarks, viewpoints, or water sources near your track to enrich your planning.</p>
                </div>

                <div class="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-sm dark:bg-background-dark">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#6f42c1]/20">
                        <span class="material-symbols-outlined text-2xl text-[#6f42c1]">hiking</span>
                    </div>
                    <h4 class="font-display text-lg font-bold text-gray-900 dark:text-white">Smart Gear Recommendations</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Based on terrain, distance, and weather, get intelligent suggestions for the right gear to bring on your next trip.</p>
                </div>

                <div class="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-sm dark:bg-background-dark">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e83e8c]/20">
                        <span class="material-symbols-outlined text-2xl text-[#e83e8c]">share</span>
                    </div>
                    <h4 class="font-display text-lg font-bold text-gray-900 dark:text-white">Share Your Adventure</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Easily export your analysis into a shareable summary with maps and key stats to show friends or keep as a log.</p>
                </div>

            </div>
        </div>
    </section>

    <section id="section-howitwork" class="w-full py-16 px-[20px] md:py-24 bg-primary/90 dark:bg-primary/5">
        <div class="section-wrapper relative w-boxed">
            <div class="flex flex-col gap-10 text-center">

                <div class="flex flex-col gap-4">
                    <h1 class="text-3xl font-bold leading-tight tracking-tight md:text-4xl">A Simple, 3-Step Process</h1>
                    <p class="text-base font-normal leading-normal text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        We've designed our tool to be intuitive and powerful, giving you a clear path from raw data to a beautiful analysis.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">

                    <div class="flex flex-col items-center gap-4 text-center">
                        <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-[#0d1c12]">
                            <span class="material-symbols-outlined text-4xl"> upload_file </span>
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-lg font-bold leading-normal">1. Upload Your GPX File</h3>
                            <p class="text-sm font-normal leading-normal text-slate-600 dark:text-slate-400">
                                Easily drag and drop your GPX file or select it from your device. Our system will immediately start processing your route data.
                            </p>
                        </div>
                        <div class="mt-2 w-full aspect-video rounded-lg bg-cover bg-center bg-background-light dark:bg-background-dark shadow-md" data-alt="Screenshot of the file upload interface with a drag and drop area." style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAKD63SSJrux7PR7oCruJ5HmrqPAnYwnwRU3h8n5VkQzDonfcLbezZrxVGAFPblm3Z8m3J86xBdzzoyvHNNFsIzKgRUs65377qBZFPd1dAYTlB0fcDXl4Bg5Hd5BUyyiaDPt9RNZ0vICMXBRTd3N7GP9IPlTi7B_1CEOuTXPTdTzF60qgO22DK7VsWknxha3atoNBgSYCK3xLULP6Z1osS6Or8xFK5tgocf2x5KsEXS6Z42_IDh7g-iDGkJrr42bfbnJ73KFZn2rMU");'></div>
                    </div>

                    <div class="flex flex-col items-center gap-4 text-center">
                        <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-[#0d1c12]">
                            <span class="material-symbols-outlined text-4xl"> tune </span>
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-lg font-bold leading-normal">2. Customize Your Analysis</h3>
                            <p class="text-sm font-normal leading-normal text-slate-600 dark:text-slate-400">
                                Refine the analysis by selecting filters like activity type, date range, number of stages, or even the mood of your activity.
                            </p>
                        </div>
                        <div class="mt-2 w-full aspect-video rounded-lg bg-cover bg-center bg-background-light dark:bg-background-dark shadow-md" data-alt="Screenshot highlighting the filter selection panel with options for activity type and date." style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCe2IotUPzX2_gJV896ShKNcK7UUplPzifnSdi31_dpNpNAhGHpW0-IKOyh4_4ahulV6k31LxE6yo0aYrnqyuMz9wB8nul6nUMWAZe3PZx8mpUJ_SBXGQ_or-4yghbIGSDtciVsKsPJRThrqEzEhdtvpVwoPgYvWhs9Qv6oUDCYdp6lMokPdJRRzMM323qXtxXqAjBcB6vIojoVJWbfZbM8EXgGQ6rHYZRdOhQm7gEfLILSn4lFUINGQXDT31W9UW197RRUYXXqGzk");'></div>
                    </div>

                    <div class="flex flex-col items-center gap-4 text-center">
                        <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-[#0d1c12]">
                            <span class="material-symbols-outlined text-4xl"> visibility </span>
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-lg font-bold leading-normal">3. See Your Adventure</h3>
                            <p class="text-sm font-normal leading-normal text-slate-600 dark:text-slate-400">
                                Explore your journey on an interactive map, view elevation charts, and dive into detailed performance metrics.
                            </p>
                        </div>
                        <div class="mt-2 w-full aspect-video rounded-lg bg-cover bg-center bg-background-light dark:bg-background-dark shadow-md" data-alt="Screenshot of the final analysis dashboard showing a map and performance charts." style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBlUyt2xhm3Q4wJts4WePLvBdQl9gTRlVyH21Td2q-ppjIMRXas4QHARFvjKI2vHZTLftKV9HPH2zWk01oEXX4CBWxlaxkh5n1vVOjz_aVD7Wi6IhCfrxY8M1OzMcD6s9OgKBx0D4heXQbbZznG6SN1NkizFK3_j7UmB0IEKZtc5RK27oH7q4R0lA0Mo1Ou9vITPghZIPzFpeKv_lhDMOvvWB7ysGAA5jg5RtxnLxG5q2GQCRghmKwe55zq0b3ig-4XGVH8zNnxSHI");'></div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <section id="section-start" class="w-full py-16 px-[20px] md:py-24">
        <div class="section-wrapper w-boxed">
            <div class="relative flex flex-col items-center gap-6 rounded-box bg-primary/90 dark:bg-primary/10 p-10 text-center bg-[url(../src/assets/images/home-cta.jpg)] bg-cover">
                <h1 class="text-3xl font-bold leading-tight tracking-tight md:text-4xl max-w-2xl">
                    Ready to bring your adventures to life?
                </h1>
                <p class="text-base font-normal leading-normal text-slate-600 dark:text-slate-400 max-w-xl">
                    Upload your GPX file now and get a detailed breakdown of your journey. It's fast, free, and full of insights.
                </p>
                <a href="/upload" class="btn btn-secondary">Analyze Your File Now</a>
            </div>
        </div>
    </section>
</template>

<style scoped>
@import '../assets/css/main.css';
@import '../assets/css/views/home.css';
</style>

<script setup>
import { ref } from 'vue'
</script>
