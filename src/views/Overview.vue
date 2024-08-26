<template>
  <v-container class="dashboard-container" fluid>
    <!-- Welcome Message -->
    <v-row>
      <v-col>
        <v-card class="welcome-card">
          <v-card-title>
            <v-typography variant="h1">
              {{ adminName ? `Welcome, ${adminName}!` : 'Welcome to the Admin Overview' }}
            </v-typography>
          </v-card-title>
          <v-card-subtitle>
            This is where you can see a summary of the system's performance and key metrics.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Admin Activities Section -->
    <v-row>
      <v-col>
        <v-card class="activities-card">
          <v-card-title>
            <v-typography variant="h2">Recent Activities</v-typography>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item-group>
                <v-list-item v-for="activity in activities" :key="activity.id">
                  <v-list-item-content>
                    <v-list-item-title>{{ activity.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ activity.timestamp }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Additional Sections: Summary, Charts, etc. -->
    <v-row>
      <v-col>
        <v-card class="summary-card">
          <v-card-title>
            <v-typography variant="h2">System Performance Summary</v-typography>
          </v-card-title>
          <v-card-text>
            <!-- Add charts, statistics, and summaries here -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Refs to store admin data and activities
const adminName = ref('');
const activities = ref([]);

// Firebase setup
const auth = getAuth();
const db = getFirestore();

// Function to fetch admin data from Firestore
const fetchAdminData = async (uid) => {
  try {
    const adminDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(adminDoc);

    if (docSnap.exists() && docSnap.data().role === 'admin') {
      adminName.value = docSnap.data().username;
    } else {
      console.log('No such admin data or user is not an admin!');
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }
};

// Function to fetch admin activities
const fetchActivities = async (uid) => {
  try {
    const activitiesQuery = query(collection(db, 'activities'), where('userId', '==', uid));
    const activitiesSnap = await getDocs(activitiesQuery);
    activities.value = activitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
};

// Fetch the current admin and load data when the component is mounted
onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    fetchAdminData(user.uid);
    fetchActivities(user.uid);
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

.activities-card, .summary-card {
  margin-bottom: 2rem;
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
