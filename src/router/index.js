import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../components/auth/Login.vue';
import SignUp from '../components/auth/SignUp.vue';
import UserDashboard from '../views/UserDashboard.vue';
import Dashboard from '../views/Dashboard.vue';
import UserProfile from '../views/UserProfile.vue';
import BookEvent from '../views/BookEvent.vue';
import ViewBookedEvents from '../views/ViewBookedEvents.vue';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth functions

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/user-dashboard',
      component: UserDashboard,
      children: [
        { path: '', component: Dashboard },
        { path: 'user-profile', component: UserProfile },
        { path: 'book-event', component: BookEvent },
        { path: 'view-booked-events', component: ViewBookedEvents },
      ],
    },
    // {
    //   path: '/logout',
    //   beforeEnter: async (to, from, next) => {
    //     const auth = getAuth();
    //     try {
    //       await signOut(auth); // Firebase sign out
    //       console.log('Logged out successfully');
    //       next('/login'); // Redirect to login page after logout
    //     } catch (error) {
    //       console.error('Error during logout:', error.message);
    //       next(false); // Prevent navigation if logout fails
    //     }
    //   },
    // },
  ]
});

export default router;
