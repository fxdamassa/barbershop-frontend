import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue'; // Certifique-se de que o caminho está correto
import GoogleLogin from '../views/Login.vue';
import CalendarView from '../views/Calendar.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    {
        path: '/login',
        name: 'GoogleLogin',
        component: GoogleLogin,
    },
    {
        path: '/calendar',
        name: 'CalendarView',
        component: CalendarView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
