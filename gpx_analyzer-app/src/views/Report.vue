<template>

    <section id="section-form"
             class="w-full mt-[120px] mb-[30px] p-[20px]">
        <div class="section-wrapper w-boxed p-[20px]">
            <div class="layout-content-container flex flex-col w-full max-w-7xl flex-1 gap-8">
                <div class="flex flex-wrap justify-between gap-4">
                    <div class="flex flex-col gap-2">
                        <p class="text-black text-4xl font-black leading-tight tracking-[-0.033em]">
                            Analisi Percorso: Sentiero delle Dolomiti</p>
                        <p class="text-[#499c65] text-base font-normal leading-normal">Panoramica dettagliata del tuo
                            tracciato, dati contestuali e previsioni meteo.</p>
                    </div>
                </div>

                <div class="grid grid-cols-5 gap-8 mx-[-20px]">
                    <div class="col-span-2 p-6 bg-white rounded-xl border border-gray-200">
                        <input class="hidden expander" id="description-expander" type="checkbox"/>
                        <div class="flex justify-between items-center">
                            <h2 class="text-black text-xl font-bold leading-tight tracking-[-0.015em]">Descrizione del Percorso</h2>
                        </div>
                        <div class="mt-4 space-y-4">
                            <p class="text-sm text-gray-700">Questo spettacolare
                                sentiero ad anello si snoda nel cuore delle Dolomiti, offrendo panorami mozzafiato e
                                un'immersione totale nella natura alpina. Il percorso inizia dolcemente attraverso
                                prati fioriti per poi salire gradualmente verso forcelle rocciose e passaggi
                                suggestivi. Punti salienti includono la vista sulle Tre Cime di Lavaredo e il
                                passaggio vicino a un rifugio storico dove è possibile fare una sosta.</p>
                        </div>
                    </div>
                    <div class="lg:col-span-3 flex flex-col gap-8">
                        <div
                            class="w-full h-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl object-cover border border-gray-200"
                            data-alt="Interactive map showing the GPX route in the Dolomites"
                            data-location="Dolomites, Italy"
                            style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1D6HK5aooI6GMthMU6qfGuq6EIT4_VBSZhK6w-4OnE2isWUrFLPmsTe9_76xTRjtVD48wjakh0EQnnDqH3qlF5sjPcdPpkcRTERzPZKWmK9W7ehMqthN0yWuPYnkulPD1VbceBubnRkmiR6RNrJK3VrrMgJskIfBjUkmfFc1LMkusyx7wmEon9hSY-K5XVNV06fY8a_aEDGw5RLvwMsWqjeGAqcE8Jr-GYXxIq-3uQj9cuL8MfGIGxNA8A3W7HxIxb4RoJAGkKpE");'></div>
                    </div>
                </div>
                <div
                    class="flex flex-col gap-4 p-6 mx-[-20px] bg-white rounded-xl border border-gray-200">
                    <p class="text-black dark:text-white text-lg font-bold">Profilo Altimetrico</p>
                    <div class="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                        <svg fill="none" height="148" preserveAspectRatio="none" viewBox="-3 0 478 150"
                             width="100%" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                                fill="url(#paint0_linear_1131_5935)"></path>
                            <path
                                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                                stroke="#25f46a" stroke-linecap="round" stroke-width="3"></path>
                            <defs>
                                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1131_5935"
                                                x1="236" x2="236" y1="1" y2="149">
                                    <stop stop-color="#25f46a" stop-opacity="0.2"></stop>
                                    <stop offset="1" stop-color="#25f46a" stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        <div class="flex justify-around">
                            <p class="text-[#499c65] text-xs font-bold leading-normal tracking-[0.015em]">
                                0km</p>
                            <p class="text-[#499c65] text-xs font-bold leading-normal tracking-[0.015em]">
                                5km</p>
                            <p class="text-[#499c65] text-xs font-bold leading-normal tracking-[0.015em]">
                                10km</p>
                            <p class="text-[#499c65] text-xs font-bold leading-normal tracking-[0.015em]">
                                15km</p>
                            <p class="text-[#499c65] text-xs font-bold leading-normal tracking-[0.015em]">
                                20km</p>
                            <p class="text-[#499c65] text-xs font-bold leading-normal tracking-[0.015em]">
                                25km</p>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <h2 class="w-full text-black text-xl font-bold leading-tight tracking-[-0.015em] pt-2 mb-6">Riepilogo Dati</h2>
                    <div class="mx-[-20px] grid grid-cols-5 gap-4">
                        <div
                            class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                            <span class="material-symbols-outlined text-[#499c65]">route</span>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Distanza</p>
                            <p class="text-2xl font-bold text-black">25.3 km</p>
                        </div>
                        <div
                            class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                            <span class="material-symbols-outlined text-[#499c65]">landscape</span>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Dislivello Totale</p>
                            <p class="text-2xl font-bold text-black">1,250 m</p>
                        </div>
                        <div
                            class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                            <span class="material-symbols-outlined text-[#499c65]">vertical_align_bottom</span>
                            <p class="text-sm text-gray-600">Altitudine Min</p>
                            <p class="text-2xl font-bold text-black">1,800 m</p>
                        </div>
                        <div
                            class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                            <span class="material-symbols-outlined text-[#499c65]">vertical_align_top</span>
                            <p class="text-sm text-gray-600">Altitudine Max</p>
                            <p class="text-2xl font-bold text-black dark:text-white">2,650 m</p>
                        </div>
                        <div
                            class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-200">
                            <span class="material-symbols-outlined text-[#499c65]">elevation</span>
                            <p class="text-sm text-gray-600">Salite</p>
                            <p class="text-2xl font-bold text-black dark:text-white">15</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col col-span-1 md:col-span-2 gap-6">
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
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                </div>
            </div>
        </div>
    </section>

</template>

<style scoped>
@import '../assets/css/main.css';
/*@import '../assets/css/views/report.css';*/
</style>

<script>
import { getCountryList } from "../services/ViaggiareSicuriService.js";

export default {
    name: "ReportView",
    components: {},
    data() {
        return {
            selectors: {
                country: '0'
            },
            gpxData: {
                'title': 'Sentiero delle Dolomiti',
                'description': 'Questo spettacolare sentiero ad anello si snoda nel cuore delle Dolomiti, offrendo panorami mozzafiato e un\'immersione totale nella natura alpina. Il percorso inizia dolcemente attraverso prati fioriti per poi salire gradualmente verso forcelle rocciose e passaggi suggestivi. Punti salienti includono la vista sulle Tre Cime di Lavaredo e il passaggio vicino a un rifugio storico dove è possibile fare una sosta.',
                'route': {
                    'distance': 25.3,
                    'elevation': 1250,
                    'altitude': {
                        'min': 1800,
                        'max': 2650
                    },
                    'hills': {
                        'totals': 15
                    }
                },
                'country': ['Svizzera', 'Francia'],
                'countryData': {}
            }
        }
    },
    methods: {
        async loadData() {
            this.result = await getCountryList();
        }
    },
    mounted() {

        this.loadData();
    }
}

</script>