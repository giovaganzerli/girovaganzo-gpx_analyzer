<template>

    <section id="section-form"
             class="w-full mt-[120px] mb-[30px] p-[20px]">
        <div class="section-wrapper w-boxed p-[20px] bg-base-100 rounded-box">

            <!-- Stepper -->
            <div data-stepper='{ "currentIndex": 1 }'
                 class="w-full">

                <!-- Stepper Nav -->
                <ul class="relative flex flex-row gap-x-2">

                    <li class="group flex flex-1 shrink basis-0 items-center gap-x-2"
                        :class="{ 'active': (stepper.currentIndex == 1), 'is-valid': (stepper.currentIndex > 1) }">
                        <span class="min-h-7.5 min-w-7.5 inline-flex items-center align-middle text-sm">
                            <span class="stepper-active:text-bg-primary stepper-active:shadow-sm shadow-base-300/20 stepper-success:text-bg-primary stepper-success:shadow-sm stepper-completed:text-bg-success text-bg-soft-neutral flex size-7.5 shrink-0 items-center justify-center rounded-full font-medium">
                                <span class="stepper-success:hidden stepper-completed:hidden">1</span>
                                <span class="icon-[tabler--check] stepper-success:block hidden size-4 shrink-0"></span>
                            </span>
                            <span class="text-base-content ms-2 max-sm:hidden">Upload</span>
                        </span>
                        <div class="stepper-success:bg-primary stepper-completed:bg-success bg-neutral/20 h-px w-full flex-1 group-last:hidden"></div>
                    </li>

                    <li class="group flex flex-1 shrink basis-0 items-center gap-x-2"
                        :class="{ 'active': (stepper.currentIndex == 2), 'is-valid': (stepper.currentIndex > 2) }">
                        <span class="min-h-7.5 min-w-7.5 inline-flex items-center align-middle text-sm">
                            <span class="stepper-active:text-bg-primary stepper-active:shadow-sm shadow-base-300/20 stepper-success:text-bg-primary stepper-success:shadow-sm stepper-completed:text-bg-success stepper-error:text-bg-error text-bg-soft-neutral flex size-7.5 shrink-0 items-center justify-center rounded-full font-medium">
                                <span class="stepper-success:hidden stepper-completed:hidden">2</span>
                                <span class="icon-[tabler--check] stepper-success:block hidden size-4 shrink-0"></span>
                            </span>
                            <span class="text-base-content ms-2 max-sm:hidden">Customize</span>
                        </span>
                        <div class="stepper-success:bg-primary stepper-completed:bg-success bg-neutral/20 h-px w-full flex-1 group-last:hidden"></div>
                    </li>

                    <li class="group flex flex-1 shrink basis-0 items-center gap-x-2"
                        :class="{ 'active': (stepper.currentIndex == 3), 'is-valid': (stepper.currentIndex > 3) }">
                        <span class="min-h-7.5 min-w-7.5 inline-flex items-center align-middle text-sm">
                            <span class="stepper-active:text-bg-primary stepper-active:shadow-sm shadow-base-300/20 stepper-success:text-bg-primary stepper-success:shadow-sm stepper-completed:text-bg-success stepper-error:text-bg-error text-bg-soft-neutral flex size-7.5 shrink-0 items-center justify-center rounded-full font-medium">
                            <span class="stepper-success:hidden stepper-completed:hidden">3</span>
                                <span class="icon-[tabler--check] stepper-success:block hidden size-4 shrink-0"></span>
                            </span>
                            <span class="text-base-content ms-2 max-sm:hidden">Generate</span>
                        </span>
                        <div class="stepper-success:bg-primary stepper-completed:bg-success bg-neutral/20 h-px w-full flex-1 group-last:hidden"></div>
                    </li>
                    <!-- End Item -->

                </ul>
                <!-- End Stepper Nav -->

                <!-- Stepper Content -->
                <div class="mt-5 sm:mt-8">

                    <form
                        id="gpx-form"
                        @submit="checkForm"
                        action="https://vuejs.org/"
                        method="post"
                    >

                        <!-- First Content -->
                        <div :hidden="stepper.currentIndex !== 1">

                            <h3 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                                1. Upload your GPX file
                            </h3>
                            <p class="text-base text-neutral-600 dark:text-neutral-400">
                                Carica il tuo file GPX qui per iniziare l'analisi.
                            </p>

                            <br>

                            <FileDropper id="form-file" name="form-file" accept=".gpx" @onChange="fileUpload" />
                        </div>
                        <!-- End First Content -->

                        <!-- Second Content -->
                        <div :hidden="stepper.currentIndex !== 2">

                            <h3 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                                2. Customize route
                            </h3>
                            <p class="text-base text-neutral-600 dark:text-neutral-400">
                                Personalizza la tua avventura per creare un report più dettagliato.
                            </p>

                            <br>

                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-wrap items-start w-full gap-3">
                                    <label class="w-full text-base font-bold text-gray-900 dark:text-white">Activity Type</label>
                                    <div class="grid grid-cols-2 w-full max-w-[360px] mr-[20px] gap-2 rounded-full bg-primary/10 p-1 dark:bg-primary/20">
                                        <input id="form-activity_type-bike"
                                               v-model="reportData.activity.type"
                                               name="form-activity_type"
                                               type="radio"
                                               value="bike"
                                               hidden="hidden" />
                                        <label for="form-activity_type-bike"
                                               class="flex items-center justify-center gap-2 rounded-[100px!important] px-4 py-2 text-sm font-bold transition-colors"
                                               :class="{ 'bg-primary text-gray-900': reportData.activity.type === 'bike', 'transition-colors hover:bg-primary/50': reportData.activity.type !== 'bike' }">
                                            <span class="material-symbols-outlined text-lg">directions_bike</span>
                                            <span>Bike</span>
                                        </label>
                                        <input id="form-activity_type-trail"
                                               v-model="reportData.activity.type"
                                               name="form-activity_type"
                                               type="radio"
                                               value="trail"
                                               hidden="hidden" />
                                        <label for="form-activity_type-trail"
                                               class="flex items-center justify-center gap-2 rounded-[100px!important] px-4 py-2 text-sm font-bold transition-colors"
                                               :class="{ 'bg-primary text-gray-900': reportData.activity.type === 'trail', 'transition-colors hover:bg-primary/50': reportData.activity.type !== 'trail' }">
                                            <span class="material-symbols-outlined text-lg">steps</span>
                                            <span>Trail</span>
                                        </label>
                                    </div>
                                    <p class="grow w-full max-w-[calc(100%-450px)] border-l-base-content-100 border-l-3 pl-6 text-sm">
                                        What kind of adventure are you preparing for? <br>
                                        * <b>Bike:</b> Road, Gravel, MTB or Bikepacking <br>
                                        * <b>Trail:</b> Running or Hiking
                                    </p>
                                </div>
                                <div class="flex flex-wrap items-start w-full gap-3">
                                    <label class="w-full text-base font-bold text-gray-900 dark:text-white">Activity Mood</label>
                                    <div class="grid grid-cols-2 w-full max-w-[360px] mr-[20px] gap-2 rounded-full bg-primary/10 p-1 dark:bg-primary/20">
                                        <input id="form-activity_mood-race"
                                               v-model="reportData.activity.mood"
                                               @change="selectMood()"
                                               name="form-activity_mood"
                                               type="radio"
                                               value="race"
                                               hidden="hidden" />
                                        <label for="form-activity_mood-race"
                                               class="flex items-center justify-center gap-2 rounded-[100px!important] px-4 py-2 text-sm font-bold transition-colors"
                                               :class="{ 'bg-primary text-gray-900': reportData.activity.mood === 'race', 'transition-colors hover:bg-primary/50': reportData.activity.mood !== 'race' }">
                                            <svg width="25" height="25" viewBox="0 0 334 276" version="1.1" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0.771821, 0.355843)" fill="#000000"><path d="M194.728179,0.644157413 C197.649179,3.39315741 200.316179,6.22715741 202.728179,9.14415741 C208.728179,13.8111574 214.061179,19.1441574 218.728179,25.1441574 C221.395179,26.4771574 223.395179,28.4771574 224.728179,31.1441574 C241.012179,46.4271574 257.012179,62.0941574 272.728179,78.1441574 C275.728179,80.4771574 278.395179,83.1441574 280.728179,86.1441574 L293.728179,99.1441574 C298.728179,103.477157 303.395179,108.144157 307.728179,113.144157 C309.395179,114.144157 310.728179,115.477157 311.728179,117.144157 C316.990393,121.787015 321.964618,126.716999 326.651653,131.934912 L327.728179,133.144157 C329.018179,133.702157 329.851179,134.702157 330.228179,136.144157 C332.808179,141.529157 332.975179,146.863157 330.728179,152.144157 C330.568179,153.797157 329.902179,155.130157 328.728179,156.144157 C324.767179,162.309157 319.101179,165.809157 311.728179,166.644157 C296.224701,166.10807 281.213117,168.488902 266.695302,173.786653 L265.728179,174.144157 C264.714179,175.318157 263.381179,175.984157 261.728179,176.144157 L259.749882,177.133236 L255.749788,179.133142 L254.740771,179.637718 L253.728179,180.144157 C251.565179,181.727157 249.232179,183.060157 246.728179,184.144157 C241.126179,188.571157 235.626179,193.237157 230.228179,198.144157 C229.536179,199.081157 229.703179,199.747157 230.728179,200.144157 C240.740179,198.107157 250.240179,199.440157 259.228179,204.144157 C266.527179,215.097157 264.694179,224.264157 253.728179,231.644157 C234.053179,231.811157 214.386179,232.311157 194.728179,233.144157 C194.133779,233.689757 193.588659,234.225757 193.091795,234.751645 L192.728179,235.144157 L192.728179,235.144157 C188.754179,238.782157 184.754179,242.449157 180.728179,246.144157 C174.421179,252.116157 168.088179,258.116157 161.728179,264.144157 C157.811179,268.550157 153.145179,272.050157 147.728179,274.644157 C138.493179,275.895157 131.660179,272.395157 127.228179,264.144157 C124.759179,256.691157 126.092179,250.025157 131.228179,244.144157 L142.728179,232.644157 L97.7281789,231.644157 C96.1651789,230.885157 95.1651789,229.718157 94.7281789,228.144157 C94.0061789,227.726157 93.5061789,227.060157 93.2281789,226.144157 C92.4031789,215.303157 92.5691789,204.636157 93.7281789,194.144157 C93.8261789,187.658157 94.8261789,181.324157 96.7281789,175.144157 C97.0241789,173.241157 97.6911789,171.574157 98.7281789,170.144157 C98.5561789,169.152157 98.8901789,168.486157 99.7281789,168.144157 C99.6611789,166.685157 99.9941789,165.352157 100.728179,164.144157 C100.888179,162.491157 101.554179,161.158157 102.728179,160.144157 C107.094179,149.775157 113.427179,140.775157 121.728179,133.144157 C122.728179,131.477157 124.061179,130.144157 125.728179,129.144157 C136.830179,119.437157 149.830179,113.770157 164.728179,112.144157 C167.853179,111.165157 171.186179,110.831157 174.728179,111.144157 L228.728179,109.144157 C227.201179,109.217157 226.201179,108.550157 225.728179,107.144157 C212.654179,98.7361574 202.320179,87.7361574 194.728179,74.1441574 C193.827179,73.3541574 193.160179,72.3541574 192.728179,71.1441574 C191.123179,68.2661574 189.789179,65.2661574 188.728179,62.1441574 C187.691179,60.7141574 187.024179,59.0471574 186.728179,57.1441574 L186.728179,56.1441574 C185.691179,54.7141574 185.024179,53.0471574 184.728179,51.1441574 C180.933179,35.8751574 180.766179,20.5421574 184.228179,5.14415741 C186.300179,0.501157413 189.800179,-0.998842587 194.728179,0.644157413 Z M168.234366,232.110511 L167.728179,232.144157 L167.728179,232.144157 L166.178316,232.919043 L166.178316,232.919043 L161.749788,235.133142 L159.728179,236.144157 C155.104822,241.386872 150.17623,246.359703 144.941603,251.063453 L143.728179,252.144157 L143.728179,252.144157 C141.925135,253.629636 140.931808,255.524089 140.748198,257.827518 L140.728179,258.144157 L140.728179,258.144157 C143.279179,259.593157 145.613179,259.259157 147.728179,257.144157 C156.244179,248.794157 164.910179,240.628157 173.728179,232.644157 C171.919596,232.190407 170.088325,232.012269 168.234366,232.110511 Z M194.728179,22.1441574 C195.342179,29.1611574 196.175179,36.1611574 197.228179,43.1441574 C199.542179,49.3851574 201.708179,55.7181574 203.728179,62.1441574 C205.134179,62.6171574 205.801179,63.6171574 205.728179,65.1441574 C212.921179,77.0071574 221.921179,87.3401574 232.728179,96.1441574 C234.258179,97.1641574 235.765679,98.1689699 237.250679,99.1590168 L238.728179,100.144157 C239.938179,100.576157 240.938179,101.243157 241.728179,102.144157 C242.938179,102.576157 243.938179,103.243157 244.728179,104.144157 C246.381179,104.304157 247.714179,104.970157 248.728179,106.144157 C250.381179,106.304157 251.714179,106.970157 252.728179,108.144157 C253.720179,107.972157 254.386179,108.306157 254.728179,109.144157 C262.460179,109.705157 265.293179,113.705157 263.228179,121.144157 C262.325179,122.345157 261.159179,123.179157 259.728179,123.644157 C230.919088,123.822339 202.129832,124.251761 173.358908,124.932422 L164.728179,125.144157 C158.082266,126.728157 151.694364,129.237156 145.562723,132.670277 L144.728179,133.144157 C143.938179,134.045157 142.938179,134.712157 141.728179,135.144157 C140.306179,136.569157 138.639179,137.569157 136.728179,138.144157 C136.418179,139.788157 135.418179,140.788157 133.728179,141.144157 C131.728179,143.811157 129.395179,146.144157 126.728179,148.144157 C126.728179,149.477157 126.061179,150.144157 124.728179,150.144157 C120.846361,156.395976 117.187683,162.749447 113.752146,169.204571 L112.728179,171.144157 C112.534179,173.974157 111.867179,176.640157 110.728179,179.144157 C110.826179,181.197157 110.159179,182.864157 108.728179,184.144157 C107.050179,195.383157 106.384179,206.716157 106.728179,218.144157 C154.133179,218.472157 201.467179,218.139157 248.728179,217.144157 C249.338179,216.253157 249.671179,215.253157 249.728179,214.144157 C237.04675,213.599872 224.459363,213.032076 211.966645,212.441399 L205.728179,212.144157 C201.154179,212.408157 197.987179,210.408157 196.228179,206.144157 C197.203179,200.216157 197.536179,194.216157 197.228179,188.144157 C190.263179,169.946157 177.096179,160.946157 157.728179,161.144157 C153.594179,156.590157 153.927179,152.423157 158.728179,148.644157 C181.782179,146.831157 198.115179,156.331157 207.728179,177.144157 C208.902179,178.158157 209.568179,179.491157 209.728179,181.144157 C211.128179,185.326157 211.962179,189.659157 212.228179,194.144157 C214.220179,192.979157 216.053179,191.646157 217.728179,190.144157 C218.178655,188.80511 219.107136,188.136357 220.513621,188.138763 L220.728179,188.144157 C222.742179,185.799157 225.075179,183.799157 227.728179,182.144157 C229.119179,179.754157 231.119179,178.087157 233.728179,177.144157 C243.442179,168.896157 254.442179,162.896157 266.728179,159.144157 C268.827179,158.032157 271.161179,157.365157 273.728179,157.144157 C277.226179,155.727157 280.893179,155.061157 284.728179,155.144157 C288.174179,153.957157 291.841179,153.290157 295.728179,153.144157 C301.404179,153.310157 307.071179,153.143157 312.728179,152.644157 C314.294179,152.036157 315.628179,151.202157 316.728179,150.144157 C316.655179,148.617157 317.322179,147.617157 318.728179,147.144157 C318.862179,145.352157 318.529179,143.686157 317.728179,142.144157 C315.061179,140.144157 312.728179,137.811157 310.728179,135.144157 C308.728179,133.811157 307.061179,132.144157 305.728179,130.144157 L285.728179,110.144157 C280.395179,105.477157 275.395179,100.477157 270.728179,95.1441574 C267.728179,92.8111574 265.061179,90.1441574 262.728179,87.1441574 C261.395179,87.1441574 260.728179,86.4771574 260.728179,85.1441574 C259.395179,85.1441574 258.728179,84.4771574 258.728179,83.1441574 C240.959179,66.7081574 223.959179,49.7081574 207.728179,32.1441574 C204.728179,31.1441574 202.728179,29.1441574 201.728179,26.1441574 C199.639179,24.3901574 197.306179,23.0571574 194.728179,22.1441574 Z M283.728179,123.644157 C284.977679,124.414824 285.641151,125.498574 285.72028,126.894565 L285.728179,127.144157 C287.224179,138.007157 282.724179,141.340157 272.228179,137.144157 C269.832179,134.014157 269.332179,130.680157 270.728179,127.144157 C271.061179,124.811157 272.395179,123.477157 274.728179,123.144157 L275.728179,123.144157 C278.296179,122.001157 280.963179,122.168157 283.728179,123.644157 Z M42.7281789,164.644157 C41.4051789,163.828157 40.7391789,162.661157 40.7281789,161.144157 C39.2631789,157.989157 39.9291789,155.155157 42.7281789,152.644157 C58.0611789,151.977157 73.3951789,151.977157 88.7281789,152.644157 C91.6221789,155.553157 92.4551789,159.053157 91.2281789,163.144157 C90.8451789,163.700157 90.3451789,164.033157 89.7281789,164.144157 C74.2331789,165.305157 58.5671789,165.472157 42.7281789,164.644157 Z M83.2281789,193.144157 C82.8343456,194.33038 82.0694505,194.991228 80.9326513,195.125861 L80.7281789,195.144157 L80.7281789,195.144157 C80.6171789,195.761157 80.2841789,196.261157 79.7281789,196.644157 C61.3951789,197.311157 43.0611789,197.311157 24.7281789,196.644157 C19.0194789,193.099157 18.3527789,188.765157 22.7281789,183.644157 C42.0611789,182.977157 61.3951789,182.977157 80.7281789,183.644157 C81.6091789,184.352157 82.2751789,185.186157 82.7281789,186.144157 C83.8571789,188.272157 84.0241789,190.605157 83.2281789,193.144157 Z M79.7281789,226.644157 C54.2251789,227.474157 28.8911789,227.307157 3.72817889,226.144157 C2.39487889,226.144157 1.72817889,225.477157 1.72817889,224.144157 C-0.732121114,221.219157 -0.565521114,218.219157 2.22817889,215.144157 C2.97857889,214.518157 3.81197889,214.018157 4.72817889,213.644157 C29.7281789,212.977157 54.7281789,212.977157 79.7281789,213.644157 C81.6041789,214.562157 82.6041789,216.062157 82.7281789,218.144157 C84.4201789,221.789157 83.4201789,224.622157 79.7281789,226.644157 Z" id="Combined-Shape"></path></g></svg>
                                            <span>Race</span>
                                        </label>
                                        <input id="form-activity_mood-travel"
                                               v-model="reportData.activity.mood"
                                               @change="selectMood()"
                                               name="form-activity_mood"
                                               type="radio"
                                               value="travel"
                                               hidden="hidden" />
                                        <label for="form-activity_mood-travel"
                                               class="flex items-center justify-center gap-2 rounded-[100px!important] px-4 py-2 text-sm font-bold"
                                               :class="{ 'bg-primary text-gray-900': reportData.activity.mood === 'travel', 'transition-colors hover:bg-primary/50': reportData.activity.mood !== 'travel' }">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20"><path fill="currentColor" d="M9.104 4.002c-1.476 0-2.5.55-3.216 1.378c-.694.802-1.075 1.838-1.357 2.769L4.273 9H2.5a.5.5 0 0 0-.5.5c0 1.076.497 2.102 1.298 2.63l-.442 1.072a1.31 1.31 0 0 0 1.212 1.81h1.463c.507 0 .97-.294 1.186-.753l.47-1c1.314.182 2.644.182 3.958 0l.47 1c.217.46.679.753 1.186.753h1.449a1.31 1.31 0 0 0 1.211-1.81l-.497-1.206h1.703c.674 0 1.333-.521 1.333-1.257V10c0-1.137-.987-1.996-2.12-1.996h-2.075c-.287-.907-.707-1.876-1.409-2.636c-.757-.819-1.817-1.365-3.292-1.365m5.569 6.995l-.576-1.994h1.782c.658 0 1.121.485 1.121.996v.741c0 .09-.112.257-.333.257zm-.572 1.532l.436 1.055a.31.31 0 0 1-.287.429H12.8a.31.31 0 0 1-.28-.179l-.355-.753q.981-.208 1.935-.552m-7.935.553l-.354.752a.31.31 0 0 1-.281.179H4.068a.31.31 0 0 1-.287-.429l.436-1.059q.961.348 1.949.557m-2.533-1.965A2.06 2.06 0 0 1 3.047 10h.923zM5.488 8.44c.276-.912.61-1.772 1.157-2.405c.524-.607 1.27-1.032 2.459-1.032c1.194 0 1.988.428 2.558 1.044c.586.635.959 1.495 1.23 2.39l.907 3.139a13.48 13.48 0 0 1-9.261.003z"/></svg>
                                            <span>Travel</span>
                                        </label>
                                    </div>
                                    <p class="grow w-full max-w-[calc(100%-450px)] border-l-base-content-100 border-l-3 pl-6 text-sm">
                                    <span>
                                        What's your approach to this adventure? <br>
                                        * <b>Travel:</b> no stopwatch, no time limit, no records to beat. Just enjoy the journey.<br>
                                        * <b>Race:</b> I have a goal to achieve and I have to be fast as possible.
                                    </span>
                                    </p>
                                </div>
                                <div class="w-full grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div class="flex flex-col gap-3">
                                        <label class="text-base font-bold text-gray-900">Start Date</label>
                                        <div class="relative">
                                            <flat-pickr
                                                id="form-start_date"
                                                class="w-full rounded-full pr-[45px] border-primary bg-transparent px-4 py-2 text-sm text-gray-800 focus:border-primary focus:ring-primary"
                                                v-model="reportData.setts.start"
                                                :config="flatpickrConfig"
                                                name="form-start_date"
                                                type="date"
                                                placeholder="Select date"
                                                required />
                                            <svg class="absolute top-[11px] right-[12px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 4.75H6.75a3.5 3.5 0 0 0-3.5 3.5v9.5a3.5 3.5 0 0 0 3.5 3.5h10.5a3.5 3.5 0 0 0 3.5-3.5v-9.5a3.5 3.5 0 0 0-3.5-3.5m-14 4.5h17.5M7.361 4.75v-2m9.25 2v-2"/></svg>
                                        </div>
                                    </div>
                                    <div :hidden="reportData.activity.mood === 'race'" class="flex flex-col gap-3">
                                        <label class="text-base font-bold text-gray-900">Number of Stages</label>
                                        <div class="relative">
                                            <input id="form-stages"
                                                   class="w-full rounded-full border-primary border-2 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-primary focus:ring-primary"
                                                   v-model="reportData.setts.stages"
                                                   name="form-stages"
                                                   type="number"
                                                   min="1"
                                                   placeholder="e.g., 3"
                                                   required />
                                            <svg class="absolute top-[11px] right-[12px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M18 16a3 3 0 1 1 0 6a3 3 0 0 1 0-6M15.5 4a4.5 4.5 0 1 1 0 9h-7a2.5 2.5 0 0 0 0 5H13a1 1 0 1 1 0 2H8.5a4.5 4.5 0 1 1 0-9h7a2.5 2.5 0 0 0 0-5H11a1 1 0 1 1 0-2zM6 2a3 3 0 1 1 0 6a3 3 0 0 1 0-6"/></g></svg>
                                        </div>
                                    </div>
                                    <div :hidden="reportData.activity.mood === 'travel'" class="flex flex-col gap-3">
                                        <label class="text-base font-bold text-gray-900">Number of Hours</label>
                                        <div class="relative">
                                            <input id="form-hours"
                                                   class="w-full rounded-full border-primary border-2 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-primary focus:ring-primary"
                                                   v-model="reportData.setts.hours"
                                                   name="form-hours"
                                                   type="number"
                                                   min="1"
                                                   placeholder="e.g., 80"
                                                   required/>
                                            <svg class="absolute top-[11px] right-[12px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M18 16a3 3 0 1 1 0 6a3 3 0 0 1 0-6M15.5 4a4.5 4.5 0 1 1 0 9h-7a2.5 2.5 0 0 0 0 5H13a1 1 0 1 1 0 2H8.5a4.5 4.5 0 1 1 0-9h7a2.5 2.5 0 0 0 0-5H11a1 1 0 1 1 0-2zM6 2a3 3 0 1 1 0 6a3 3 0 0 1 0-6"/></g></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- End Second Content -->

                        <!-- Third Content -->
                        <div :hidden="stepper.currentIndex !== 3">
                            <h3 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                                3. Generate report
                            </h3>
                            <p class="text-base text-neutral-600 dark:text-neutral-400">
                                Ci siamo, il tuo report è quasi pronto. Un ultimo passo verso la tua avventura!
                            </p>
                            <br>
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col w-full max-w-[360px] gap-3">
                                    <label class="text-base font-bold text-gray-900">Report title</label>
                                    <div class="relative">
                                        <input id="form-title"
                                               name="form-title"
                                               class="w-full rounded-full border-primary border-2 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-primary focus:ring-primary"
                                               placeholder="e.g., Gravel Adventure in Italy 🇮🇹"
                                               v-model="reportData.title"
                                               type="text"/>
                                    </div>
                                </div>
                                <div class="flex flex-wrap items-start w-full gap-3">
                                    <label class="w-full text-base font-bold text-gray-900 dark:text-white">Visibility</label>
                                    <div class="grid grid-cols-2 w-full max-w-[360px] mr-[20px] gap-2 rounded-full bg-primary/10 p-1 dark:bg-primary/20">
                                        <input id="form-visibility"
                                               v-model="reportData.public"
                                               name="form-visibility"
                                               type="checkbox"
                                               hidden="hidden" />
                                        <label for="form-visibility"
                                               class="flex items-center justify-center gap-2 rounded-[100px!important] px-4 py-2 text-sm font-bold transition-colors"
                                               :class="{ 'bg-primary text-gray-900': reportData.public === false, 'transition-colors hover:bg-primary/50': reportData.public !== false }">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5 16a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0"/><path fill="currentColor" fill-rule="evenodd" d="m7.622 10.597l-.316-2.839a5 5 0 0 1 0-1.095l.023-.205a4.7 4.7 0 0 1 9.342 0l.023.205q.06.547 0 1.095l-.316 2.84l.687.054a2.36 2.36 0 0 1 2.142 1.972a20.9 20.9 0 0 1 0 6.752a2.36 2.36 0 0 1-2.142 1.972l-1.496.12c-2.376.19-4.762.19-7.138 0l-1.496-.12a2.36 2.36 0 0 1-2.142-1.972a20.9 20.9 0 0 1 0-6.752a2.36 2.36 0 0 1 2.142-1.972zM11.626 3.8a3.2 3.2 0 0 1 3.554 2.825l.023.205q.042.381 0 .764l-.321 2.89a45 45 0 0 0-5.764 0l-.32-2.89a3.5 3.5 0 0 1 0-.764l.022-.205A3.2 3.2 0 0 1 11.626 3.8m3.824 8.229a43.4 43.4 0 0 0-6.9 0l-1.495.12a.86.86 0 0 0-.782.719a19.4 19.4 0 0 0 0 6.266a.86.86 0 0 0 .782.72l1.496.12c2.296.183 4.602.183 6.899 0l1.496-.12a.86.86 0 0 0 .781-.72a19.4 19.4 0 0 0 0-6.266a.86.86 0 0 0-.781-.72z" clip-rule="evenodd"/></svg>
                                            <span>Private</span>
                                        </label>
                                        <label for="form-visibility"
                                               class="flex items-center justify-center gap-2 rounded-[100px!important] px-4 py-2 text-sm font-bold"
                                               :class="{ 'bg-primary text-gray-900': reportData.public === true, 'transition-colors hover:bg-primary/50': reportData.public !== true }">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5 16a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0"/><path fill="currentColor" fill-rule="evenodd" d="M9.81 4.005a3.2 3.2 0 0 1 4.164 1.808l.075.192q.14.359.198.738l.217 1.423l1.483-.226l-.217-1.423a5 5 0 0 0-.283-1.057l-.075-.193a4.7 4.7 0 0 0-9.024 2.418l.03.204q.084.545.284 1.058l.655 1.675l-.382.03a2.36 2.36 0 0 0-2.142 1.972a20.9 20.9 0 0 0 0 6.752a2.36 2.36 0 0 0 2.142 1.972l1.496.12c2.376.19 4.762.19 7.138 0l1.496-.12a2.36 2.36 0 0 0 2.142-1.972a20.9 20.9 0 0 0 0-6.752a2.36 2.36 0 0 0-2.142-1.972l-1.496-.12a45 45 0 0 0-6.69-.033l-.82-2.098a3.5 3.5 0 0 1-.197-.738L7.83 7.46a3.2 3.2 0 0 1 1.98-3.455m5.64 8.023a43.4 43.4 0 0 0-6.9 0l-1.496.12a.86.86 0 0 0-.781.719a19.4 19.4 0 0 0 0 6.266a.86.86 0 0 0 .781.72l1.497.12c2.296.183 4.602.183 6.898 0l1.496-.12a.86.86 0 0 0 .782-.72a19.4 19.4 0 0 0 0-6.266a.86.86 0 0 0-.782-.72z" clip-rule="evenodd"/></svg>
                                            <span>Public</span>
                                        </label>
                                    </div>
                                    <p class="grow w-full max-w-[calc(100%-450px)] border-l-base-content-100 border-l-3 pl-6 text-sm">
                                        <span>
                                            Set the visibility of your report: <br>
                                            * <b>Private:</b> visible only to you.<br>
                                            * <b>Public:</b> Visible to everyone on your profile.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- End Third Content -->

                        <!-- Final Content -->
                        <div data-stepper-content-item='{ "isFinal": true }'
                             style="display: none;">
                            <div class="border-base-content/40 bg-base-200/50 flex h-48 items-center justify-center rounded-xl border border-dashed p-4">
                                <h3 class="text-base-content/50 text-2xl">Final content</h3>
                            </div>
                        </div>
                        <!-- End Final Content -->

                        <!-- Button Group -->
                        <div class="mt-5 flex items-center justify-between gap-x-2">
                            <button type="button"
                                    class="btn btn-primary"
                                    :disabled="stepper.currentIndex === 1"
                                    @click="stepperBack()">
                                <span class="icon-[tabler--chevron-left] text-primary-content rtl:rotate-180"></span>
                                Back
                            </button>
                            <button type="button"
                                    class="btn btn-primary"
                                    @click="stepperNext()"
                                    :disabled="(stepper.currentIndex === 1 && (!reportData.file.length)) || (stepper.currentIndex === 2 && (!reportData.setts.start || !(reportData.setts.hours || reportData.setts.stages)))"
                                    :hidden="stepper.currentIndex === 3">
                                Next
                                <span class="icon-[tabler--chevron-right] text-primary-content rtl:rotate-180"></span>
                            </button>
                            <button type="button"
                                    class="btn btn-primary"
                                    @click="generateReport()"
                                    :hidden="stepper.currentIndex < 3">
                                GENERATE  !
                            </button>
                        </div>
                        <!-- End Button Group -->

                    </form>
                </div>
                <!-- End Stepper Content -->

            </div>
            <!-- End Stepper -->
        </div>
    </section>

</template>

<style scoped>
@import '../assets/css/main.css';
/*@import '../assets/css/views/upload.css';*/
</style>

<script>
import FileDropper from "../components/FileDropper.vue";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
    name: "UploadView",
    components: {
        FileDropper,
        flatPickr
    },
    data() {
        return {
            reportData: {
                file: [],
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
            stepper: {
                currentIndex: 1
            },
            flatpickrConfig: {
                wrap: false, // set wrap to true only when using 'input-group'
                altFormat: 'j/m/Y H:i',
                altInput: true,
                dateFormat: 'Y-m-d',
                enableTime: true,
                defaultHour: 8,
                defaultMinute: 0,
                minDate: 'today',
                locale: 'Hindi', // locale for this instance only
            }
        }
    },
    methods: {
        stepperNext() {
            if(this.stepper.currentIndex < 3) {
                this.stepper.currentIndex++;
            }
        },
        stepperBack() {
            if(this.stepper.currentIndex > 1) {
                this.stepper.currentIndex--;
            }
        },
        fileUpload(file) {
            this.reportData.file = file;
        },
        selectMood() {
            this.reportData.setts.hours = '';
            this.reportData.setts.stages = '';
        },
        generateReport() {

        }
    }
}

</script>