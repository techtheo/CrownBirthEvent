<template>
  <div class="booking-container">
    <h1>Book an Event Space</h1>
    <p>Choose an event space and select your date and time.</p>

    <!-- Display available event spaces in card form -->
    <div class="event-cards">
      <v-row>
        <v-col v-for="space in eventSpaces" :key="space.id" cols="12" md="6">
          <v-card
            class="event-card"
            :class="{ selected: formData.eventSpace === space.id }"
            @click="selectEventSpace(space.id)"
          >
            <v-img :src="space.image" class="event-img"></v-img>
            <v-card-title>{{ space.name }}</v-card-title>
            <v-card-subtitle>{{ formatCurrency(space.price) }}</v-card-subtitle>
            <v-card-text>{{ space.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Date picker -->
    <div class="form-group">
      <label for="datetimepicker">Select Date:</label>
      <input
        id="datetimepicker"
        type="text"
        placeholder="Select a date"
        class="flatpickr-input"
      />
    </div>

    <!-- Time picker -->
    <div class="form-group">
      <label for="timepicker">Select Time:</label>
      <input
        id="timepicker"
        type="text"
        placeholder="Select a time"
        class="flatpickr-input"
      />
    </div>

    <!-- Additional form fields -->
    <div class="form-group">
      <label for="eventType">Event Type:</label>
      <input
        id="eventType"
        v-model="formData.eventType"
        type="text"
        placeholder="Enter the event type (e.g., Wedding, Conference)"
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="guests">Number of Guests:</label>
      <input
        id="guests"
        v-model="formData.guests"
        type="number"
        placeholder="Enter the number of guests"
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="duration">Duration:</label>
      <select id="duration" v-model="formData.duration" class="form-control">
        <option value="full-day">Full Day</option>
        <option value="half-day">Half Day</option>
        <option value="hourly">Hourly</option>
      </select>
    </div>

    <div class="form-group">
      <label for="email">Email Address:</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        placeholder="Enter your email address"
        class="form-control"
      />
    </div>

    <!-- Book Event button -->
    <button
      type="button"
      @click="bookEvent"
      :disabled="!isFormValid"
      :class="['book-event-button', { 'disabled': !isFormValid }]"
    >
      Book Event
    </button>

    <!-- Proceed to Payment button (hidden initially) -->
    <button
      v-if="bookingSuccess"
      type="button"
      @click="proceedToPayment"
      class="proceed-button"
    >
      Proceed to Payment
    </button>

    <div v-if="loading" class="spinner">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { getFirestore, collection, getDocs, addDoc, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';

const paystackScriptLoaded = ref(false);

const formData = ref({
  eventSpace: '',
  date: '',
  time: '',
  eventType: '',
  guests: '',
  duration: 'full-day',
  email: ''
});
const eventSpaces = ref([]);
const bookedDates = ref([]);
const bookedTimes = ref([]);
const loading = ref(false);
const bookingSuccess = ref(false);
const selectedEventSpacePrice = ref(0);
const bookingId = ref(''); // Store the booking ID for later use

const db = getFirestore();
const router = useRouter();

const fetchEventSpaces = async () => {
  try {
    const spacesQuery = collection(db, 'event_spaces');
    const querySnapshot = await getDocs(spacesQuery);
    eventSpaces.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const updateDatePicker = () => {
  flatpickr("#datetimepicker", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: bookedDates.value.map(date => new Date(date)),
    onChange: (selectedDates) => {
      formData.value.date = selectedDates[0] ? selectedDates[0].toISOString().split('T')[0] : '';
      fetchBookedDatesAndTimes(); // Refresh booked dates after selecting a date
    }
  });
};

const fetchBookedDatesAndTimes = () => {
  const bookingsQuery = collection(db, 'bookings');
  const q = query(
    bookingsQuery,
    where('eventSpaceId', '==', formData.value.eventSpace),
    where('status', '==', 'pending')
  );

  onSnapshot(q, (querySnapshot) => {
    bookedDates.value = [];
    bookedTimes.value = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      bookedDates.value.push(data.date);
      bookedTimes.value.push(data.time);
    });
    updateDatePicker(); // Refresh the date picker with updated booked dates
  });
};

const bookEvent = async () => {
  if (!isFormValid) {
    alert("Please fill out all required fields.");
    return;
  }

  loading.value = true;
  try {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User is not authenticated.");
      loading.value = false;
      return;
    }

    const userId = user.uid;

    // Check if the event space is already booked at the selected date and time
    const bookingsQuery = collection(db, 'bookings');
    const q = query(
      bookingsQuery,
      where('eventSpaceId', '==', formData.value.eventSpace),
      where('date', '==', formData.value.date),
      where('time', '==', formData.value.time)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Event space is already booked at the selected date and time
      alert("This event space is already booked for the selected date and time. Please choose another slot.");
      loading.value = false;
      return;
    }

    // Proceed with the booking
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      eventSpaceId: formData.value.eventSpace,
      date: formData.value.date,
      time: formData.value.time,
      eventType: formData.value.eventType,
      guests: formData.value.guests,
      duration: formData.value.duration,
      email: formData.value.email,
      userId: userId, // Store user ID
      status: 'pending', // Initial status
      paymentStatus: 'unpaid', // New field for payment status
      paymentReference: '' // New field for payment reference
    });

    // Store the booking ID
    bookingId.value = bookingRef.id;

    // Retrieve the selected event space price
    const eventSpaceDoc = await getDoc(doc(db, 'event_spaces', formData.value.eventSpace));
    selectedEventSpacePrice.value = eventSpaceDoc.data().price;

    bookingSuccess.value = true;
  } catch (error) {
    console.error('Booking error:', error);
  } finally {
    loading.value = false;
  }
};

const updatePaymentStatus = (reference) => {
  return updateDoc(doc(db, 'bookings', bookingId.value), {
    paymentStatus: 'paid',
    paymentReference: reference
  });
};

const proceedToPayment = () => {
  const handler = PaystackPop.setup({
    key: 'pk_test_1fe63b3c0b80d70970e3b941fe5117d5af23aa23', // Replace with your Paystack public key
    email: formData.value.email,
    amount: selectedEventSpacePrice.value * 100, // Amount in kobo
    currency: 'NGN',
    ref: 'CB' + Math.floor(Math.random() * 1000000000 + 1), // Reference should be unique for every transaction
    callback: function (response) {
      // Payment complete! Record the reference in the backend
      updatePaymentStatus(response.reference).then(() => {
        alert('Payment complete! Reference: ' + response.reference);
        router.push('/confirmation'); // Navigate to confirmation page
      }).catch(error => {
        console.error('Error updating payment status:', error);
      });
    },
    onClose: function () {
      alert('Transaction was not completed, window closed.');
    }
  });
  handler.openIframe();
};

onMounted(async () => {
  await fetchEventSpaces();
  await fetchBookedDatesAndTimes();
  await nextTick();

  // Initialize flatpickr for date selection
  updateDatePicker();

  flatpickr("#timepicker", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    minTime: "08:00",
    maxTime: "19:00",
    disable: bookedTimes.value,
    onChange: (selectedDates) => {
      formData.value.time = selectedDates[0] ? selectedDates[0].toTimeString().split(' ')[0] : '';
    }
  });

  // Dynamically load Paystack script
  const script = document.createElement('script');
  script.src = "https://js.paystack.co/v1/inline.js";
  script.async = true;
  script.onload = () => paystackScriptLoaded.value = true; // Set to true when the script loads
  script.onerror = () => {
    console.error('Failed to load Paystack script.');
    paystackScriptLoaded.value = false;
  };
  document.body.appendChild(script);
});

const selectEventSpace = (spaceId) => {
  formData.value.eventSpace = spaceId;
};

const isFormValid = computed(() => {
  return formData.value.eventSpace && formData.value.date && formData.value.time &&
    formData.value.eventType && formData.value.guests && formData.value.email;
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};
</script>

<style scoped>
.booking-container {
  padding: 20px;
}

.event-cards {
  display: flex;
  flex-wrap: wrap;
}

.event-card {
  margin: 10px;
  cursor: pointer;
}

.event-card.selected {
  border: 2px solid #42b983;
}

.flatpickr-input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
}

.form-group {
  margin-bottom: 20px;
}

.book-event-button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

.book-event-button.disabled {
  background-color: gray;
  cursor: not-allowed;
}

.proceed-button {
  padding: 10px 20px;
  background-color: #ff5e57;
  color: white;
  border: none;
  cursor: pointer;
}

.spinner {
  text-align: center;
  font-size: 18px;
}
</style>
