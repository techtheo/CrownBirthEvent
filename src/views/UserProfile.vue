<template>
  <div class="profile-container">
    <h1>User Profile</h1>
    <p>Edit your user details here.</p>
    
    <!-- Display user details -->
    <div v-if="user">
      <!-- Update Profile Form -->
      <form @submit.prevent="updateUserProfile">
        <div class="form-group">
          <label for="username">Username:</label>
          <input v-model="user.username" id="username" type="text" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="user.email" id="email" type="email" />
        </div>
        <button type="submit" :disabled="loading || !isProfileValid">
          <span v-if="loading && !passwordUpdating" class="spinner"></span>
          Update Profile
        </button>
      </form>
      
      <!-- Change Password Form -->
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="currentPassword">Current Password:</label>
          <input v-model="currentPassword" id="currentPassword" type="password" placeholder="Enter current password" />
        </div>
        <div class="form-group">
          <label for="newPassword">New Password:</label>
          <input v-model="newPassword" id="newPassword" type="password" placeholder="Enter new password" />
          <small class="password-hint">Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.</small>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm New Password:</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password" placeholder="Confirm new password" />
        </div>
        <button type="submit" :disabled="loading || !isPasswordValid">
          <span v-if="loading && passwordUpdating" class="spinner"></span>
          Change Password
        </button>
      </form>
    </div>
    <p v-else>Loading...</p>

    <!-- Success/Failure Alert -->
    <transition name="fade">
      <div v-if="successMessage" class="alert success">
        {{ successMessage }}
      </div>
    </transition>
    <transition name="fade">
      <div v-if="errorMessage" class="alert error">
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

// References
const user = ref({
  username: '',
  email: ''
});
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const auth = getAuth();
const db = getFirestore();
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const passwordUpdating = ref(false);

// Computed properties for form validation
const isProfileValid = computed(() => user.value.username && user.value.email);
const isPasswordValid = computed(() => {
  return newPassword.value === confirmPassword.value &&
         validatePassword(newPassword.value) &&
         currentPassword.value;
});

// Fetch user data from Firestore
const fetchUserData = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid); // Fetch document from 'users' collection
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      user.value = docSnap.data(); // Store user data
    } else {
      console.log('No such user data!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Password validation function
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Update user profile
const updateUserProfile = async () => {
  loading.value = true; // Start loading
  if (auth.currentUser) {
    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, {
        username: user.value.username,
        email: user.value.email
      });
      successMessage.value = 'Profile updated successfully'; // Set success message
    } catch (error) {
      console.error('Error updating profile:', error);
      errorMessage.value = 'Error updating profile'; // Set error message
    } finally {
      loading.value = false; // End loading
      setTimeout(() => successMessage.value = '', 3000); // Clear message after 3 seconds
      setTimeout(() => errorMessage.value = '', 3000); // Clear error after 3 seconds
    }
  } else {
    console.log('User is not authenticated.');
    errorMessage.value = 'User is not authenticated';
  }
};

// Change password
const changePassword = async () => {
  passwordUpdating.value = true; // Indicate that password is being updated
  if (auth.currentUser && currentPassword.value) {
    // Check if new password matches the confirm password
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = "New passwords do not match";
      passwordUpdating.value = false;
      return;
    }
    
    // Validate the new password based on signup page rules
    if (!validatePassword(newPassword.value)) {
      errorMessage.value = "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.";
      passwordUpdating.value = false;
      return;
    }

    try {
      // Reauthenticate the user with the current password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword.value
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update to the new password
      await updatePassword(auth.currentUser, newPassword.value);
      successMessage.value = 'Password changed successfully'; // Set success message
    } catch (error) {
      console.error('Error changing password:', error);
      errorMessage.value = 'Error changing password'; // Set error message
    } finally {
      passwordUpdating.value = false; // End password update
      setTimeout(() => successMessage.value = '', 3000); // Clear message after 3 seconds
      setTimeout(() => errorMessage.value = '', 3000); // Clear error after 3 seconds
    }
  } else {
    errorMessage.value = 'Please enter your current password';
    passwordUpdating.value = false;
  }
};

// Fetch user data when component is mounted
onMounted(() => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    fetchUserData(currentUser.uid); // Call the function with the user's UID
  }
});
</script>


<style scoped>
.profile-container {
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
  max-width: 600px; /* Constrain the container width */
  margin: 0 20px; /* Center the container horizontally */
}

h1, p {
  text-align: left; /* Align headings and paragraphs to the left */
}

.form-group {
  margin-bottom: 1.5rem; /* Increase the spacing between form fields */
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%; /* Ensure inputs take full width of their container */
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  text-align: left;
  width: 100%; /* Make button take full width */
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.spinner {
  position: absolute;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  text-align: left;
}

.success {
  background-color: #28a745;
}

.error {
  background-color: #dc3545;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.password-hint {
  color: #6c757d;
  font-size: 0.875rem;
  text-align: left;
}

/* Spacing adjustments */
form {
  margin-top: 2rem; /* Add space between the forms */
}

form:first-of-type {
  margin-top: 1rem; /* Add space only to the first form (for the profile update) */
}
</style>
