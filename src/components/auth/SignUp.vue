<template>
  <div class="signup-container">
    <div class="logo-title-wrapper">
      <img src="C:\Users\USER\OneDrive\Desktop\event3\CrownBirthEvent\src\assets\c logo.png" alt="Logo" class="logo" />
      <h1 class="title">Sign Up</h1>
    </div>
    <input type="email" placeholder="Email" v-model="email" class="input-field" />
    <div class="input-wrapper">
      <input
        :type="passwordVisible ? 'text' : 'password'"
        placeholder="Password"
        v-model="password"
        class="input-field"
      />
      <i
        @click="togglePasswordVisibility('password')"
        :class="passwordVisible ? 'icon eye-slash' : 'icon eye'"
        class="password-toggle"
      >
        <component :is="passwordVisible ? FaEyeSlash : FaEye" />
      </i>
    </div>
    <div class="input-wrapper">
      <input
        :type="confirmPasswordVisible ? 'text' : 'password'"
        placeholder="Confirm Password"
        v-model="confirmPassword"
        class="input-field"
      />
      <i
        @click="togglePasswordVisibility('confirmPassword')"
        :class="confirmPasswordVisible ? 'icon eye-slash' : 'icon eye'"
        class="password-toggle"
      >
        <component :is="confirmPasswordVisible ? FaEyeSlash : FaEye" />
      </i>
    </div>
    <button @click="signup" class="signup-button" :disabled="!isFormValid || loading">Sign Up</button>
    <p class="login-link">Already have an account? <router-link to="/login">Login</router-link></p>
    <div v-if="loading" class="preloader">
      <div class="spinner"></div>
    </div>
    <transition name="slide-fade">
      <div v-if="showAlert" class="alert success-alert">
        <span class="alert-icon">&#10003;</span>
        <span class="alert-message">Sign up successful!</span>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Import the Firestore instance
// import { FaEye, FaEyeSlash } from '@vicons/fa'; // Import Vite icons

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const loading = ref(false);
const showAlert = ref(false);

const isPasswordValid = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

const isFormValid = computed(() => {
  return email.value && isPasswordValid(password.value) && password.value === confirmPassword.value;
});

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordVisible.value = !passwordVisible.value;
  } else if (field === 'confirmPassword') {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  }
};

const signup = async () => {
  if (!isFormValid.value) {
    alert('Please ensure all fields are filled correctly and passwords match the requirements.');
    return;
  }
  loading.value = true;
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Save the user's role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email.value,
      role: 'user' // Default role; you can change this to 'admin' if needed
    });

    showAlert.value = true;
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error) {
    alert(`Sign-up failed: ${error.message}`);
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
/* Background Animation */
@keyframes gradientBackground {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(-45deg, #ff6b6b, #f06595, #f79c42, #ffbb33);
  background-size: 400% 400%;
  animation: gradientBackground 15s ease infinite;
}

.signup-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9); /* Slightly transparent background */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.logo-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 60px; /* Adjust size as needed */
  height: auto;
  margin-right: 1rem; /* Space between logo and title */
}

.title {
  font-size: 2rem;
  color: #333;
}

.input-wrapper {
  position: relative;
  margin: 0.5rem 0;
}

.input-field {
  width: calc(100% - 1rem);
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1rem;
  color: #ccc;
}

.password-toggle:hover {
  color: #42b983;
}

.signup-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signup-button:hover {
  background-color: #36a15f;
}

.signup-button:disabled {
  background-color: #a1a1a1;
  cursor: not-allowed;
}

.login-link {
  margin-top: 1rem;
  color: #666;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Preloader Styles */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #42b983;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Alert Styles */
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  background-color: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.success-alert {
  background-color: #4caf50;
}

.alert-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.alert-message {
  font-size: 1rem;
}

/* Slide-in Animation */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active in <2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;
}
</style>
