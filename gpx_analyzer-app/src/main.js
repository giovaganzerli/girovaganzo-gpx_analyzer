import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import p5vue from 'p5vue'

createApp(App).use(router).use(p5vue).mount('#app')