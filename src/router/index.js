import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../components/auth/Login.vue';
import SignUp from '../components/auth/SignUp.vue';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth functions

const auth = getAuth();   // initializes Firebase Authentication by creating an auth instance that will be used to manage authentication status and log the user out.

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
      component: () => import('../views/UserDashboard.vue'),
      children: [
        {
          path: '', component: () => import('../views/Dashboard.vue'),
        },
        { path: 'user-profile', component: () => import('../views/UserProfile.vue') },
        {
          path: 'book-event', component: () => import('../views/BookEvent.vue'),
          children: [
            { path: 'confirmation', name: 'ConfirmationPage', component: () => import('../views/ConfirmationPage.vue') },
          ]
        },
        { path: 'view-booked-events', component: () => import('../views/ViewBookedEvents.vue') },
        { path: 'notifications', component: () => import('../views/Notifications.vue') }, // Add the Notifications route
      ],
    },
    {
      path: '/admin-dashboard',
      component: () => import('../views/AdminDashboard.vue'),
      children: [
        {
          path: '', component: () => import('../views/Overview.vue'),
        }, // Default to Overview
        { path: 'overview', component: () => import('../views/Overview.vue') }, // Overview route
        { path: 'admin-profile', component: () => import('../views/AdminProfile.vue') },
        { path: 'manage-events', component: () => import('../views/ManageEvents.vue') },
        { path: 'view-all-bookings', component: () => import('../views/ViewAllBookings.vue') },
      ],
    },
    {
      path: '/confirmation',
      name: 'ConfirmationPage',
      component: () => import('../views/ConfirmationPage.vue') // Add the ConfirmationPage route
    },
    {
      path: '/logout',
      beforeEnter: async (to, from, next) => {
        try {
          await signOut(auth); // Firebase sign out
          console.log('Logged out successfully');
          next('/login'); // Redirect to login page after logout
        } catch (error) {
          console.error('Error during logout:', error.message);
          next(false); // Prevent navigation if logout fails
        }
      },
    },
  ]
});

export default router;



// SUMMARY // 

// Summary:
// The code sets up a structured and dynamic routing system for a Vue.js app.
// It protects certain routes like /user-dashboard and /admin-dashboard, ensuring they have their own child routes for better user experience.
// Firebase Authentication is integrated for handling user logout securely via the /logout route.
// The use of lazy-loaded components optimizes the performance of the application by loading only the necessary parts of the application when required.