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
          <h2>{{ event.title }}</h2>
          <p>{{ event.date }}</p>
          <p>{{ event.location }}</p>
          <p>{{ event.description }}</p>
        </div>
      </transition-group>
    </div>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// References
const events = ref([]);
const auth = getAuth();
const db = getFirestore();

// Fetch booked events from Firestore
const fetchBookedEvents = async (uid) => {
  try {
    const eventsCollection = collection(db, 'bookedEvents'); // Collection containing booked events
    const q = query(eventsCollection, where('userId', '==', uid)); // Query to filter by user ID
    const querySnapshot = await getDocs(q);

    events.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching booked events:', error);
  }
};

// Fetch booked events when component is mounted
onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    fetchBookedEvents(user.uid); // Call the function with the user's UID
  }
});
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
