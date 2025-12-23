// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const MainLayout = () => import('@/layouts/MainLayout.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    name: 'AuthLayout',
    component: AuthLayout, 
    alias: '',
    children: [
      {
        path: '/login', 
        name: 'Login',
        component: () => import('@/pages/Auth/Login.vue'),
        alias: ''
      }
    ]
  },
  {
    path: '',
    name: 'Layout',
    component: MainLayout, 
    children: [
      {
        path: '/home', 
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
        // alias: '',
      },
      {
        path: '/team/:id',
        name: 'Team',
        component: () => import('@/pages/Team/Team.vue'),
        props: true
      },
      {
        path: '/player/:playerId',
        name: 'Player',
        component: () => import('@/pages/Player/Player.vue'),
        props: true
      },
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
