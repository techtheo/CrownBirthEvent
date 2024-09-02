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
              <v-text-field
                v-model="eventSpace.image"
                label="Image URL"
                outlined
                required
                @input="previewImage"
              ></v-text-field>
              <!-- Image Preview -->
              <v-img
                v-if="imagePreview"
                :src="imagePreview"
                class="image-preview"
                max-height="200"
              ></v-img>
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
        <v-row>
          <v-col v-for="space in eventSpaces" :key="space.id" cols="12" md="6">
            <v-card class="event-card">
              <v-img :src="space.image" class="event-img"></v-img>
              <v-card-title>{{ space.name }}</v-card-title>
              <v-card-subtitle>{{ formatCurrency(space.price) }}</v-card-subtitle>
              <v-card-text>{{ space.description }}</v-card-text>
              <v-card-actions>
                <v-btn icon class="delete-btn" @click="deleteEventSpace(space.id)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
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
  description: '',
  image: '',
});
const eventSpaces = ref([]);
const isLoading = ref(false);

// Refs for image preview
const imagePreview = ref(null);

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
    if (eventSpace.value.name && eventSpace.value.price && eventSpace.value.image) {
      // Add the event space to Firestore
      await addDoc(collection(db, 'event_spaces'), {
        name: eventSpace.value.name,
        price: parseCurrency(formattedPrice.value),
        description: eventSpace.value.description,
        image: eventSpace.value.image,
      });
      alert('Event space added successfully!');

      // Reset form
      eventSpace.value = { name: '', price: '', description: '', image: '' };
      formattedPrice.value = '';
      imagePreview.value = null;

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
  if (value === undefined || value === null) return '₦0.00';
  return `₦${parseFloat(value).toLocaleString('en-US')}`;
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

// Image preview function
const previewImage = () => {
  imagePreview.value = eventSpace.value.image || null;
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

.event-form-card {
  margin-bottom: 2rem;
}

.image-preview {
  margin-top: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-img {
  height: 200px;
  object-fit: cover;
}

.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.v-card-subtitle {
  color: #757575;
}

.v-btn {
  margin-top: 0px;
  width: 100%;
}

.v-card-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  background-color: white;
  border-radius: 50%;
  padding: 4px;
  padding-top: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.delete-btn {
  position: relative;
  /* background-color: white;
  border-radius: 15%;  */
  /* padding: 4px; */
}
</style>
