<template>
  <v-container class="profile-container" fluid>
    <v-row>
      <v-col cols="12">
        <v-typography variant="h1" class="mb-4">User Profile</v-typography>
        <v-typography variant="body1" class="mb-6">Edit your user details here.</v-typography>
      </v-col>
    </v-row>

    <!-- Display user details -->
    <v-row v-if="user">
      <!-- Update Profile Form -->
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Update Profile</v-card-title>
          <v-form @submit.prevent="reauthenticateAndUpdateProfile">
            <v-text-field v-model="user.username" label="Username" outlined />
            <v-text-field v-model="user.email" label="Email" type="email" outlined />
            <v-text-field
              v-model="confirmCurrentPassword"
              :type="showPassword.confirmCurrent ? 'text' : 'password'"
              label="Confirm Current Password"
              outlined
            >
              <template v-slot:append>
                <v-icon @click="togglePasswordVisibility('confirmCurrent')">
                  {{ showPassword.confirmCurrent ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
            <v-btn type="submit" :disabled="loading || !isProfileValid" color="primary" class="mt-4">
              <v-spinner v-if="loading && !passwordUpdating" size="24" color="white" />
              Update Profile
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- Change Password Form -->
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Change Password</v-card-title>
          <v-form @submit.prevent="changePassword">
            <v-text-field
              v-model="currentPassword"
              :type="showPassword.current ? 'text' : 'password'"
              label="Current Password"
              outlined
              @input="validatePasswordChange"
            >
              <template v-slot:append>
                <v-icon @click="togglePasswordVisibility('current')">
                  {{ showPassword.current ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="newPassword"
              :type="showPassword.new ? 'text' : 'password'"
              label="New Password"
              outlined
              @input="validatePasswordChange"
            >
              <template v-slot:append>
                <v-icon @click="togglePasswordVisibility('new')">
                  {{ showPassword.new ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="confirmPassword"
              :type="showPassword.confirm ? 'text' : 'password'"
              label="Confirm New Password"
              outlined
              @input="validatePasswordChange"
            >
              <template v-slot:append>
                <v-icon @click="togglePasswordVisibility('confirm')">
                  {{ showPassword.confirm ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
            <small class="password-hint">Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.</small>
            <v-btn type="submit" color="primary" class="mt-4">
              <v-spinner v-if="loading && passwordUpdating" size="24" color="white" />
              Change Password
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row>
      <!-- Success/Failure Alert -->
      <v-col cols="12">
        <v-alert v-if="successMessage" type="success" class="mt-4">
          {{ successMessage }}
        </v-alert>
        <v-alert v-if="errorMessage" type="error" class="mt-4">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const user = ref({
  username: '',
  email: ''
});
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const confirmCurrentPassword = ref(''); // For confirming current password during profile update
const auth = getAuth();
const db = getFirestore();
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const passwordUpdating = ref(false);
const initialUser = ref({ username: '', email: '' }); // Store initial user data
const showPassword = ref({
  current: false,
  new: false,
  confirm: false,
  confirmCurrent: false
}); // Control password visibility

// Add isPasswordDirty to track changes in password fields
const isPasswordDirty = ref(false);

const isProfileValid = computed(() => user.value.username && user.value.email && confirmCurrentPassword.value);

// New function to validate password change and update isPasswordDirty
const validatePasswordChange = () => {
  if (currentPassword.value || newPassword.value || confirmPassword.value) {
    isPasswordDirty.value = true;
  } else {
    isPasswordDirty.value = false;
  }
};

const fetchUserData = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      user.value = docSnap.data();
      initialUser.value = { ...docSnap.data() }; // Save initial data
    } else {
      console.log('No such user data!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const reauthenticateAndUpdateProfile = async () => {
  loading.value = true;
  
  // Check if user is authenticated
  if (!auth.currentUser) {
    errorMessage.value = 'User is not authenticated';
    loading.value = false;
    return;
  }

  // Check if the updated profile is the same as the current profile
  if (user.value.username === initialUser.value.username && user.value.email === initialUser.value.email) {
    errorMessage.value = 'No changes detected. Please update your profile details.';
    loading.value = false;
    return;
  }

  try {
    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      confirmCurrentPassword.value
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Proceed with updating the user profile
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDoc, {
      username: user.value.username,
      email: user.value.email
    });

    successMessage.value = 'Profile updated successfully';
  } catch (error) {
    console.error('Error updating profile:', error);
    errorMessage.value = 'Error updating profile: ' + error.message;
  } finally {
    loading.value = false;
    setTimeout(() => successMessage.value = '', 3000);
    setTimeout(() => errorMessage.value = '', 3000);
  }
};

const changePassword = async () => {
  passwordUpdating.value = true;

  // Check if user is authenticated
  if (!auth.currentUser) {
    errorMessage.value = 'User is not authenticated';
    passwordUpdating.value = false;
    return;
  }

  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all password fields.';
    passwordUpdating.value = false;
    return;
  }

  // Proceed with password change
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "New passwords do not match";
    passwordUpdating.value = false;
    return;
  }

  if (!validatePassword(newPassword.value)) {
    errorMessage.value = "New password does not meet the criteria.";
    passwordUpdating.value = false;
    return;
  }

  try {
    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword.value
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update the password
    await updatePassword(auth.currentUser, newPassword.value);

    // Fetch updated user data from the database
    await fetchUserData(auth.currentUser.uid);

    successMessage.value = 'Password updated successfully';

    // Reload the page to reflect the changes
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Adding a slight delay before reload for smoother experience
  } catch (error) {
    console.error('Error changing password:', error);
    errorMessage.value = 'Error changing password: ' + error.message;
  } finally {
    passwordUpdating.value = false;
    setTimeout(() => successMessage.value = '', 3000);
    setTimeout(() => errorMessage.value = '', 3000);
  }
};

const togglePasswordVisibility = (field) => {
  showPassword.value[field] = !showPassword.value[field];
};

// Fetch user data when component is mounted
onMounted(() => {
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  if (userId) {
    fetchUserData(userId);
  }
});
</script>

<style scoped>
.profile-container {
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.profile-card,
.password-card {
  max-width: 100%;
  margin: 2rem auto;
}

.v-card-title {
  font-size: 2rem;
  font-weight: bold;
}

.v-btn {
  margin-top: 1rem;
  width: 100%;
}
</style>
