import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue';
import UserDashboard from '../views/UserDashboard.vue';
import UserSchedule from '../views/UserSchedule.vue';
import UserContact from '../views/UserContact.vue';

const routes = [
    { path: '/', name: 'UserLogin', component: UserLogin },
    {
        path: '/dashboard',
        name: 'UserDashboard',
        component: UserDashboard,
        children: [
            { path: '/schedule', name: 'UserSchedule', component: UserSchedule },
            { path: '/contact', name: 'UserContact', component: UserContact },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
