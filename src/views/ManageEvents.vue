<template>
    <v-container class="manage-events-container" fluid>
      <!-- Form to Add Event Space -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="event-form-card">
            <v-card-title>
              <v-typography variant="h4">Add New Event Space</v-typography>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="addEventSpace">
                <v-text-field
                  v-model="eventSpace.name"
                  label="Event Space Name"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  v-model="formattedPrice"
                  label="Price"
                  outlined
                  required
                  @blur="updatePrice"
                ></v-text-field>
                <v-textarea
                  v-model="eventSpace.description"
                  label="Description"
                  outlined
                  rows="3"
                ></v-textarea>
                <v-btn color="primary" type="submit" :loading="isLoading">
                  Add Event Space
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- List of Event Spaces -->
        <v-col cols="12" md="6">
          <v-card class="event-list-card">
            <v-card-title>
              <v-typography variant="h4">Available Event Spaces</v-typography>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="space in eventSpaces" :key="space.id">
                    <v-list-item-content>
                      <v-list-item-title>{{ space.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ formatCurrency(space.price) }}</v-list-item-subtitle>
                      <v-list-item-text>{{ space.description }}</v-list-item-text>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon @click="deleteEventSpace(space.id)">
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
  
  // Refs to store event spaces
  const eventSpace = ref({
    name: '',
    price: '',
    description: ''
  });
  const eventSpaces = ref([]);
  const isLoading = ref(false);
  
  // Refs for price formatting
  const formattedPrice = ref('');
  
  // Firebase setup
  const db = getFirestore();
  
  const fetchEventSpaces = async () => {
    try {
      const spacesQuery = collection(db, 'event_spaces');
      const spacesSnap = await getDocs(spacesQuery);
      eventSpaces.value = spacesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching event spaces:', error);
    }
  };
  
  const addEventSpace = async () => {
    isLoading.value = true;
    try {
      if (eventSpace.value.name && eventSpace.value.price) {
        // Add the event space to Firestore
        await addDoc(collection(db, 'event_spaces'), {
          name: eventSpace.value.name,
          price: parseCurrency(formattedPrice.value),
          description: eventSpace.value.description
        });
        alert('Event space added successfully!');
        
        // Reset form
        eventSpace.value = { name: '', price: '', description: '' };
        formattedPrice.value = '';
        
        // Refresh the list
        fetchEventSpaces();
      } else {
        alert('Please fill in all required fields.');
      }
    } catch (error) {
      console.error('Error adding event space:', error);
      alert('Failed to add event space.');
    } finally {
      isLoading.value = false;
    }
  };
  
  const deleteEventSpace = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this event space?');
    if (!confirmed) return;
  
    try {
      await deleteDoc(doc(db, 'event_spaces', id));
      alert('Event space deleted successfully!');
      
      // Refresh the list
      fetchEventSpaces();
    } catch (error) {
      console.error('Error deleting event space:', error);
      alert('Failed to delete event space.');
    }
  };
  
  // Utility to format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '#0.00';
    return `#${parseFloat(value).toLocaleString('en-US')}`;
  };
  
  const parseCurrency = (value) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  };
  
  // Update eventSpace.price when formattedPrice changes
  watch(formattedPrice, (newVal) => {
    eventSpace.value.price = parseCurrency(newVal);
  });
  
  const updatePrice = () => {
    eventSpace.value.price = parseCurrency(formattedPrice.value);
  };
  
  // Fetch event spaces when the component is mounted
  onMounted(() => {
    fetchEventSpaces();
  });
  </script>
  
  <style scoped>
  .manage-events-container {
    padding: 2rem;
    background-color: #f9f9f9;
    min-height: 100vh;
  }
  
  .event-form-card, .event-list-card {
    margin-bottom: 2rem;
  }
  
  .v-card-title {
    font-size: 2rem;
    font-weight: bold;
  }
  
  .v-btn {
    margin-top: 1rem;
    width: 100%;
  }
  
  .v-list-item {
    transition: background-color 0.3s ease;
  }
  
  .v-list-item:hover {
    background-color: #f1f1f1;
  }
  </style>
  