import Vue from 'vue'
import Router from 'vue-router'
import VueSession from 'vue-session'
import Home from './views/Home.vue'
import About from './views/About.vue'

Vue.use(Router);
Vue.use(VueSession, {persist: true});

const router = new Router({
    //mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/about',
            name: 'About',
            component: About
        }
    ]
});

export default router;
