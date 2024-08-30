<template>
  <div class="view-booked-events">
    <h1 class="heading">Your Booked Events</h1>

    <!-- Display a message if there are no booked events -->
    <v-alert v-if="bookedEvents.length === 0" type="info" dismissible>
      You have no booked events at the moment.
    </v-alert>

    <!-- Loop through booked events and display them in cards -->
    <v-row>
      <v-col
        v-for="event in bookedEvents"
        :key="event.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="booked-event-card">
          <v-img
            :src="event.eventSpaceImage || 'default-image.jpg'"
            class="event-img"
            height="200"
            cover
          ></v-img>
          <v-card-title>{{ event.eventSpaceName || 'Event Space' }}</v-card-title>
          <v-card-subtitle class="price">
            {{ formatCurrency(event.amount || event.eventSpaceAmount) }}
          </v-card-subtitle>
          <v-card-text class="event-details">
            <p><strong>Date:</strong> {{ event.date }}</p>
            <p><strong>Time:</strong> {{ event.time }}</p>
            <p><strong>Event Type:</strong> {{ event.eventType }}</p>
            <p><strong>Guests:</strong> {{ event.guests }}</p>
            <p><strong>Duration:</strong> {{ event.duration }}</p>
            <p><strong>Email:</strong> {{ event.email }}</p>
            <p><strong>Status:</strong> {{ event.status }}</p>
            <p><strong>Payment Status:</strong> {{ event.paymentStatus }}</p>
          </v-card-text>

          <!-- Display Proceed to Payment button if payment status is unpaid -->
          <v-btn
            v-if="event.paymentStatus === 'unpaid'"
            @click="proceedToPayment(event)"
            class="proceed-button"
            color="primary"
            block
          >
            Proceed to Payment
          </v-btn>

          <!-- Display Print Receipt button if payment status is paid -->
          <v-btn
            v-if="event.paymentStatus === 'paid'"
            @click="printReceipt(event)"
            class="print-button"
            color="secondary"
            block
          >
            Print Receipt
          </v-btn>

          <!-- Delete button positioned above the Print Receipt button -->
          <v-icon
            @click="confirmDelete(event.id)"
            class="delete-icon"
            color="red"
            large
          >
            mdi-delete
          </v-icon>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading spinner -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="spinner"
    ></v-progress-circular>

    <!-- Confirmation dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this booking?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteBooking" color="red" text>Yes</v-btn>
          <v-btn @click="showConfirmDialog = false" color="grey" text>No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const bookedEvents = ref([]);
const loading = ref(false);
const paystackScriptLoaded = ref(false);
const db = getFirestore();
const showConfirmDialog = ref(false);
let bookingToDelete = ref(null);

// Fetch booked events by current authenticated user
const fetchBookedEvents = () => {
  loading.value = true;
  const user = getAuth().currentUser;
  if (!user) {
    console.error('User is not authenticated.');
    loading.value = false;
    return;
  }

  const userId = user.uid;

  // Query to fetch booked events by the current user
  const bookingsQuery = collection(db, 'bookings');
  const q = query(bookingsQuery, where('userId', '==', userId));

  // Fetch booked events in real-time
  onSnapshot(q, (querySnapshot) => {
    bookedEvents.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    loading.value = false;
  });
};

// Handle payment process using Paystack
const proceedToPayment = (event) => {
  if (!paystackScriptLoaded.value) {
    alert('Payment gateway is not loaded. Please try again later.');
    return;
  }

  const handler = PaystackPop.setup({
    key: 'pk_test_1fe63b3c0b80d70970e3b941fe5117d5af23aa23', // Replace with your Paystack public key
    email: event.email,
    amount: event.amount * 100, // Amount in kobo
    currency: 'NGN',
    ref: 'CB' + Math.floor(Math.random() * 1000000000 + 1), // Unique reference for every transaction
    callback: function (response) {
      // Update the payment status in the Firestore database
      updatePaymentStatus(event.id, response.reference)
        .then(() => {
          alert('Payment complete! Reference: ' + response.reference);
          printReceipt(event); // Automatically print receipt after successful payment
        })
        .catch((error) => {
          console.error('Error updating payment status:', error);
        });
    },
    onClose: function () {
      alert('Transaction was not completed, window closed.');
    },
  });
  handler.openIframe();
};

// Update payment status in Firestore
const updatePaymentStatus = (bookingId, reference) => {
  return updateDoc(doc(db, 'bookings', bookingId), {
    paymentStatus: 'paid',
    paymentReference: reference,
  });
};

// Print receipt for the event
const printReceipt = (event) => {
  const receiptWindow = window.open('', '_blank');
  receiptWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          .receipt-details { margin-top: 20px; }
          p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h1>Receipt for ${event.eventSpaceName || 'Event Space'}</h1>
        <div class="receipt-details">
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Event Type:</strong> ${event.eventType}</p>
          <p><strong>Guests:</strong> ${event.guests}</p>
          <p><strong>Duration:</strong> ${event.duration}</p>
          <p><strong>Email:</strong> ${event.email}</p>
          <p><strong>Amount Paid:</strong> ${formatCurrency(event.amount)}</p>
          <p><strong>Payment Reference:</strong> ${event.paymentReference}</p>
        </div>
      </body>
    </html>
  `);
  receiptWindow.document.close();
  receiptWindow.print();
};

// Confirm deletion of booking
const confirmDelete = (bookingId) => {
  bookingToDelete.value = bookingId;
  showConfirmDialog.value = true;
};

// Delete booking from Firestore
const deleteBooking = () => {
  if (bookingToDelete.value) {
    deleteDoc(doc(db, 'bookings', bookingToDelete.value))
      .then(() => {
        alert('Booking deleted successfully.');
        showConfirmDialog.value = false;
        bookingToDelete.value = null;
      })
      .catch((error) => {
        console.error('Error deleting booking:', error);
      });
  }
};

onMounted(() => {
  fetchBookedEvents();

  // Dynamically load Paystack script
  const script = document.createElement('script');
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;
  script.onload = () => (paystackScriptLoaded.value = true); // Set to true when the script loads
  script.onerror = () => {
    console.error('Failed to load Paystack script.');
    paystackScriptLoaded.value = false;
  };
  document.body.appendChild(script);
});

// Format amount as currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount || 0); // Ensure to handle undefined or null amounts
};
</script>

<style scoped>
.view-booked-events {
  padding: 20px;
}

.heading {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.booked-event-card {
  margin: 10px;
  position: relative; /* For positioning the delete icon */
  transition: transform 0.3s;
}

.booked-event-card:hover {
  transform: scale(1.02);
}

.event-img {
  height: 200px;
}

.proceed-button, .print-button {
  margin-top: 10px;
  color: white;
  font-weight: bold;
}

.price {
  font-size: 16px;
  color: #4caf50;
}

.event-details p {
  margin: 5px 0;
}

.spinner {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Delete icon style */
.delete-icon {
  position: absolute;
  bottom: 60px; /* Position just above the Print Receipt button */
  right: 10px;
  cursor: pointer;
  transition: color 0.3s;
}

.delete-icon:hover {
  color: #d32f2f;
}

/* Confirmation dialog style */
.v-dialog {
  transition: all 0.3s ease;
}

.v-dialog-enter-active, .v-dialog-leave-active {
  transition: opacity 0.3s ease;
}

.v-dialog-enter, .v-dialog-leave-to {
  opacity: 0;
}
</style>
