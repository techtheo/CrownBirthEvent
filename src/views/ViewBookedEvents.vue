<template>
  <div class="events-container">
    <h1>View Booked Events</h1>
    <p>See all the events you have booked.</p>

    <!-- Display booked events -->
    <div v-if="events.length" class="events-list">
      <transition-group name="fade" tag="div">
        <div
          v-for="event in events"
          :key="event.id"
          class="event-card"
        >
          <img v-if="event.image" :src="event.image" alt="Event Image" class="event-image" />
          <h2>{{ event.eventSpaceName }}</h2>
          <p>Date: {{ event.date }}</p>
          <p>Time: {{ event.time }}</p>
          <p>Number of Guests: {{ event.numberOfGuests }}</p>
          <p>Status: 
            <span :class="statusClass(event.status)">
              {{ event.status }}
            </span>
          </p>
          <p>Payment Status: 
            <span :class="paymentStatusClass(event.paymentStatus)">
              {{ event.paymentStatus }}
            </span>
          </p>

          <!-- Show 'Proceed to Payment' button if payment status is unpaid -->
          <button 
            v-if="event.paymentStatus === 'unpaid' && event.status === 'pending'"
            @click="proceedToPayment(event)"
            class="payment-button"
          >
            Proceed to Payment
          </button>

          <!-- Delete button -->
          <v-icon
            v-if="event.status === 'pending'"
            @click="deleteEvent(event.id)"
            class="delete-icon"
          >
            mdi-delete
          </v-icon>
        </div>
      </transition-group>
    </div>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const events = ref([]);
const auth = getAuth();
const db = getFirestore();
const router = useRouter();
const paystackScriptLoaded = ref(false);

// Fetch the amount to be paid based on the event space ID
const fetchEventPrice = async (eventSpaceId) => {
  try {
    const eventSpacesCollection = collection(db, 'eventSpaces');
    const eventSpaceDoc = doc(eventSpacesCollection, eventSpaceId);
    const eventSpaceSnapshot = await getDocs(eventSpaceDoc);

    if (eventSpaceSnapshot.exists()) {
      return eventSpaceSnapshot.data().price;
    } else {
      console.error('Event space not found');
      return 0;
    }
  } catch (error) {
    console.error('Error fetching event space price:', error);
    return 0;
  }
};

// Fetch booked events from Firestore based on userId
const fetchBookedEvents = async (uid) => {
  try {
    console.log('Fetching booked events for user:', uid); // Debug log
    const eventsCollection = collection(db, 'bookings');
    const q = query(eventsCollection, where('userId', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      events.value = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const eventData = doc.data();
        const price = await fetchEventPrice(eventData.eventSpaceId);
        return {
          id: doc.id,
          ...eventData,
          price // Add the price to the event data
        };
      }));
      console.log('Fetched events:', events.value); // Debug log
    } else {
      console.log('No events found for this user'); // Debug log
    }
  } catch (error) {
    console.error('Error fetching booked events:', error);
  }
};

// Delete an event from Firestore
const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'bookings', eventId));
    events.value = events.value.filter(event => event.id !== eventId);
    console.log('Event deleted:', eventId); // Debug log
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

// Proceed to payment for a specific event
const proceedToPayment = (event) => {
  if (!paystackScriptLoaded.value) {
    console.error('Paystack script is not loaded.');
    return;
  }

  const handler = PaystackPop.setup({
    key: 'pk_test_1fe63b3c0b80d70970e3b941fe5117d5af23aa23', // Replace with your Paystack public key
    email: event.email,
    amount: event.price * 100, // Amount in kobo
    currency: 'NGN',
    ref: 'CB' + Math.floor(Math.random() * 1000000000 + 1), // Reference should be unique for every transaction
    callback: function (response) {
      // Payment complete! Record the reference in the backend
      updatePaymentStatus(event.id, response.reference).then(() => {
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

// Update payment status in Firestore
const updatePaymentStatus = async (eventId, reference) => {
  try {
    await updateDoc(doc(db, 'bookings', eventId), {
      paymentStatus: 'paid',
      paymentReference: reference
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
  }
};

// Fetch booked events when component is mounted
onMounted(() => {
  const user = auth.currentUser;
  console.log('Current user:', user); // Debug log
  if (user) {
    fetchBookedEvents(user.uid);
  } else {
    console.log('User not authenticated'); // Debug log
  }

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

// Return a class based on the event status for styling
const statusClass = (status) => {
  switch(status) {
    case 'confirmed':
      return 'status-confirmed';
    case 'pending':
      return 'status-pending';
    case 'failed':
      return 'status-failed';
    case 'successful':
      return 'status-successful';
    default:
      return '';
  }
};

// Return a class based on the payment status for styling
const paymentStatusClass = (paymentStatus) => {
  switch(paymentStatus) {
    case 'paid':
      return 'payment-status-paid';
    case 'unpaid':
      return 'payment-status-unpaid';
    default:
      return '';
  }
};
</script>


<style scoped>
.events-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.event-card h2 {
  margin: 0 0 0.5rem 0;
}

.event-card p {
  margin: 0.5rem 0;
}

.event-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.payment-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.payment-button:hover {
  background-color: #0056b3;
}

.delete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: red;
}

.status-confirmed {
  color: green;
}

.status-pending {
  color: orange;
}

.status-failed {
  color: red;
}

.status-successful {
  color: blue;
}

.payment-status-paid {
  color: green;
}

.payment-status-unpaid {
  color: orange;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
