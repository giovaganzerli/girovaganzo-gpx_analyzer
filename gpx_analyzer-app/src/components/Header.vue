<template>
    <header id="app-header"
            class="fixed z-70 top-0 left-0 w-full p-[20px]">
        <nav class="flex items-center justify-between w-boxed rounded-box py-[10px] shadow-sm shadow-base-300 bg-base-100">

            <div class="dropdown relative inline-flex [--placement:bottom] md:hidden">
                <a id="dropdown-default"
                   type="button"
                   class="p-0 cursor-pointer"
                   aria-haspopup="dialog"
                   aria-expanded="false"
                   aria-controls="mobile_menu-overlay"
                   data-overlay="#mobile_menu-overlay">
                    <span class="block icon-[tabler--menu-2] dropdown-open:hidden size-5 ml-[20px]"></span>
                </a>
            </div>

            <a href="/"
               class="flex text-nowrap px-[20px] py-[10px]">
                <svg width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M17.6745 16.9224L12.6233 10.378C12.2167 9.85117 11.4185 9.8611 11.0251 10.3979L6.45728 16.631C6.26893 16.888 5.96935 17.0398 5.65069 17.0398H3.79114C2.9635 17.0398 2.49412 16.0919 2.99583 15.4336L11.0224 4.90319C11.4206 4.38084 12.2056 4.37762 12.608 4.89668L20.9829 15.6987C21.4923 16.3558 21.024 17.3114 20.1926 17.3114H18.4661C18.1562 17.3114 17.8638 17.1677 17.6745 16.9224ZM12.5866 15.5924L14.8956 18.3593C15.439 19.0105 14.976 20 14.1278 20H9.74075C8.9164 20 8.4461 19.0586 8.94116 18.3994L11.0192 15.6325C11.4065 15.1169 12.1734 15.0972 12.5866 15.5924Z"
                          fill="var(--color-primary)"/>
                </svg>
                <b>GPX Analyzer</b>
            </a>

            <ul class="max-md:hidden flex flex-nowrap items-center w-full justify-center">
                <li class="mx-[20px] hover:underline"><a href="#section-features">Features</a></li>
                <li class="mx-[20px] hover:underline"><a href="#section-howitwork">How it works</a></li>
                <li class="mx-[20px] hover:underline"><a href="#section-pricing">Pricing</a></li>
            </ul>

            <a href="/upload"
               class="btn btn-secondary min-w-[150px] max-md:ml-[auto]">ANALYZE NOW!</a>

            <div class="items-center gap-4">
                <div class="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                    <button id="dropdown-avatar"
                            type="button"
                            class="dropdown-toggle flex items-center"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown">
                        <div class="avatar">
                            <div class="size-9.5 rounded-full">
                                <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar 1"/>
                            </div>
                        </div>
                    </button>

                    <ul class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60 top-[15px!important] left-[8px!important]"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="dropdown-avatar">
                        <li class="dropdown-header gap-2">
                            <div class="avatar">
                                <div class="w-10 rounded-full">
                                    <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar"/>
                                </div>
                            </div>
                            <div>
                                <h6 class="text-base-content text-base font-semibold mb-[-10px]">GIROVAGANZO</h6>
                                <small class="text-base-content/50">giovaganzerli@gmail.com</small>
                            </div>
                        </li>
                        <li>
                            <a href="#" class="dropdown-item">
                                <span class="icon-[tabler--user]"></span>
                                My Profile
                            </a>
                        </li>
                        <li>
                            <a href="#" class="dropdown-item">
                                <span class="icon-[tabler--settings]"></span>
                                Settings
                            </a>
                        </li>
                        <li>
                            <a href="#" class="dropdown-item">
                                <span class="icon-[tabler--receipt-rupee]"></span>
                                Billing
                            </a>
                        </li>
                        <li>
                            <a href="#" class="dropdown-item">
                                <span class="icon-[tabler--help-triangle]"></span>
                                FAQs
                            </a>
                        </li>
                        <li class="dropdown-footer gap-2">
                            <a class="btn btn-error btn-soft btn-block" href="#">
                                <span class="icon-[tabler--logout]"></span>
                                Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <aside id="mobile_menu-overlay"
           class="overlay overlay-open:translate-x-0 drawer drawer-start hidden max-w-72 z-90"
           tabindex="-1" >

        <div class="drawer-header">
            <h3 class="drawer-title">Menu</h3>
            <button type="button" class="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay="#overlay-navigation-example" >
                <span class="icon-[tabler--x] size-4"></span>
            </button>
        </div>

        <div class="drawer-body justify-start pb-6">
            <ul class="menu space-y-0.5 p-0">

                <li>
                    <a href="#">
                        <span class="icon-[tabler--home] size-5"></span>
                        Dashboard
                    </a>
                </li>

                <li class="space-x-0.5">
                    <a class="collapse-toggle collapse-open:bg-base-content/10" id="layout-collapse" data-collapse="#layout-collapse-menu" >
                        <span class="icon-[tabler--layout-navbar] size-5"></span>
                        Layouts
                        <span class="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
                    </a>
                    <ul id="layout-collapse-menu" class="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby="layout-collapse" >
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Content Navbar
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Horizontal
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Without Menu
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="space-y-0.5">
                    <a class="collapse-toggle collapse-open:bg-base-content/10" id="front-page-collapse" data-collapse="#front-page-collapse-menu" >
                        <span class="icon-[tabler--box-multiple] size-5"></span>
                        Front Pages
                        <span class="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
                    </a>
                    <ul id="front-page-collapse-menu" class="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby="front-page-collapse" >
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Landing Page
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Pricing Page
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Checkout Page
                            </a>
                        </li>
                    </ul>
                </li>

                <div class="divider text-base-content/50 py-6 after:border-0">Apps & Pages</div>

                <li>
                    <a href="#">
                        <span class="icon-[tabler--message-chatbot] size-5"></span>
                        Chat
                    </a>
                </li>

                <li>
                    <a href="#">
                        <span class="icon-[tabler--mail] size-5"></span>
                        Email
                    </a>
                </li>

                <li>
                    <a href="#">
                        <span class="icon-[tabler--calendar] size-5"></span>
                        Calendar
                    </a>
                </li>

                <li class="space-x-0.5">
                    <a class="collapse-toggle collapse-open:bg-base-content/10" id="ecommerce-collapse" data-collapse="#ecommerce-collapse-menu" >
                        <span class="icon-[tabler--shopping-cart] size-5"></span>
                        Ecommerce
                        <span class="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
                    </a>
                    <ul id="ecommerce-collapse-menu" class="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby="ecommerce-collapse" >
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Products
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Categories
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Shipping & Delivery
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="icon-[tabler--point] size-5"></span>
                                Location
                            </a>
                        </li>
                    </ul>
                </li>
                <div class="divider text-base-content/50 py-6 after:border-0">Account</div>
                <li>
                    <a href="#">
                        <span class="icon-[tabler--login] size-5"></span>
                        Sign In
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="icon-[tabler--logout-2] size-5"></span>
                        Sign Out
                    </a>
                </li>
                <div class="divider text-base-content/50 py-6 after:border-0">Miscellaneous</div>
                <li>
                    <a href="#">
                        <span class="icon-[tabler--users-group] size-5"></span>
                        Support
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="icon-[tabler--files] size-5"></span>
                        Documentation
                    </a>
                </li>

            </ul>
        </div>
    </aside>
</template>

<style scoped>
@import '../assets/css/main.css';
/*@import '../assets/css/components/header.css';*/
</style>

<script setup>

</script>
