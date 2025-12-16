import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SettingsView from '../views/SettingsView.vue';
import ProjectView from "../views/ProjectView.vue";
import TaskListView from "../views/TaskListView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/settings', component: SettingsView },
    { path: '/project/:pid', component: ProjectView },
    { path: '/project/:pid/list/:lid', component: TaskListView } // New nested view
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
