<template>
  <v-container class="dashboard-container" fluid>
    <!-- Welcome Message -->
    <v-row>
      <v-col>
        <v-card class="welcome-card">
          <v-card-title>
            <v-typography variant="h1">
              {{ userName ? `Welcome, ${userName}!` : 'Welcome to your Dashboard' }}
            </v-typography>
          </v-card-title>
          <v-card-subtitle>
            This is where you can see an overview of your account and upcoming events.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upcoming Events Section -->
    <v-row>
      <v-col>
        <v-card class="events-card">
          <v-card-title>
            <v-typography variant="h2">Upcoming Events</v-typography>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="event in upcomingEvents" :key="event.id" cols="12" sm="6" md="4">
                <v-card class="event-card" raised>
                  <v-card-title>{{ event.title }}</v-card-title>
                  <v-card-subtitle>{{ event.date }}</v-card-subtitle>
                  <v-card-text>{{ event.description }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Calendar View -->
    <v-row>
      <v-col>
        <v-card class="calendar-card">
          <v-card-title>
            <v-typography variant="h2">Calendar</v-typography>
          </v-card-title>
          <v-card-text>
            <!-- Placeholder for calendar component -->
            <p>Calendar view will be here</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Overview of Booked Events -->
    <v-row>
      <v-col>
        <v-card class="overview-card">
          <v-card-title>
            <v-typography variant="h2">Quick Overview</v-typography>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item-group>
                <v-list-item v-for="event in bookedEvents" :key="event.id">
                  <v-list-item-content>
                    <v-list-item-title>{{ event.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ event.date }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

.welcome-card {
  margin-bottom: 2rem;
  text-align: center;
}

.welcome-card .v-card-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.events-card, .calendar-card, .overview-card {
  margin-bottom: 2rem;
}

.event-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.calendar-card, .overview-card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.v-list-item {
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: #f1f1f1;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dashboard-container {
  animation: fadeIn 0.5s ease-in;
}
</style>
