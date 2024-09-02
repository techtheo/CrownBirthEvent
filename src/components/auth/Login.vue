<template class="body">
  <div class="login-container">
    <div class="logo-title-wrapper">
      <router-link to="/">
        <img src="../../assets/c logo.png" alt="C Logo" class="logo" />
      </router-link>
      <h1 class="title">Login</h1>
    </div>
    <input id="email" type="email" placeholder="Email" v-model="email" class="input-field" />
    <input
      id="password"
      type="password"
      placeholder="Password"
      v-model="password"
      class="input-field"
    />
    <button @click="login" class="login-button" :disabled="loading">Login</button>
    <p class="signup-link">
      Don't have an account yet? <router-link to="/signup">Sign Up</router-link>
    </p>

    <!-- Preloader -->
    <div v-if="loading" class="preloader">
      <div class="spinner"></div>
    </div>

    <!-- Success Alert -->
    <transition name="slide-fade">
      <div v-if="showAlert" class="alert success-alert">
        <span class="alert-icon">&#10003;</span>
        <!-- Tick mark icon -->
        <span class="alert-message">Login successful!</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// Initialize Firestore
const db = getFirestore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const showAlert = ref(false)

const login = async () => {
  loading.value = true // Show preloader
  const auth = getAuth()
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    // Force token refresh to get updated claims
    const idTokenResult = await user.getIdTokenResult(true)
    // console.log('ID Token Claims:', idTokenResult.claims); // Debugging line

    let userRole = idTokenResult.claims.role // Assuming role is stored in custom claims

    // Fallback to Firestore if role is not available in claims
    if (!userRole) {
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        userRole = userDoc.data().role
        console.log('User Role from Firestore:', userRole) // Debugging line
      } else {
        console.error('No such document!')
        userRole = 'user' // Default role
      }
    } else {
      console.log('User Role from Claims:', userRole) // Debugging line
    }

    showAlert.value = true // Show success alert
    setTimeout(() => {
      // Redirect based on the role
      if (userRole === 'admin') {
        // console.log('Redirecting to admin-dashboard'); // Debugging line
        router.push('/admin-dashboard') // Redirect to admin dashboard
      } else if (userRole === 'manager') {
        // console.log('Redirecting to manager-dashboard'); // Debugging line
        router.push('/manager-dashboard') // Redirect to manager dashboard
      } else {
        // console.log('Redirecting to user-dashboard'); // Debugging line
        router.push('/user-dashboard') // Redirect to user dashboard
      }
    }, 1500) // Adjust the delay to match your animation duration
  } catch (error) {
    alert(`Login failed: ${error.message}`) // Show error message
  } finally {
    loading.value = false // Hide preloader
  }
}
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

.login-container {
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
  width: 80px;
  height: auto;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
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

.login-button {
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

.login-button:hover {
  background-color: #36a15f;
}

.signup-link {
  margin-top: 1rem;
  color: #666;
}

.signup-link a {
  color: #42b983;
  text-decoration: none;
}

.signup-link a:hover {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active in <2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;
}
</style>
