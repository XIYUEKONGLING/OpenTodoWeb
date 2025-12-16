import {createRouter, createWebHashHistory} from 'vue-router';
import HomeView from "../views/HomeView.vue";

const routes = [
    {
        path: '/',
        component: HomeView,
    }
];

var router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
