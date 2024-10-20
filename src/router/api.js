import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue'; // Certifique-se que o caminho está correto
import GoogleCalendar from '../views/GoogleCalendar.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: UserLogin,
    },
    {
        path: '/calendar',
        name: 'GoogleCalendar',
        component: GoogleCalendar,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
