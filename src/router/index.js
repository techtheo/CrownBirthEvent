import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../components/auth/LogIn.vue';
import SignUp from '../components/auth/SignUp.vue';
import UserDashboard from '../views/UserDashboard.vue';
import DashBoard from '../views/DashBoard.vue';
import UserProfile from '../views/UserProfile.vue';
import BookEvent from '../views/BookEvent.vue';
import ViewBookedEvents from '../views/ViewBookedEvents.vue';
import Notifications from '../views/Notifications.vue';
import AdminDashboard from '../views/AdminDashboard.vue'; // Import Admin Dashboard component
import Overview from '../views/Overview.vue'; // Import Overview component for Admin Dashboard
import AdminProfile from '../views/AdminProfile.vue'; // Import Admin Profile component
import ManageEvents from '../views/ManageEvents.vue'; // Import Manage Events component
import ViewAllBookings from '../views/ViewAllBookings.vue'; // Import View All Bookings component
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth functions

const auth = getAuth();

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
        { path: '', component: DashBoard },
        { path: 'user-profile', component: UserProfile },
        { path: 'book-event', component: BookEvent },
        { path: 'view-booked-events', component: ViewBookedEvents },
        { path: 'notifications', component: Notifications }, // Add the Notifications route
      ],
    },
    {
      path: '/admin-dashboard',
      component: AdminDashboard,
      children: [
        { path: '', component: Overview }, // Default to Overview
        { path: 'overview', component: Overview }, // Overview route
        { path: 'admin-profile', component: AdminProfile },
        { path: 'manage-events', component: ManageEvents },
        { path: 'view-all-bookings', component: ViewAllBookings },
      ],
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
