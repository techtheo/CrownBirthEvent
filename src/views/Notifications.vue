<template>
    <v-container class="notification-container">
      <h2>Notifications</h2>
      <v-list>
        <!-- Example notifications -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Notification 1</v-list-item-title>
            <v-list-item-subtitle>Details about notification 1</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Notification 2</v-list-item-title>
            <v-list-item-subtitle>Details about notification 2</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'Notifications',
  };
  </script>
  
  <style scoped>
 .notification-container{
  padding: 2rem;
  /* background-color: #2c3e50; */
  min-height: 100vh;
 }
  </style>
  