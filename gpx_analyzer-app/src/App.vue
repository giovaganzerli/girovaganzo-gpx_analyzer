<template>
    <div id="app-container">

        <BGCanvas />
        <Header />
        <router-view id="app-body" class="app-body"/>
        <Footer />

    </div>
</template>

<style scoped>
@import './assets/css/main.css';
</style>

<script setup>
import p5 from "p5"
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import BGCanvas from "./components/BGCanvas.vue";

</script>
