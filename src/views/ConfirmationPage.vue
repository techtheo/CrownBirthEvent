<template>
    <div class="confirmation-container">
      <h1>Booking Confirmed!</h1>
      <p>Your payment was successful. Here are your booking details:</p>
  
      <div class="booking-details">
        <p><strong>Event Space:</strong> {{ bookingDetails.eventSpaceName }}</p>
        <p><strong>Date:</strong> {{ bookingDetails.date }}</p>
        <p><strong>Time:</strong> {{ bookingDetails.time }}</p>
        <p><strong>Event Type:</strong> {{ bookingDetails.eventType }}</p>
        <p><strong>Guests:</strong> {{ bookingDetails.guests }}</p>
        <p><strong>Duration:</strong> {{ bookingDetails.duration }}</p>
        <p><strong>Total Amount:</strong> {{ formatCurrency(bookingDetails.totalAmount) }}</p>
      </div>
  
      <button @click="goToHome" class="home-button">Back to Home</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const db = getFirestore();
  const bookingDetails = ref(null);
  
  const fetchBookingDetails = async () => {
    try {
      const bookingId = route.query.bookingId;
      if (!bookingId) {
        alert('No booking ID found.');
        return;
      }
  
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
  
      if (!bookingDoc.exists()) {
        alert('Booking not found.');
        return;
      }
  
      bookingDetails.value = bookingDoc.data();
  
      // Update the status to 'paid'
      await updateDoc(bookingRef, { status: 'paid' });
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };
  
  const goToHome = () => {
    router.push('/');
  };
  
  onMounted(() => {
    fetchBookingDetails();
  });
  </script>
  
  <style scoped>
  .confirmation-container {
    padding: 20px;
    text-align: center;
  }
  
  .booking-details {
    margin: 20px 0;
    text-align: left;
  }
  
  .home-button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  