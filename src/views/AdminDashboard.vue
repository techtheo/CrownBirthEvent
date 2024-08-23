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
            <v-img src="../assets/admin-logo.png" alt="Logo" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title font-weight-bold">Admin Center</v-list-item-title>
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
  
  // Sidebar menu items for admin
  const menuItems = [
    { title: 'Admin Dashboard', route: '/admin-dashboard', icon: 'mdi-view-dashboard' },
    { title: 'Admin Profile', route: '/admin-dashboard/admin-profile', icon: 'mdi-account' },
    { title: 'Manage Events', route: '/admin-dashboard/manage-events', icon: 'mdi-calendar' },
    { title: 'View All Bookings', route: '/admin-dashboard/view-all-bookings', icon: 'mdi-calendar-check' },
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
  /* Reuse similar styles as user-dashboard for consistency */
  .v-app-bar {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
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
  
  .v-divider {
    background-color: #bdc3c7;
  }
  
  .title {
    font-size: 1.4rem;
    color: #f39c12;
  }
  
  .v-list-item-title {
    font-size: 1.1rem;
  }
  
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
  