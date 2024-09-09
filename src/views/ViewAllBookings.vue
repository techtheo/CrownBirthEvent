<template>
  <div class="view-all-bookings">
    <h1 class="heading">All Bookings</h1>

    <!-- Display a message if there are no bookings -->
    <v-alert v-if="bookings.length === 0" type="info" dismissible>
      No bookings to display.
    </v-alert>

    <!-- Loop through bookings and display them in cards -->
    <v-row>
      <v-col v-for="booking in bookings" :key="booking.id" cols="12" md="6" lg="4">
        <v-card class="booking-card">
          <v-img
            :src="booking.eventSpaceImage || 'default-image.jpg'"
            class="event-img"
            height="200"
            cover
          ></v-img>
          <v-card-title>{{ booking.eventSpaceName || 'Event Space' }}</v-card-title>
          <v-card-subtitle class="price">
            {{ formatCurrency(booking.amount || booking.eventSpaceAmount) }}
          </v-card-subtitle>
          <v-card-text class="booking-details">
            <p><strong>Date:</strong> {{ booking.date }}</p>
            <p><strong>Time:</strong> {{ booking.time }}</p>
            <p><strong>Event Type:</strong> {{ booking.eventType }}</p>
            <p><strong>Guests:</strong> {{ booking.guests }}</p>
            <p><strong>Duration:</strong> {{ booking.duration }}</p>
            <p><strong>Email:</strong> {{ booking.email }}</p>
            <p><strong>Status:</strong> {{ booking.status }}</p>
            <p><strong>Payment Status:</strong> {{ booking.paymentStatus }}</p>
          </v-card-text>

          <!-- Action bar for approving or rejecting booking -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="openConfirmationDialog('approve', booking)"
              color="green"
              class="approve-button"
            >
              Approve
            </v-btn>
            <v-btn
              @click="openConfirmationDialog('reject', booking)"
              color="red"
              class="reject-button"
            >
              Reject
            </v-btn>
          </v-card-actions>
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

    <!-- Confirmation Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Confirm {{ actionType === 'approve' ? 'Approval' : 'Rejection' }}
        </v-card-title>
        <v-card-text>
          Are you sure you want to {{ actionType === 'approve' ? 'approve' : 'reject' }} this
          booking?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmAction"> Yes </v-btn>
          <v-btn color="red darken-1" text @click="dialog = false"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success or Failed Alert -->
    <v-snackbar v-model="alert" :color="alertColor" timeout="5000" top>
      <v-icon left>{{ alertIcon }}</v-icon>
      {{ alertMessage }}
      <v-btn icon @click="alert = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from 'firebase/firestore'

const bookings = ref([])
const loading = ref(false)
const dialog = ref(false)
const actionType = ref('')
const selectedBooking = ref(null)
const alert = ref(false)
const alertMessage = ref('')
const alertColor = ref('')
const alertIcon = ref('')
const db = getFirestore()

// Fetch all bookings with paid payment status
const fetchBookings = () => {
  loading.value = true

  const bookingsQuery = collection(db, 'bookings')
  const q = query(
    bookingsQuery,
    where('paymentStatus', '==', 'paid'),
    where('status', '==', 'pending')
  )

  onSnapshot(q, (querySnapshot) => {
    bookings.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    loading.value = false
  })
}

// Open the confirmation dialog
const openConfirmationDialog = (type, booking) => {
  actionType.value = type
  selectedBooking.value = booking
  dialog.value = true
}

// Confirm the action (approve or reject)
const confirmAction = () => {
  dialog.value = false
  if (actionType.value === 'approve') {
    approveBooking(selectedBooking.value.id)
  } else if (actionType.value === 'reject') {
    rejectBooking(selectedBooking.value.id)
  }
}

// Approve a booking
const approveBooking = (bookingId) => {
  updateDoc(doc(db, 'bookings', bookingId), { status: 'approved' })
    .then(() => {
      showAlert('Booking approved', 'success', 'mdi-check-circle')
      bookings.value = bookings.value.filter((booking) => booking.id !== bookingId)
    })
    .catch((error) => {
      showAlert('Error approving booking', 'error', 'mdi-alert')
      console.error('Error approving booking:', error)
    })
}

// Reject a booking
const rejectBooking = (bookingId) => {
  updateDoc(doc(db, 'bookings', bookingId), { status: 'rejected' })
    .then(() => {
      showAlert('Booking rejected', 'success', 'mdi-check-circle')
      bookings.value = bookings.value.filter((booking) => booking.id !== bookingId)
    })
    .catch((error) => {
      showAlert('Error rejecting booking', 'error', 'mdi-alert')
      console.error('Error rejecting booking:', error)
    })
}

// Show alert
const showAlert = (message, type, icon) => {
  alertMessage.value = message
  alertColor.value = type === 'success' ? 'green darken-1' : 'red darken-1'
  alertIcon.value = icon
  alert.value = true
}

onMounted(() => {
  fetchBookings()
})

// Format amount as currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount)
}
</script>

<style scoped>
.view-all-bookings {
  padding: 20px;
}
.heading {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #3f51b5;
}
.booking-card {
  position: relative;
}
.event-img {
  border-radius: 8px 8px 0 0;
}
.price {
  color: #43a047;
  font-weight: bold;
}
.approve-button {
  margin-right: 10px;
}
.reject-button {
  margin-left: 10px;
}
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
