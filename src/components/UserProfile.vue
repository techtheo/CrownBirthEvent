<template>
    <div class="user-profile container mt-5">
      <h2 class="mb-4">My Profile</h2>
      <form @submit.prevent="updateProfile">
        <div class="row mb-3">
          <label for="name" class="col-sm-2 col-form-label">Name</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="name" v-model="profile.name" required>
          </div>
        </div>
        <div class="row mb-3">
          <label for="email" class="col-sm-2 col-form-label">Email</label>
          <div class="col-sm-10">
            <input type="email" class="form-control" id="email" v-model="profile.email" required>
          </div>
        </div>
        <div class="row mb-3">
          <label for="phone" class="col-sm-2 col-form-label">Phone</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="phone" v-model="profile.phone">
          </div>
        </div>
        <div class="row mb-3">
          <label for="address" class="col-sm-2 col-form-label">Address</label>
          <div class="col-sm-10">
            <textarea class="form-control" id="address" v-model="profile.address"></textarea>
          </div>
        </div>
        <div class="row mb-3">
          <label for="profileImage" class="col-sm-2 col-form-label">Profile Image</label>
          <div class="col-sm-10">
            <input type="file" class="form-control" id="profileImage" @change="onFileChange">
            <img :src="profile.imageUrl" alt="Profile Image" v-if="profile.imageUrl" class="mt-3" style="max-width: 150px;">
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Update Profile</button>
        <button @click="logout" type="button" class="btn btn-danger mt-3">Logout</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        profile: {
          name: '',
          email: '',
          phone: '',
          address: '',
          imageUrl: ''
        }
      };
    },
    methods: {
      onFileChange(event) {
        const file = event.target.files[0];
        this.profile.imageUrl = URL.createObjectURL(file);
        // Here, you would upload the file to your server or storage (e.g., Firebase Storage)
      },
      async updateProfile() {
        try {
          // Save the profile data to the backend (e.g., Firebase Firestore)
          // await this.saveProfileToBackend();
  
          alert('Profile updated successfully!');
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Failed to update profile. Please try again.');
        }
      },
      async fetchUserProfile() {
        try {
          // Fetch the profile data from the backend (e.g., Firebase Firestore)
          // const userProfile = await this.fetchProfileFromBackend();
  
          // Sample data for demonstration
          const userProfile = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            address: '123 Main St, Anytown, USA',
            imageUrl: 'https://via.placeholder.com/150'
          };
  
          this.profile = userProfile;
        } catch (error) {
          console.error('Error fetching profile:', error);
          alert('Failed to fetch profile. Please try again.');
        }
      },
      logout() {
        // Perform logout logic, such as clearing tokens or session data
        this.$router.push('/login'); // Redirect to login page after logout
      }
    },
    mounted() {
      this.fetchUserProfile();
    }
  };
  </script>
  
  <style scoped>
  .user-profile {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .user-profile img {
    border-radius: 50%;
  }
  </style>
  