import { createRouter, createWebHistory } from 'vue-router';
import Mainlayout from './src/layouts/Mainlayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Mainlayout',
      component: Mainlayout,
      children: [
        { path: '/', name: 'VideoConverter', component: () => import('./src/components/Home.vue') },
        { path: '/image-converter', name: 'ImageConverter', component: () => import('./src/components/ImageCovnersionOptions/ImageConverter.vue') },
        // { path: '/video-converter', name: 'ImageConverter', component: () => import('./src/components/VideoCovnersionOptions/VideoConverter.vue') },
      ],
    },
  ],
});

export default router;
