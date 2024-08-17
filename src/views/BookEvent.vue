<template>
  <div class="booking-container">
    <h1>Book an Event</h1>
    <p>Book your events through this page.</p>
    
    <form @submit.prevent="submitBooking">
      <div class="form-group">
        <label for="venue">Venue:</label>
        <select v-model="formData.venue" id="venue">
          <option v-for="venue in venues" :key="venue.id" :value="venue.id">
            {{ venue.name }} - ${{ venue.price }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="date">Select Date:</label>
        <vue-cal 
          :events="availableDates"
          v-model="formData.date"
          @dayClick="handleDateClick" />
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
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import VueCal from 'vue-cal'; // Import VueCal
import 'vue-cal/dist/vuecal.css'; // Import VueCal styles

// Register VueCal component
const components = {
  VueCal
};

const formData = ref({
  venue: '',
  date: '',
  eventType: '',
  guests: '',
  duration: 'full-day',
  time: '',
  email: ''
});
const venues = ref([]);
const availableDates = ref([]);
const loading = ref(false);
const paymentSuccess = ref(false);

const db = getFirestore();

const fetchData = async () => {
  try {
    const venuesQuery = query(collection(db, 'venues'));
    const querySnapshot = await getDocs(venuesQuery);
    venues.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const datesQuery = query(collection(db, 'events'), where('status', '==', 'available'));
    const datesSnapshot = await getDocs(datesQuery);
    availableDates.value = datesSnapshot.docs.map(doc => ({ date: doc.data().date }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const submitBooking = async () => {
  loading.value = true;
  try {
    await proceedToPayment();
    paymentSuccess.value = true;
  } catch (error) {
    console.error('Payment error:', error);
  } finally {
    loading.value = false;
  }
};

const proceedToPayment = async () => {
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

onMounted(() => {
  fetchData();
});

const handleDateClick = (date) => {
  formData.value.date = date;
};
</script>

<style scoped>
/* Add your styles here */
</style>


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
