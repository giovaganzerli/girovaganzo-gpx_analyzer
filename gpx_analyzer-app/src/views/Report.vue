<template>

    <section id="section-form"
             class="w-full mt-[120px] mb-[30px] p-[20px]">

        <div class="section-wrapper w-boxed p-[20px]">
            <!-- Titolo + Descrizione -->
            <div class="w-full mb-5">
                <p class="text-black text-4xl font-black leading-tight tracking-[-0.033em]">
                    Analyzing: {{ reportData.title }}</p>
                <p class="text-[#499c65] text-base font-normal leading-normal"><b>A little briefing:</b> {{ gpxData.generatedData.routeDescription }}</p>
            </div>
            <!-- Dati Percorso -->
            <div class="w-[calc(100%+40px)] col-span-2 flex flex-col gap-8 mx-[-20px]">
                <div class="h-full grid grid-cols-4 gap-4">
                    <div class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                        <span class="material-symbols-outlined text-[#499c65]">route</span>
                        <p class="text-sm text-gray-600">Distance</p>
                        <p class="text-2xl font-bold text-black">{{ gpxData.route.distance }} km</p>
                    </div>
                    <div class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                        <span class="material-symbols-outlined text-[#499c65]">landscape</span>
                        <p class="text-sm text-gray-600">Elevation (Gain/Loss)</p>
                        <p class="text-2xl font-bold text-black">{{ gpxData.route.elevation.gain }} / {{ gpxData.route.elevation.loss }} m</p>
                    </div>
                    <div class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                        <span class="material-symbols-outlined text-[#499c65]">vertical_align_bottom</span>
                        <p class="text-sm text-gray-600">Altitude (min)</p>
                        <p class="text-2xl font-bold text-black">{{ gpxData.route.altitude.min }} m</p>
                    </div>
                    <div class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                        <span class="material-symbols-outlined text-[#499c65]">vertical_align_top</span>
                        <p class="text-sm text-gray-600">Altitude (max)</p>
                        <p class="text-2xl font-bold text-black dark:text-white">{{ gpxData.route.altitude.max }} m</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Altimetria + Mappa -->
        <div class="section-wrapper">
            <div class="relative grid grid-cols-6 gap-4">
                <div class="col-span-3 left-column">
                    <!-- Altimetria -->
                    <div class="w-full p-6 bg-white rounded-xl border border-gray-200">
                        <div class="flex justify-between mb-2 text-black text-lg font-bold">
                            <p><span>Elevation Profile</span></p>
                            <div class="flex items-center gap-2">
                                <label class="flex items-center gap-2 text-sm">
                                    <input type="checkbox" v-model="elevationChartProps.settings.followEnabled" />
                                    Follow
                                </label>
                                <label
                                    v-if="selectedSegment.segment"
                                    @click="resetSegmentSelected"
                                    class="px-3 py-1 bg-gray-200 text-sm rounded cursor-pointer">
                                    Reset segment
                                </label>
                            </div>
                        </div>
                        <ElevationChart
                            ref="elevationChart"
                            :points="mapProps.trackPoints"
                            :onHover="updateMarkersPosition"
                            :onResetMap="resetMap"
                            :onSegmentSelect="handleSegmentSelected"
                            :disableFollow="disableFollowFromChart"
                            :enableFollow="enableFollowFromChart"
                        />
                    </div>
                    <!-- SURFACE TYPE -->
                    <div class="w-full p-6 mt-4 bg-white rounded-xl border border-gray-200">
                        <div class="flex justify-between mb-2 text-black text-lg font-bold">
                            <p><span>Surfaces Type</span></p>
                            <div class="flex items-center gap-2">
                                <label
                                    v-if="selectedSegment.segment"
                                    @click="resetSegmentSelected"
                                    class="px-3 py-1 bg-gray-200 text-sm rounded cursor-pointer"
                                >
                                    Reset segment
                                </label>
                            </div>
                        </div>
                        <SurfaceTimeline
                            ref="surfaceTimeline"
                            v-if="gpxData.route.distance > 0"
                            :points="mapProps.trackPoints"
                            :totalDist="gpxData.route.distance"
                            :onHover="updateMarkersPosition"
                            :onResetMap="resetMap"
                            :onSegmentSelect="handleSegmentSelected"
                        />
                    </div>
                </div>
                <!-- Mappa -->
                <div class="col-span-3">
                    <div class="right-sticky w-full]">
                        <Map
                            ref="map"
                            :points="mapProps.trackPoints"
                            :enableFollow="elevationChartProps.settings.followEnabled"
                            :onHover="updateMarkersPosition"
                            :onSegmentSelect="handleSegmentSelected"
                            :onSegmentReset="resetSegmentSelected"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="section-wrapper w-boxed p-[20px]">
            <div class="layout-content-container flex flex-col w-full max-w-7xl flex-1 gap-8">
                <!-- Informazioni Paese -->
                <!--<div class="flex flex-col col-span-1 md:col-span-2 gap-6">
                    <div class="flex justify-between items-center">
                        <h3 class="text-black text-xl font-bold leading-tight tracking-[-0.015em]">Informazioni sui Paesi</h3>
                        <div>
                            <input id="country-tab-1"
                                   class="hidden country-tab-radio"
                                   name="country-tabs"
                                   type="radio"
                                   v-model="selectors.country"
                                   value="0"
                                   checked="checked"/>
                            <label
                                class="country-tab-label cursor-pointer inline-block px-4 py-2 rounded-lg text-sm font-semibold mr-2"
                                :class="{'bg-primary text-primary-content': selectors.country === '0', 'bg-gray-100': selectors.country !== '0'}"
                                for="country-tab-1">Italia 🇮🇹</label>
                            <input id="country-tab-2"
                                   class="hidden country-tab-radio"
                                   name="country-tabs"
                                   type="radio"
                                   v-model="selectors.country"
                                   value="1"/>
                            <label
                                class="country-tab-label cursor-pointer inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                                :class="{'bg-primary text-primary-content': selectors.country === '1', 'bg-gray-100': selectors.country !== '1'}"
                                for="country-tab-2">Svizzera 🇨🇭</label>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 p-6 bg-white rounded-xl border border-gray-200 h-full">
                        <div>
                            <div class="country-tab-content mt-4">
                                <div>
                                    <input id="tab-generali-1"
                                           class="hidden tab-radio"
                                           name="country-info-1"
                                           type="radio"
                                           checked="" />
                                    <input id="tab-ingresso-1"
                                           class="hidden tab-radio"
                                           name="country-info-1"
                                           type="radio" />
                                    <input id="tab-sicurezza-1"
                                           class="hidden tab-radio"
                                           name="country-info-1"
                                           type="radio" />
                                    <input id="tab-sanita-1"
                                           class="hidden tab-radio"
                                           name="country-info-1"
                                           type="radio" />
                                    <div class="border-b border-gray-200">
                                        <nav aria-label="Tabs" class="-mb-px flex space-x-6 overflow-x-auto">
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
                                                for="tab-generali-1">Informazioni generali</label>
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
                                                for="tab-ingresso-1">Requisiti d’ingresso</label>
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
                                                for="tab-sicurezza-1">Sicurezza</label>
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
                                                for="tab-sanita-1">Situazione sanitaria</label>
                                        </nav>
                                    </div>
                                    <div class="pt-6">
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700">
                                                <ul class="space-y-2">
                                                    <li><strong>Capitale:</strong> Nome Capitale</li>
                                                    <li><strong>Popolazione:</strong> Numero Abitanti</li>
                                                    <li><strong>Superficie:</strong> Valore km²</li>
                                                    <li><strong>Fuso orario:</strong> Sigla Fuso Orario</li>
                                                    <li><strong>Lingue:</strong> Lingue parlate</li>
                                                    <li><strong>Religioni:</strong> Religioni praticate</li>
                                                    <li><strong>Moneta:</strong> Nome Moneta (Simbolo)</li>
                                                    <li><strong>Rete cellulare:</strong> Operatori principali, copertura
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700">
                                                <ul class="space-y-2">
                                                    <li><strong>Passaporto:</strong> Requisiti specifici</li>
                                                    <li><strong>Visto d’ingresso:</strong> Necessario o no, modalità
                                                    </li>
                                                    <li><strong>Altre informazioni:</strong> Dettagli aggiuntivi</li>
                                                    <li><strong>Formalità doganali e valutarie:</strong> Limiti e
                                                        regolamenti
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700">
                                                <ul class="space-y-2">
                                                    <li><strong>Indicazioni generali:</strong> Livello di sicurezza
                                                        generale
                                                    </li>
                                                    <li><strong>Ordine pubblico e criminalità:</strong> Aree a rischio,
                                                        tipi di crimine
                                                    </li>
                                                    <li><strong>Rischio terrorismo:</strong> Valutazione del rischio
                                                    </li>
                                                    <li><strong>Rischi ambientali e calamità naturali:</strong>
                                                        Terremoti, alluvioni, etc.
                                                    </li>
                                                    <li><strong>Aree di particolare cautela:</strong> Zone da evitare
                                                    </li>
                                                    <li><strong>Avvertenze:</strong> Consigli specifici</li>
                                                    <li><strong>Normative locali rilevanti:</strong> Leggi da conoscere
                                                    </li>
                                                    <li><strong>Informazioni per le aziende:</strong> Note per viaggi di
                                                        lavoro
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700">
                                                <ul class="space-y-2">
                                                    <li><strong>Strutture sanitarie:</strong> Qualità e disponibilità
                                                    </li>
                                                    <li><strong>Malattie presenti:</strong> Malattie endemiche o rischi
                                                    </li>
                                                    <li><strong>Avvertenze:</strong> Precauzioni sanitarie</li>
                                                    <li><strong>Vaccinazioni:</strong> Obbligatorie e consigliate</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="country-tab-content mt-4">
                                <div>
                                    <input checked="" class="hidden tab-radio" id="tab-generali-2" name="country-info-2"
                                           type="radio"/>
                                    <input class="hidden tab-radio" id="tab-ingresso-2" name="country-info-2"
                                           type="radio"/>
                                    <input class="hidden tab-radio" id="tab-sicurezza-2" name="country-info-2"
                                           type="radio"/>
                                    <input class="hidden tab-radio" id="tab-sanita-2" name="country-info-2"
                                           type="radio"/>
                                    <div class="border-b border-gray-200 dark:border-gray-700">
                                        <nav aria-label="Tabs" class="-mb-px flex space-x-6 overflow-x-auto">
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                                                for="tab-generali-2">Informazioni generali</label>
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                                                for="tab-ingresso-2">Requisiti d’ingresso</label>
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                                                for="tab-sicurezza-2">Sicurezza</label>
                                            <label
                                                class="tab-label shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                                                for="tab-sanita-2">Situazione sanitaria</label>
                                        </nav>
                                    </div>
                                    <div class="pt-6">
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                                <ul class="space-y-2">
                                                    <li><strong>Capitale:</strong> Nome Capitale</li>
                                                    <li><strong>Popolazione:</strong> Numero Abitanti</li>
                                                    <li><strong>Superficie:</strong> Valore km²</li>
                                                    <li><strong>Fuso orario:</strong> Sigla Fuso Orario</li>
                                                    <li><strong>Lingue:</strong> Lingue parlate</li>
                                                    <li><strong>Religioni:</strong> Religioni praticate</li>
                                                    <li><strong>Moneta:</strong> Nome Moneta (Simbolo)</li>
                                                    <li><strong>Rete cellulare:</strong> Operatori principali, copertura
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                                <ul class="space-y-2">
                                                    <li><strong>Passaporto:</strong> Requisiti specifici</li>
                                                    <li><strong>Visto d’ingresso:</strong> Necessario o no, modalità
                                                    </li>
                                                    <li><strong>Altre informazioni:</strong> Dettagli aggiuntivi</li>
                                                    <li><strong>Formalità doganali e valutarie:</strong> Limiti e
                                                        regolamenti
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                                <ul class="space-y-2">
                                                    <li><strong>Indicazioni generali:</strong> Livello di sicurezza
                                                        generale
                                                    </li>
                                                    <li><strong>Ordine pubblico e criminalità:</strong> Aree a rischio,
                                                        tipi di crimine
                                                    </li>
                                                    <li><strong>Rischio terrorismo:</strong> Valutazione del rischio
                                                    </li>
                                                    <li><strong>Rischi ambientali e calamità naturali:</strong>
                                                        Terremoti, alluvioni, etc.
                                                    </li>
                                                    <li><strong>Aree di particolare cautela:</strong> Zone da evitare
                                                    </li>
                                                    <li><strong>Avvertenze:</strong> Consigli specifici</li>
                                                    <li><strong>Normative locali rilevanti:</strong> Leggi da conoscere
                                                    </li>
                                                    <li><strong>Informazioni per le aziende:</strong> Note per viaggi di
                                                        lavoro
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="tab-content">
                                            <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                                <ul class="space-y-2">
                                                    <li><strong>Strutture sanitarie:</strong> Qualità e disponibilità
                                                    </li>
                                                    <li><strong>Malattie presenti:</strong> Malattie endemiche o rischi
                                                    </li>
                                                    <li><strong>Avvertenze:</strong> Precauzioni sanitarie</li>
                                                    <li><strong>Vaccinazioni:</strong> Obbligatorie e consigliate</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>-->
                <!-- Informazioni Turistiche -->
                <!--<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="flex flex-col gap-6">
                        <h2 class="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
                            Informazioni Turistiche</h2>
                        <div
                            class="flex flex-col gap-4 p-6 bg-white dark:bg-[#1A2C21] rounded-xl border border-gray-200 dark:border-gray-800">
                            <h3 class="text-lg font-bold text-black dark:text-white">Descrizione</h3>
                            <p class="text-sm text-gray-700 dark:text-gray-300">Le Dolomiti, patrimonio dell'UNESCO,
                                offrono paesaggi mozzafiato con vette imponenti, valli verdi e laghi alpini. Questa
                                regione è un paradiso per escursionisti, alpinisti e amanti della natura.</p>
                            <h3 class="text-lg font-bold text-black dark:text-white pt-4">Punti di Interesse</h3>
                            <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Tre Cime di Lavaredo</li>
                                <li>Lago di Braies</li>
                                <li>Marmolada</li>
                                <li>Passo Pordoi</li>
                            </ul>
                        </div>
                    </div>
                    <div class="flex flex-col gap-6">
                        <h2 class="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Dati
                            Meteorologici</h2>
                        <div
                            class="flex flex-col gap-4 p-6 bg-white dark:bg-[#1A2C21] rounded-xl border border-gray-200 dark:border-gray-800">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-bold text-black dark:text-white">Clima Generale (Luglio)</h3>
                                <div class="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-sm">
                                    <button
                                        class="px-3 py-1 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white font-semibold">
                                        Generali
                                    </button>
                                    <button class="px-3 py-1 rounded-md text-gray-600 dark:text-gray-400">Scorso Anno
                                    </button>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-sm">
                                <div class="flex items-center gap-2"><span
                                    class="material-symbols-outlined text-sm text-[#499c65]">wb_sunny</span><span>Alba: 05:30</span>
                                </div>
                                <div class="flex items-center gap-2"><span
                                    class="material-symbols-outlined text-sm text-[#499c65]">nightlight</span><span>Tramonto: 21:00</span>
                                </div>
                                <div class="flex items-center gap-2"><span
                                    class="material-symbols-outlined text-sm text-[#499c65]">thermostat</span><span>Temp: 5°C / 18°C</span>
                                </div>
                                <div class="flex items-center gap-2"><span
                                    class="material-symbols-outlined text-sm text-[#499c65]">water_drop</span><span>Umidità: 65%</span>
                                </div>
                                <div class="flex items-center gap-2"><span
                                    class="material-symbols-outlined text-sm text-[#499c65]">rainy</span><span>Giorni pioggia: 12</span>
                                </div>
                                <div class="flex items-center gap-2"><span
                                    class="material-symbols-outlined text-sm text-[#499c65]">air</span><span>Vento: 15 km/h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>-->
                <!-- Attrezzatura Consigliata -->
                <!--<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="flex flex-col gap-6">
                        <h2 class="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-5">
                            Attrezzatura Consigliata</h2>
                        <div
                            class="flex flex-col gap-4 p-6 bg-white dark:bg-[#1A2C21] rounded-xl border border-gray-200 dark:border-gray-800">
                            <div class="space-y-3 text-sm">
                                <label class="flex items-center gap-3"><input checked=""
                                                                              class="rounded border-gray-300 text-primary focus:ring-primary/50"
                                                                              type="checkbox"/> Scarponi da
                                    trekking</label>
                                <label class="flex items-center gap-3"><input checked=""
                                                                              class="rounded border-gray-300 text-primary focus:ring-primary/50"
                                                                              type="checkbox"/> Giacca impermeabile e
                                    antivento</label>
                                <label class="flex items-center gap-3"><input
                                    class="rounded border-gray-300 text-primary focus:ring-primary/50" type="checkbox"/>
                                    Pile o strato intermedio</label>
                                <label class="flex items-center gap-3"><input
                                    class="rounded border-gray-300 text-primary focus:ring-primary/50" type="checkbox"/>
                                    Zaino 20-30L</label>
                                <label class="flex items-center gap-3"><input
                                    class="rounded border-gray-300 text-primary focus:ring-primary/50" type="checkbox"/>
                                    Acqua (almeno 2L) e snack</label>
                                <label class="flex items-center gap-3"><input
                                    class="rounded border-gray-300 text-primary focus:ring-primary/50" type="checkbox"/>
                                    Mappa, bussola o GPS</label>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-6">
                        <h2 class="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-5">
                            Chiedi all'IA del Percorso</h2>
                        <div
                            class="flex flex-col h-full bg-white dark:bg-[#1A2C21] rounded-xl border border-gray-200 dark:border-gray-800">
                            <div class="flex-grow p-4 space-y-4 overflow-y-auto">
                                <div class="flex items-start gap-2.5">
                                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                                         data-alt="AI assistant avatar"
                                         style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvrPLnmWE7AyNSgNSJ7B-gLrh9NbSO0pw0d7AwC6tB3JzxA23KSYjucvE2VK2dWjI8El8hSmEiJ2PFtbjpXgkfyisTomMpNhNhfwkJRkPPB78w2vPTN_wIQ3MH617rU6bQKfi1KiwBf2LD9pZuXo1UrzjayYz0BBe4X2DpLHjFHuRX9h66KyMLJ3uHWS3jbP-0SQJsq8x9zlo6LR5lA_ZQygaJf7hoZpZ7q5-KWlvx4K6NENEY6on_IuTIGbjtRN9FsfZ4VVkMuZk");'></div>
                                    <div class="flex flex-col gap-1 w-full max-w-[320px]">
                                        <div
                                            class="flex flex-col leading-1.5 p-3 border-gray-200 bg-gray-100 dark:bg-gray-800 rounded-e-xl rounded-es-xl">
                                            <p class="text-sm font-normal text-gray-900 dark:text-white">Ciao! Come
                                                posso aiutarti con il tuo percorso sul Sentiero delle Dolomiti?</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                                <div class="flex items-center gap-2">
                                    <input
                                        class="flex-grow bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                        placeholder="Ci sono rifugi lungo il percorso?" type="text"/>
                                    <button class="p-2.5 rounded-lg bg-primary text-[#0d1c12]">
                                        <span class="material-symbols-outlined">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>-->
            </div>
        </div>
    </section>

</template>

<style scoped>
@import '../assets/css/main.css';
@import '../assets/css/views/report.css';
</style>

<script>
// COMPONENTI
import Map from "../components/Map.vue";
import ElevationChart from "../components/ElevationChart.vue";
import SurfaceTimeline from "../components/SurfaceTimeline.vue";

// SERVIZI
import { getCountryList } from "../services/ViaggiareSicuriService.js";
import gpxUtils from "../services/UtilitiesService.js";

export default {
    name: "ReportView",
    components: {
        Map: Map,
        ElevationChart,
        SurfaceTimeline
    },
    data() {
        return {
            reportData: {
                file: '',
                title: '',
                public: false,
                activity: {
                    type: 'bike',
                    mood: 'travel',
                },
                setts: {
                    start: '',
                    stages: '',
                    hours: ''
                }
            },
            gpxData: {
                route: {
                    distance: 0,
                    elevation: {
                        gain: 0,
                        loss: 0
                    },
                    altitude: {
                        min: 0,
                        max: 0
                    },
                    hills: {
                        totals: 0
                    }
                },
                generatedData: {
                    routeDescription: '--'
                },
            },
            mapProps: {
                trackPoints: []
            },
            elevationChartProps: {
                settings: {
                    followEnabled: true,
                    isProgrammaticMapMove: false,
                }
            },
            surfaceTimelineProps: {
                settings: {
                    selectedSegment: null,
                    isProgrammaticSurfaceZoom: false
                }
            },
            selectedSegment: {
                segment: false,
                selectedFrom: false
            }
        }
    },

    methods: {

        /* ---------------------------------------------- */
        /*  GPX UPLOAD                                    */
        /* ---------------------------------------------- */
        async readGPXFile() {
            const file = this.reportData.file;
            if (!file) return;

            const text = await file.text();
            const xml = new DOMParser().parseFromString(text, "text/xml");

            const pts = gpxUtils.getRoutePoints(xml);
            this.mapProps.trackPoints = pts;

            // GET MAIN ROUTE DATA
            this.gpxData.route.distance = gpxUtils.getRouteDistance(pts);
            this.gpxData.route.elevation = gpxUtils.getRouteElevation(pts);
            this.gpxData.route.altitude = gpxUtils.getRouteAltitude(pts);
            this.gpxData.route.hills.totals = gpxUtils.getHills(pts, 30);
        },

        /* -------------------------------------------------------- */
        /*   GRAFICO → MAPPA                                        */
        /* -------------------------------------------------------- */
        updateMarkersPosition(index, hoverEl) {
            if (this.elevationChartProps.settings.isProgrammaticMapMove) return;

            if(hoverEl === 'ElevationChart') {
                this.$refs.map.updateMarker(index);
                this.$refs.surfaceTimeline.updateMarker(index);
            } else if(hoverEl === 'SurfaceTimeline') {
                this.$refs.map.updateMarker(index);
                this.$refs.elevationChart?.updateMarker(index);
            } else if(hoverEl === 'Map') {
                this.$refs.elevationChart?.updateMarker(index);
                this.$refs.surfaceTimeline.updateMarker(index);
            }
        },

        resetMap() {
            const map = this.$refs.map?.map;
            const gpxTrack = this.$refs.map?.gpxTrack;
            const selectedSegment = this.$refs.map?.selectedSegment.segment;
            if (!map || !gpxTrack || !this.elevationChartProps.settings.followEnabled) return;

            if(selectedSegment) {
                // Zoom sulla porzione
                map.fitBounds(selectedSegment.getBounds(), {
                    padding: [30, 30]
                });
            } else {
                map.fitBounds(gpxTrack.getBounds(), {
                    padding: [50, 50],
                    animate: true
                });
            }
        },

        /* -------------------------------------------------------- */
        /*   SELEZIONE DEL SEGMENTO                                 */
        /* -------------------------------------------------------- */

        handleSegmentSelected(coords, handler) {
            this.selectedSegment.segment = coords;

            if(handler === 'elevationChart') {

                // FOCUS MAPPA SUL SEGMENTO
                this.$refs.map.highlightSegment(this.selectedSegment.segment, true);
                //this.$refs.surfaceTimeline.highlightSegment(this.selectedSegment.segment);

            } else if(handler === 'surfaceTimeline') {

                //this.$refs.map.highlightSegment(this.selectedSegment.segment, true);

            } else if(handler === 'Map') {

                this.$refs.elevationChart.highlightSegment(this.selectedSegment.segment, true);
            }
        },

        resetSegmentSelected() {
            this.selectedSegment.segment = false;

            // Reset grafico
            this.$refs.elevationChart.clearHighlightedSegment();

            // Reset mappa
            this.$refs.map.clearHighlightedSegment(this.$refs.map.enableFollow);

            // Reset timeline
            this.$refs.surfaceTimeline.clearHighlightedSegment();
        },

        disableFollowFromChart() {
            this.elevationChartProps.settings.followEnabled = false;
        },

        enableFollowFromChart() {
            this.elevationChartProps.settings.followEnabled = true;
        }
    },

    mounted() {

        const init = async () => {
            // Get reportData from localStorage
            const localStorage_reportData = localStorage.getItem('reportData');
            const localStorage_reportFile = localStorage.getItem('reportFile');

            if (localStorage_reportData && localStorage_reportFile) {
                this.reportData = JSON.parse(localStorage_reportData);
                this.reportData.file = new File([localStorage_reportFile], this.reportData.title + ".gpx", {
                    type: "application/gpx+xml"
                });
            } else {
                this.$router.push('/upload');
            }

            await this.readGPXFile();
        };

        init();
    }
};
</script>
