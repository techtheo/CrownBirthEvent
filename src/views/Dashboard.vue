<template>
  <div class="dashboard-container">
    <!-- Welcome Message -->
    <div class="welcome-message">
      <h1 v-if="userName">Welcome, {{ userName }}!</h1>
      <h1 v-else>Welcome to your Dashboard</h1>
      <p>This is where you can see an overview of your account and upcoming events.</p>
    </div>

    <!-- Upcoming Events Section -->
    <section class="events-section">
      <h2>Upcoming Events</h2>
      <div class="event-cards">
        <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
          <h3>{{ event.title }}</h3>
          <p>{{ event.date }}</p>
          <p>{{ event.description }}</p>
        </div>
      </div>
    </section>

    <!-- Calendar View -->
    <section class="calendar-section">
      <h2>Calendar</h2>
      <div class="calendar">
        <!-- Placeholder for calendar component -->
        <p>Calendar view will be here</p>
      </div>
    </section>

    <!-- Quick Overview of Booked Events -->
    <section class="overview-section">
      <h2>Quick Overview</h2>
      <ul>
        <li v-for="event in bookedEvents" :key="event.id">
          <p>{{ event.title }} - {{ event.date }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Refs to store user data and events
const userName = ref('');
const upcomingEvents = ref([]);
const bookedEvents = ref([]);

// Firebase setup
const auth = getAuth();
const db = getFirestore();

// Function to fetch user data from Firestore
const fetchUserData = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      userName.value = docSnap.data().username;
    } else {
      console.log('No such user data!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Function to fetch events
const fetchEvents = async () => {
  try {
    const upcomingEventsQuery = collection(db, 'events');
    const upcomingSnap = await getDocs(upcomingEventsQuery);
    upcomingEvents.value = upcomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const bookedEventsQuery = collection(db, 'booked_events');
    const bookedSnap = await getDocs(bookedEventsQuery);
    bookedEvents.value = bookedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

// Fetch the current user and load user data and events when the component is mounted
onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    fetchUserData(user.uid);
    fetchEvents();
  } else {
    console.log('No user is signed in.');
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.welcome-message {
  margin-bottom: 2rem;
}

.events-section, .calendar-section, .overview-section {
  margin-bottom: 2rem;
}

.event-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.event-card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  width: 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.calendar {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  min-height: 300px;
}

.overview-section ul {
  list-style: none;
  padding: 0;
}

.overview-section li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.overview-section li:last-child {
  border-bottom: none;
}

/* Fade-in Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dashboard-container {
  animation: fadeIn 0.5s ease-in;
}
</style>
