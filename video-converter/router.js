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
        { path: '/video-converter', name: 'VideoConverter', component: () => import('./src/components/VideoCovnersionOptions/TestVideoConverter.vue') },
        { path: '/', name: 'ImageConverter', component: () => import('./src/components/ImageCovnersionOptions/TestImageConverter.vue') },

        // { path: '/', name: 'VideoConverter', component: () => import('./src/components/VideoCovnersionOptions/VideoConverter.vue') },
        // { path: '/image-converter', name: 'ImageConverter', component: () => import('./src/components/ImageCovnersionOptions/ImageConverter.vue') },
        { path: '/test', name: 'Test', component: () => import('./src/test.vue') },
      ],
    },
  ],
});

export default router;
