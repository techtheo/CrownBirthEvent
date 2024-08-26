<template>
    <v-container class="profile-container" fluid>
      <v-row>
        <!-- Admin Profile Card -->
        <v-col cols="12" md="6">
          <v-card class="profile-card">
            <v-card-title>
              <v-typography variant="h4">Admin Profile</v-typography>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="updateProfile">
                <v-text-field
                  v-model="adminName"
                  label="Username"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  v-model="adminEmail"
                  label="Email"
                  outlined
                  required
                  type="email"
                ></v-text-field>
                <v-text-field
                  v-model="currentPassword"
                  label="Current Password"
                  outlined
                  type="password"
                  :append-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="toggleCurrentPasswordVisibility"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                ></v-text-field>
                <v-btn color="primary" type="submit" :loading="isLoading">
                  Update Profile
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Change Password Card -->
        <v-col cols="12" md="6">
          <v-card class="password-card">
            <v-card-title>
              <v-typography variant="h4">Change Password</v-typography>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="changePassword">
                <v-text-field
                  v-model="changeCurrentPassword"
                  label="Current Password"
                  outlined
                  :append-icon="showChangeCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="toggleChangeCurrentPasswordVisibility"
                  :type="showChangeCurrentPassword ? 'text' : 'password'"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="newPassword"
                  label="New Password"
                  outlined
                  :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="toggleNewPasswordVisibility"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  outlined
                  :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="toggleConfirmPasswordVisibility"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  :rules="[confirmPasswordRule]"
                ></v-text-field>
                <v-btn color="primary" type="submit" :loading="isChangingPassword">
                  Change Password
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
  import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
  
  const adminName = ref('');
  const adminEmail = ref('');
  const currentPassword = ref('');
  const changeCurrentPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const isLoading = ref(false);
  const isChangingPassword = ref(false);
  const showCurrentPassword = ref(false);
  const showChangeCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  const auth = getAuth();
  const db = getFirestore();
  
  const toggleCurrentPasswordVisibility = () => {
    showCurrentPassword.value = !showCurrentPassword.value;
  };
  
  const toggleChangeCurrentPasswordVisibility = () => {
    showChangeCurrentPassword.value = !showChangeCurrentPassword.value;
  };
  
  const toggleNewPasswordVisibility = () => {
    showNewPassword.value = !showNewPassword.value;
  };
  
  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };
  
  const fetchAdminData = async (uid) => {
    try {
      const adminDoc = doc(db, 'admins', uid);
      const docSnap = await getDoc(adminDoc);
  
      if (docSnap.exists()) {
        adminName.value = docSnap.data().username;
        adminEmail.value = docSnap.data().email;
      } else {
        console.log('No such admin data!');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };
  
  const updateProfile = async () => {
    isLoading.value = true;
    const user = auth.currentUser;
  
    if (!currentPassword.value) {
      alert('Please enter your current password.');
      isLoading.value = false;
      return;
    }
  
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
      await reauthenticateWithCredential(user, credential);
  
      if (adminName.value && adminEmail.value) {
        const adminDoc = doc(db, 'admins', user.uid);
        await updateDoc(adminDoc, {
          username: adminName.value,
          email: adminEmail.value,
        });
  
        await updateEmail(user, adminEmail.value);
        alert('Profile updated successfully!');
      } else {
        alert('Please fill in all required fields.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      isLoading.value = false;
    }
  };
  
  const changePassword = async () => {
    isChangingPassword.value = true;
    const user = auth.currentUser;
  
    if (newPassword.value !== confirmPassword.value) {
      alert('Passwords do not match!');
      isChangingPassword.value = false;
      return;
    }
  
    try {
      if (newPassword.value) {
        const credential = EmailAuthProvider.credential(user.email, changeCurrentPassword.value);
        await reauthenticateWithCredential(user, credential);
  
        await updatePassword(user, newPassword.value);
        alert('Password changed successfully!');
        newPassword.value = '';
        confirmPassword.value = '';
        changeCurrentPassword.value = '';
      } else {
        alert('Please enter a new password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password.');
    } finally {
      isChangingPassword.value = false;
    }
  };
  
  const confirmPasswordRule = (value) => {
    return value === newPassword.value || 'Passwords must match';
  };
  
  onMounted(() => {
    const user = auth.currentUser;
    if (user) {
      fetchAdminData(user.uid);
    } else {
      console.log('No user is signed in.');
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
  