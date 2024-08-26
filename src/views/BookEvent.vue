<template>
  <div class="booking-container">
    <h1>Book an Event Space</h1>
    <p>Book your event space through this page.</p>
    
    <form @submit.prevent="submitBooking">
      <div class="form-group">
        <label for="eventSpace">Event Space:</label>
        <select v-model="formData.eventSpace" id="eventSpace" required>
          <option v-for="space in eventSpaces" :key="space.id" :value="space.id">
            {{ space.name }} - {{ formatCurrency(space.price) }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="date">Select Date:</label>
        <vue-cal 
          :events="availableDates"
          v-model="formData.date"
          @dayClick="handleDateClick"
          hide-view-selector
          time
        />
      </div>
      
      <!-- Other form fields... -->

      <button type="submit">Proceed to Payment</button>
    </form>

    <div v-if="loading" class="spinner">Loading...</div>
    <div v-if="paymentSuccess" class="success-alert">Payment Successful!</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore';
// import VueCal from 'vue-cal'; // Import VueCal
// import 'vue-cal/dist/vuecal.css'; // Import VueCal styles


const formData = ref({
  eventSpace: '',
  date: '',
  eventType: '',
  guests: '',
  duration: 'full-day',
  time: '',
  email: ''
});
const eventSpaces = ref([]);
const availableDates = ref([]);
const loading = ref(false);
const paymentSuccess = ref(false);

const db = getFirestore();

const fetchEventSpaces = async () => {
  try {
    const spacesQuery = query(collection(db, 'event_spaces'));
    const querySnapshot = await getDocs(spacesQuery);
    eventSpaces.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch available dates from "bookings" collection
    const datesQuery = query(collection(db, 'bookings'), where('status', '==', 'available'));
    const datesSnapshot = await getDocs(datesQuery);
    availableDates.value = datesSnapshot.docs.map(doc => ({ date: doc.data().date }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const submitBooking = async () => {
  loading.value = true;
  try {
    // Add the booking details to Firestore
    await addDoc(collection(db, 'bookings'), {
      eventSpaceId: formData.value.eventSpace,
      date: formData.value.date,
      eventType: formData.value.eventType,
      guests: formData.value.guests,
      duration: formData.value.duration,
      time: formData.value.time,
      email: formData.value.email,
      status: 'pending' // Initial status
    });

    await proceedToPayment();
    paymentSuccess.value = true;
  } catch (error) {
    console.error('Booking or payment error:', error);
  } finally {
    loading.value = false;
  }
};

const proceedToPayment = async () => {
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

onMounted(() => {
  fetchEventSpaces();
});

const handleDateClick = (date) => {
  formData.value.date = date;
};

// Utility to format currency
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '#0.00';
  return `#${parseFloat(value).toLocaleString('en-US')}`;
};
</script>

<style scoped>
.booking-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.spinner {
  margin: 1rem 0;
  font-size: 1.2rem;
}

.success-alert {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 1rem;
  border-radius: 4px;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
