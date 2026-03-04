import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/discover' },
    {
      path: '/login',
      component: () => import('../views/Auth/Login.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      component: () => import('../views/Auth/Register.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/discover',
      component: () => import('../views/Discover.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      component: () => import('../views/Profile/MyProfile.vue'),
      meta: { requiresAuth: true }
    },
    // {
    //   path: '/trips',
    //   component: () => import('../views/Trips/MyTrips.vue'),
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/interests',
    //   component: () => import('../views/Interests.vue'),
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/chat',
    //   component: () => import('../views/Chat/ChatList.vue'),
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/chat/:interestId',
    //   component: () => import('../views/Chat/ChatRoom.vue'),
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/users/:id',
    //   component: () => import('../views/UserDetail.vue'),
    //   meta: { requiresAuth: true }
    // },
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
  if (to.meta.guestOnly && auth.isLoggedIn) return '/discover'
})

export default router