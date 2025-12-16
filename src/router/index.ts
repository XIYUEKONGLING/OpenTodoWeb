import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SettingsView from '../views/SettingsView.vue';
import ProjectView from '../views/ProjectView.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/settings', component: SettingsView },
    { path: '/project/:id', component: ProjectView }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
