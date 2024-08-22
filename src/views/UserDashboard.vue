<!-- eslint-disable vue/require-toggle-inside-transition -->
<template>
    <div class="dashboard-layout">
      <!-- Hamburger Menu -->
      <div class="hamburger-menu" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </div>
  
      <!-- Sidebar with Slide-In Animation -->
      <transition name="slide">
        <aside class="sidebar" :class="{ open: isSidebarOpen }">
          <div class="sidebar-header">
            <!-- Logo Image -->
            <img src="../assets/c logo.png" alt="Logo" class="sidebar-logo" />
            <h2 class="sidebar-title">Event Center</h2>
          </div>
          <ul class="sidebar-menu">
            <li>
              <router-link to="/user-dashboard">
                <i class="fas fa-home"></i>
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/user-dashboard/user-profile">
                <i class="fas fa-user"></i>
                User Profile
              </router-link>
            </li>
            <li>
              <router-link to="/user-dashboard/book-event">
                <i class="fas fa-calendar-alt"></i>
                Book Event
              </router-link>
            </li>
            <li>
              <router-link to="/user-dashboard/view-booked-events">
                <i class="fas fa-calendar-check"></i>
                View Booked Events
              </router-link>
            </li>
            <hr class="sidebar-divider" />
            <li>
              <router-link to="/login">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </router-link>
            </li>
          </ul>
        </aside>
      </transition>
  
      <!-- Main Content with Fade-In Transition -->
      <transition name="fade">
        <div class="content" :style="contentStyle">
          <router-view /> <!-- This is where nested routes will be rendered -->
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Set the sidebar to open by default
  const isSidebarOpen = ref(true);
  const contentStyle = ref({ marginLeft: '250px' });
  
  // Function to toggle the sidebar and adjust content
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  // Watch for changes in the sidebar state to adjust content position
  watch(isSidebarOpen, (newValue) => {
    contentStyle.value.marginLeft = newValue ? '250px' : '30px'; // Adjusted margin-left when sidebar is closed
  });
  </script>
  
  <style scoped>
  /* Existing styles */
  </style>
  
  
  <style scoped>
  /* Dashboard Layout */
  .dashboard-layout {
    display: flex;
    height: 100vh;
    position: relative;
  }
  
  /* Hamburger Menu */
  .hamburger-menu {
    position: absolute;
    top: 1rem;
    left: 1rem; /* Moved to the left side */
    font-size: 2rem;
    color: black; /* Changed to black */
    cursor: pointer;
    z-index: 1000;
  }
  
  .hamburger-menu i:hover {
    color: #f39c12;
    transition: color 0.3s ease;
  }
  
  /* Sidebar */
  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
    opacity: 1;
  }
  
  /* Logo Image */
  .sidebar-logo {
    width: 100px; /* Adjust as needed */
    margin-top: 2rem; /* Space above the logo */
    margin-bottom: 1rem; /* Space below the logo */
  }
  
  /* Animation for sliding in and out */
  .slide-enter-active {
    animation: slideInMobile 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
  }
  
  .slide-leave-active {
    animation: slideOutMobile 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
  }
  
  @keyframes slideInMobile {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutMobile {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
  
  /* Sidebar Menu Styling */
  .sidebar-menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
    margin-top: 2rem;
  }
  
  .sidebar-menu li {
    margin: 1.5rem 0; /* Increased margin to prevent overlap with toggle menu */
  }
  
  .sidebar-menu li a {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    padding: 0.75rem;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
    border-radius: 5px;
  }
  
  .sidebar-menu li a i {
    margin-right: 1rem;
  }
  
  .sidebar-menu li a:hover {
    background-color: #34495e;
    color: #ecf0f1;
    transform: translateX(5px);
  }
  
  /* Sidebar Divider */
  .sidebar-divider {
    margin: 1.5rem 0;
    border: none;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  /* Fade-in Animation for Content */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  /* Content Area Styles */
  .content {
    flex-grow: 1;
    padding: 2rem;
    background-color: #ecf0f1;
    overflow-y: auto;
    font-family: Arial, sans-serif;
    color: #333;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .dashboard-layout {
      flex-direction: column;
    }
  
    .sidebar {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      transform: translateX(-100%);
      opacity: 0;
    }
  
    .content {
      padding: 1rem;
      margin-left: 0;
    }
  }
  </style>
  