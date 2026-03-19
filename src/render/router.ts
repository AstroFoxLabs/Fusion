import HomeView from '@render/views/home/HomeView.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/', name: 'app', component: HomeView }],
});

export default router;
