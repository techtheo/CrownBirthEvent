import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting this generates a separate chunk (About.[hash].js) for this route which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterUser.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginUser.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPassword.vue')
    },

    // admin dashboard
    {
      path: '/admin/dashboard',
      name: 'dashboard-admin',
      component: () => import('../views/admin/DashboardAdmin.vue'),
      children: [
        {
          path: 'create-event',
          name: 'create-events',
          component: () => import('../views/admin/CreateEvents.vue')
        },
        {
          path: 'all-events',
          name: 'all-events',
          component: () => import('../views/admin/AllEvents.vue')
        },
        {
          path: 'overview',
          name: 'dashboard-overview',
          // component: () => import('../views/Overview.vue')
        },
        {
          path: 'campaign',
          name: 'campaign',
          // component: () => import('../views/AllCampaigns.vue')
        }
      ]
    },


    // user dashboard
    {
      path: '/dashboard',
      name: 'dashboard-user',
      component: () => import('../views/user/DashboardUser.vue'),
      children: [
        {
          path: 'create-event',
          name: 'create-event',
          component: () => import('../views/user/CreateEvent.vue')
        },
        {
          path: 'event-bookings',
          name: 'list-events',
          component: () => import('../views/user/ListEvents.vue')

        },
        {
          path: 'campaign',
          name: 'campaign',
          // component: () => import('../views/AllCampaigns.vue')
        }
      ]
    },
    {
      path: '/events/:id',
      name: 'EventDetails',
      component: () => import ('../views/EventDetails.vue')
    }
  ]
})

export default router
