import { createApp } from 'vue';
import App from './App.vue';
import router from './router/api';
import './index.css';

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App);

app.use(VCalendar, {
    componentPrefix: 'vc',
});

app.use(router);

app.mount('#app');
