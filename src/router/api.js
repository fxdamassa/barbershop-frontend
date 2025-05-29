import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue';
import UserDashboard from '../views/UserDashboard.vue';
import UserContact from '../views/UserContact.vue';
import AdmDashboard from '../views/AdmDashboard.vue';

const routes = [
    { path: '/', name: 'UserLogin', component: UserLogin },
    {
        path: '/dashboard',
        name: 'UserDashboard',
        component: UserDashboard,
        children: [
            {
                path: '/schedule',
                name: 'UserSchedule',
                component: () => import('../views/UserSchedule.vue'),
            },
            {
                path: '/contact',
                name: 'UserContact',
                component: UserContact,
            },
        ],
    },
    {
        path: '/admin',
        name: 'AdmDashboard',
        component: AdmDashboard,
        meta: { requiresAuth: true, requiresAdmin: true } // ✅ PROTEGE O ACESSO
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');

    if (to.meta.requiresAuth && !token) {
        return next('/');
    }

    if (to.meta.requiresAdmin && role !== 'adm') {
        return next('/dashboard');
    }

    next();
});

export default router;
