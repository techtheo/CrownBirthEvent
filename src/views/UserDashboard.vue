<!-- eslint-disable vue/require-toggle-inside-transition -->
<template>
  <v-layout>
    <!-- App Bar (Header) -->
    <v-app-bar app color="primary" dark dense>
      <v-app-bar-nav-icon @click="toggleSidebar" />
      <h4 class="white--text ml-4">CROWNBIRTH</h4>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sidebar (Navigation Drawer) -->
    <v-navigation-drawer v-model="isSidebarOpen" app permanent width="260">
      <!-- Sidebar Header with Logo -->
      <v-list-item class="pa-4">
        <v-list-item-avatar size="64">
          <v-img src="../assets/c logo.png" alt="Logo" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title font-weight-bold">Event Center</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Sidebar Menu Items -->
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          @click="navigate(item.route)"
          :class="{ 'active-item': isActiveRoute(item.route) }"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item>
      </v-list>

      <!-- Logout Button -->
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item @click="navigate('/login')">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid>
        <router-view /> <!-- This will load the main content based on the current route -->
      </v-container>
    </v-main>
  </v-layout>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Sidebar toggle and menu items
const isSidebarOpen = ref(true);
const router = useRouter();
const route = useRoute();

// Sidebar menu items
const menuItems = [
  { title: 'Dashboard', route: '/user-dashboard', icon: 'mdi-view-dashboard' },
  { title: 'User Profile', route: '/user-dashboard/user-profile', icon: 'mdi-account' },
  { title: 'Book Event', route: '/user-dashboard/book-event', icon: 'mdi-calendar' },
  { title: 'View Booked Events', route: '/user-dashboard/view-booked-events', icon: 'mdi-calendar-check' },
  { title: 'Notifications', route: '/user-dashboard/notifications', icon: 'mdi-bell' }, // New Notifications item
];

// Function to toggle sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Navigation and active route highlight
const navigate = (route) => {
  router.push(route);
};

const isActiveRoute = (path) => {
  return route.path === path;
};
</script>

<style scoped>
/* App Bar */
.v-app-bar {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Sidebar */
.v-navigation-drawer {
  background-color: #34495e;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.v-list-item {
  display: flex;
  align-items: center;
  color: #ecf0f1;
  font-weight: 500;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: #2c3e50;
  transform: translateX(5px);
}

.active-item {
  background-color: #2c3e50 !important;
  color: #f39c12 !important;
}

.v-list-item-icon {
  margin-right: 10px;
  color: #f39c12;
}

.v-divider {
  background-color: #bdc3c7;
}

/* Typography */
.title {
  font-size: 1.4rem;
  color: #f39c12;
}

.v-list-item-title {
  font-size: 1.1rem;
}

/* Ensure icons and titles are aligned side-by-side */
.v-list-item-content {
  flex-grow: 1;
}

/* Content Area */
.v-main {
  background-color: #ecf0f1;
  padding-top: 80px;
}

.v-container {
  max-width: 90%;
  margin: auto;
}

.v-btn {
  color: #fff;
}
</style>
