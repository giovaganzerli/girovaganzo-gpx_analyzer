<template>
    <div id="app" :class="'view-'+ currViewSlug">
        <header id="header">
            <nav>
                <router-link to="/">Home</router-link> |
                <router-link to="/about">About</router-link>
            </nav>
        </header>

        <router-view id="body"/>

        <footer id="footer"></footer>
    </div>
</template>

<style>
/* FONTS */
@import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic';
/* ASSETS */
@import './assets/css/main.css';
</style>

<script>

/* eslint-disable */

import appLogo from './assets/images/logo.png';

export default {
    name: 'App',
    data() {
    },
    watch: {
        $route: function () {
        }
    },
    created() {
    },
    methods: {}
}

</script>
