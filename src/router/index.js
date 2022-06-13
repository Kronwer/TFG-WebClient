import { createRouter, createWebHistory } from 'vue-router'
import HeatmapView from '../views/HeatmapView.vue'

const routes = [
  {
    path: '/',
    name: 'heatmap',
    component: HeatmapView
  },
  {
    path: '/building',
    name: 'building',
    component: () => import('../views/BuildingView.vue')
  },
  {
    path: '/ofertas',
    name: 'ofertas',
    component: () => import('../views/OfertasView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
