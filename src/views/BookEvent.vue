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

    <div class="form-group">
      <label for="duration">Duration:</label>
      <select
        id="duration"
        v-model="formData.duration"
        class="form-control"
        @change="updateTimePicker"
      >
        <option value="full-day">Full Day (8:00 AM to 7:00 PM)</option>
        <option value="half-day-morning">Half Day (Morning - 8:00 AM to 2:30 PM)</option>
        <option value="half-day-afternoon">Half Day (Afternoon - 2:30 PM to 7:00 PM)</option>
      </select>
    </div>

    <!-- Date picker -->
    <div class="form-group">
      <label for="datetimepicker">Select Date:</label>
      <input id="datetimepicker" type="text" placeholder="Select a date" class="form-control" />
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
      :class="['book-event-button', { disabled: !isFormValid }]"
    >
      Book Event
    </button>

    <!-- Proceed to Payment button (hidden initially) -->
    <button v-if="bookingSuccess" type="button" @click="proceedToPayment" class="proceed-button">
      Proceed to Payment
    </button>

    <div v-if="loading" class="spinner">Loading...</div>

    <!-- Payment Modal -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card class="receipt-card">
        <v-card-title class="headline receipt-title">Payment Receipt</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="receipt-content">
          <div class="receipt-item">
            <strong>Event Space:</strong> {{ bookingDetails.eventSpaceName }}
          </div>
          <div class="receipt-item"><strong>Date:</strong> {{ bookingDetails.date }}</div>
          <div class="receipt-item"><strong>Time:</strong> {{ bookingDetails.time }}</div>
          <div class="receipt-item">
            <strong>Event Type:</strong> {{ bookingDetails.eventType }}
          </div>
          <div class="receipt-item">
            <strong>Number of Guests:</strong> {{ bookingDetails.guests }}
          </div>
          <div class="receipt-item"><strong>Duration:</strong> {{ bookingDetails.duration }}</div>
          <div class="receipt-item">
            <strong>Amount Paid:</strong> {{ formatCurrency(bookingDetails.amount) }}
          </div>
          <div class="receipt-item">
            <strong>Payment Reference:</strong> {{ bookingDetails.paymentReference }}
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="receipt-actions">
          <v-btn color="primary" @click="printReceipt" class="receipt-button">Print Receipt</v-btn>
          <v-btn @click="reloadPage" class="receipt-button">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

import { getAuth } from 'firebase/auth'

const paystackScriptLoaded = ref(false)

const formData = ref({
  eventSpace: '',
  date: '',
  time: '',
  eventType: '',
  guests: '',
  duration: 'full-day',
  email: ''
})
const eventSpaces = ref([])
const bookedDates = ref([])
const bookedTimes = ref([])
const loading = ref(false)
const bookingSuccess = ref(false)
const selectedEventSpacePrice = ref(0)
const bookingId = ref('') // Store the booking ID for later use

const showModal = ref(false) // Control the visibility of the modal
const bookingDetails = ref({}) // Store booking details to display in the modal

const db = getFirestore()

const fetchEventSpaces = async () => {
  try {
    const spacesQuery = collection(db, 'event_spaces')
    const querySnapshot = await getDocs(spacesQuery)
    eventSpaces.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const updateDatePicker = () => {
  flatpickr('#datetimepicker', {
  dateFormat: 'Y-m-d',
  minDate: 'today',
  disable: bookedDates.value.map((date) => new Date(date)),
  onChange: (selectedDates) => {
    // Convert selected date to the correct format before saving
    formData.value.date = selectedDates[0] 
      ? new Date(selectedDates[0].getTime() - selectedDates[0].getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0] 
      : ''
    fetchBookedDatesAndTimes() // Refresh booked dates after selecting a date
  }
})
}

const fetchBookedDatesAndTimes = () => {
  const bookingsQuery = collection(db, 'bookings')
  const q = query(
    bookingsQuery,
    where('eventSpaceId', '==', formData.value.eventSpace),
    where('status', '==', 'pending')
  )

  onSnapshot(q, (querySnapshot) => {
    bookedDates.value = []
    bookedTimes.value = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      bookedDates.value.push(data.date)
      bookedTimes.value.push(data.time)
    })
    updateDatePicker() // Refresh the date picker with updated booked dates
  })
}

const bookEvent = async () => {
  if (!isFormValid.value) {
    alert('Please fill out all required fields.')
    return
  }

  loading.value = true
  try {
    const user = getAuth().currentUser
    if (!user) {
      console.error('User is not authenticated.')
      loading.value = false
      return
    }

    const userId = user.uid

    // Check if the event space is already booked at the selected date and time
    const bookingsQuery = collection(db, 'bookings')
    const q = query(
      bookingsQuery,
      where('eventSpaceId', '==', formData.value.eventSpace),
      where('date', '==', formData.value.date),
      where('time', '==', getTimeForDuration(formData.value.duration)) // Use time based on duration
    )

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Event space is already booked at the selected date and time
      alert(
        'This event space is already booked for the selected date and time. Please choose another slot.'
      )
      loading.value = false
      return
    }

    // Retrieve the selected event space details
    const selectedSpace = eventSpaces.value.find((space) => space.id === formData.value.eventSpace)
    const { name, image, price } = selectedSpace

    // Proceed with the booking
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      eventSpaceId: formData.value.eventSpace,
      eventSpaceName: name, // Save the event space name
      eventSpaceImage: image, // Save the event space image URL
      amount: price, // Save the amount
      date: formData.value.date,
      time: getTimeForDuration(formData.value.duration),
      eventType: formData.value.eventType,
      guests: formData.value.guests,
      duration: formData.value.duration,
      email: formData.value.email,
      userId: userId, // Store user ID
      status: 'pending', // Initial status
      paymentStatus: 'unpaid', // New field for payment status
      paymentReference: '' // New field for payment reference
    })

    // Store the booking ID
    bookingId.value = bookingRef.id

    // Store the selected event space price for payment
    selectedEventSpacePrice.value = price

    alert('Your booking was successful. Please proceed to payment.')
    resetFormData()
    bookingSuccess.value = true
  } catch (error) {
    console.error('Error booking event:', error)
  } finally {
    loading.value = false
  }
}

const resetFormData = () => {
  formData.value.eventSpace = ''
  formData.value.date = ''
  formData.value.time = ''
  formData.value.eventType = ''
  formData.value.guests = ''
  formData.value.duration = 'full-day'
  // Do not reset the email field so that it remains for the payment step
  // formData.value.email = '';
}

const getTimeForDuration = (duration) => {
  switch (duration) {
    case 'full-day':
      return '08:00 AM - 07:00 PM'
    case 'half-day-morning':
      return '08:00 AM - 02:30 PM'
    case 'half-day-afternoon':
      return '02:30 PM - 07:00 PM'
    default:
      return ''
  }
}

const updatePaymentStatus = (reference) => {
  return updateDoc(doc(db, 'bookings', bookingId.value), {
    paymentStatus: 'paid',
    paymentReference: reference
  })
}

const proceedToPayment = () => {
  if (!formData.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    alert('Please enter a valid email address.')
    return
  }
  // eslint-disable-next-line no-undef
  const handler = PaystackPop.setup({
    key: 'pk_test_1fe63b3c0b80d70970e3b941fe5117d5af23aa23', // Replace with your Paystack public key
    email: formData.value.email,
    amount: selectedEventSpacePrice.value * 100, // Amount in kobo
    currency: 'NGN',
    ref: 'CB' + Math.floor(Math.random() * 1000000000 + 1), // Reference should be unique for every transaction
    callback: function (response) {
      // Payment complete! Record the reference in the backend
      updatePaymentStatus(response.reference)
        .then(() => {
          // Store the booking details for display in the modal
          bookingDetails.value = {
            ...formData.value,
            eventSpaceName: eventSpaces.value.find(
              (space) => space.id === formData.value.eventSpace
            ).name,
            amount: selectedEventSpacePrice.value,
            paymentReference: response.reference
          }
          // Clear the email field after successful payment
          formData.value.email = ''
          showModal.value = true // Show the modal with payment details
        })
        .catch((error) => {
          console.error('Error updating payment status:', error)
        })
    },
    onClose: function () {
      alert('Transaction was not completed, window closed.')
    }
  })
  handler.openIframe()
}

onMounted(async () => {
  await fetchEventSpaces()
  await fetchBookedDatesAndTimes()
  await nextTick()

  // Dynamically load Paystack script
  const script = document.createElement('script')
  script.src = 'https://js.paystack.co/v2/inline.js'
  script.async = true
  script.onload = () => (paystackScriptLoaded.value = true) // Set to true when the script loads
  script.onerror = () => {
    console.error('Failed to load Paystack script.')
    paystackScriptLoaded.value = false
  }
  document.body.appendChild(script)
})

const selectEventSpace = (spaceId) => {
  formData.value.eventSpace = spaceId
}

const isFormValid = computed(() => {
  return (
    formData.value.eventSpace &&
    formData.value.date &&
    // formData.value.time &&
    formData.value.eventType &&
    formData.value.guests &&
    formData.value.email
  )
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
}

// Add the reloadPage function within your <script setup> section
const reloadPage = () => {
  showModal.value = false // Close the modal

  // Optionally, reload the page if you want to reset the form or booking process
  // location.reload();
}

const printReceipt = () => {
  const receiptContent = `
    <html>
      <head>
        <title>Print Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
          }
          .receipt-item {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Payment Receipt</h1>
        <div class="receipt-item"><strong>Event Space:</strong> ${bookingDetails.value.eventSpaceName}</div>
        <div class="receipt-item"><strong>Date:</strong> ${bookingDetails.value.date}</div>
        <div class="receipt-item"><strong>Time:</strong> ${bookingDetails.value.time}</div>
        <div class="receipt-item"><strong>Event Type:</strong> ${bookingDetails.value.eventType}</div>
        <div class="receipt-item"><strong>Number of Guests:</strong> ${bookingDetails.value.guests}</div>
        <div class="receipt-item"><strong>Duration:</strong> ${bookingDetails.value.duration}</div>
        <div class="receipt-item"><strong>Amount Paid:</strong> ${formatCurrency(bookingDetails.value.amount)}</div>
        <div class="receipt-item"><strong>Payment Reference:</strong> ${bookingDetails.value.paymentReference}</div>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank', 'width=800,height=600')
  printWindow.document.open()
  printWindow.document.write(receiptContent)
  printWindow.document.close()

  // Add a delay before printing and closing the window
  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()

    setTimeout(() => {
      printWindow.close()
    }, 1000) // 1 second delay to ensure printing completes
  }
}
</script>

<style scoped>
.booking-container {
  padding: 20px;
  background-color: #ffff;
}

.event-cards {
  display: flex;
  flex-wrap: wrap;
}

.event-card {
  margin: 10px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.event-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.event-card.selected {
  border: 2px solid #42b983;
}

.flatpickr-input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  /* border: 1px solid black; */
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
  transition: background-color 0.3s ease;
}

.book-event-button:hover {
  background-color: #36a372;
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
  transition: background-color 0.3s ease;
}

.proceed-button:hover {
  background-color: #e44e4e;
}

.spinner {
  text-align: center;
  font-size: 18px;
}

.receipt-card {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.receipt-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.receipt-content {
  font-size: 16px;
  color: #34495e;
}

.receipt-item {
  margin-bottom: 10px;
}

.receipt-actions {
  justify-content: center;
}

.receipt-button {
  padding: 10px 10px;
  font-size: 16px;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  transition: background-color 0.3s ease;
}

.receipt-button:hover {
  background-color: #36a372;
}

.v-divider {
  margin: 20px 0;
}
</style>
