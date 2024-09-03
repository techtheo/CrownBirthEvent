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
                  <v-card-subtitle>{{ formatDate(event.date) }}</v-card-subtitle>
                  <v-card-text>
                    {{ event.description }}
                    <br />
                    <strong>Type:</strong> {{ event.type || 'N/A' }}
                  </v-card-text>
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
            <v-typography variant="h2">Your Bookings Calendar</v-typography>
          </v-card-title>
          <v-card-text>
            <v-sheet class="calendar-sheet">
              <v-row class="calendar-row" align="center">
                <v-col
                  v-for="date in bookedDates"
                  :key="date"
                  cols="3"
                  class="calendar-date"
                  :class="isBooked(date) ? 'booked' : ''"
                >
                  {{ formatDate(date, 'short') }}
                </v-col>
              </v-row>
            </v-sheet>
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
                <v-list-item
                  v-for="event in bookedEvents"
                  :key="event.id"
                  class="status-list-item"
                  :class="statusClass(event.status)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ event.title }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Your event on {{ formatDate(event.date) }} is 
                      <strong>{{ event.status.toUpperCase() }}</strong> - 
                      <span ref="statusTextRef" class="status-text"></span>
                    </v-list-item-subtitle>
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
import { ref, onMounted, nextTick } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Typed from 'typed.js';

// Refs to store user data and events
const userName = ref('');
const upcomingEvents = ref([]);
const bookedEvents = ref([]);
const bookedDates = ref([]);

// Firebase setup
const auth = getAuth();
const db = getFirestore();

// Function to format dates
const formatDate = (date, format = 'long') => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, format === 'short' ? { month: 'short', day: 'numeric' } : options);
};

// Function to determine class based on event status
const statusClass = (status) => {
  return {
    'status-approved': status === 'approved',
    'status-rejected': status === 'rejected',
    'status-pending': status === 'pending',
  };
};

// Function to provide descriptive text based on status
const statusText = (status) => {
  if (status === 'approved') {
    return [
      'Congratulations! Your event has been approved.',
      'We are excited to host you.',
      'Looking forward to seeing you at the event!',
    ];
  } else if (status === 'rejected') {
    return [
      'Unfortunately, your event request was rejected.',
      'Please contact support for more information.',
      'We are sorry for the inconvenience caused.',
    ];
  } else if (status === 'pending') {
    return [
      'Your event request is currently pending.',
      'We will notify you once it is reviewed.',
      'Thank you for your patience!',
    ];
  }
  return [''];
};

// Function to check if a date is booked
const isBooked = (date) => {
  return bookedDates.value.includes(date);
};

// Function to fetch user data and events
const fetchData = async (uid) => {
  try {
    // Fetch user data
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      userName.value = userData.username;
    }

    // Fetch booked events and calendar dates
    const eventsQuery = query(collection(db, 'bookings'), where('userId', '==', uid));
    const eventsSnapshot = await getDocs(eventsQuery);

    if (!eventsSnapshot.empty) {
      bookedEvents.value = eventsSnapshot.docs.map(doc => doc.data());
      bookedDates.value = bookedEvents.value.map(event => event.date);
    }

    // Fetch upcoming events with event type
    const upcomingQuery = query(collection(db, 'bookings'), where('userId', '==', uid));
    const upcomingSnapshot = await getDocs(upcomingQuery);

    if (!upcomingSnapshot.empty) {
      upcomingEvents.value = upcomingSnapshot.docs.map(doc => {
        const eventData = doc.data();
        return {
          ...eventData,
          type: eventData.eventType || 'N/A', // Corrected field name to fetch event type
        };
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Function to initialize Typed.js for dynamic status text
const initTyped = (statusText, refElement) => {
  const options = {
    strings: statusText,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 2000,
    loop: true,
  };

  new Typed(refElement, options);
};

// Fetch the current user and load user data and events when the component is mounted
onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    await fetchData(user.uid);
    await nextTick();

    // Initialize Typed.js for each event's status text
    bookedEvents.value.forEach((event, index) => {
      const statusTextContent = statusText(event.status);
      const refElement = document.querySelectorAll('.status-text')[index];
      initTyped(statusTextContent, refElement);
    });
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

.calendar-sheet {
  padding: 1rem;
}

.calendar-date {
  text-align: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0.25rem;
}

.calendar-date.booked {
  background-color: #4caf50;
  color: white;
}

.status-list-item {
  margin-bottom: 1rem;
}

.status-approved {
  border-left: 4px solid #4caf50;
  background-color: #e8f5e9;
}

.status-rejected {
  border-left: 4px solid #f44336;
  background-color: #ffebee;
}

.status-pending {
  border-left: 4px solid #ff9800;
  background-color: #fff3e0;
}

.status-text {
  display: inline-block;
  margin-left: 10px;
  font-style: italic;
}
</style>
