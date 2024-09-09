<template>
  <v-container class="login-container" fluid>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card class="login-card" elevation="3">
          <v-card-title class="logo-title-wrapper">
            <router-link to="/">
              <v-img src="https://i.postimg.cc/kMLhjbp4/c-logo.png" alt="C Logo" class="logo" />
            </router-link>
            <h1 class="title">Login</h1>
          </v-card-title>

          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                v-model="email"
                outlined
                dense
                prepend-icon="mdi-email"
                required
              ></v-text-field>

              <v-text-field
                :type="passwordVisible ? 'text' : 'password'"
                label="Password"
                v-model="password"
                outlined
                dense
                prepend-icon="mdi-lock"
                :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="togglePasswordVisibility"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              class="login-button"
              @click="login"
              :disabled="loading"
              block
            >
              Login
            </v-btn>
          </v-card-actions>

          <v-card-subtitle class="signup-link">
            Don't have an account yet?
            <router-link to="/signup">Sign Up</router-link>
          </v-card-subtitle>

          <!-- Preloader -->
          <div v-if="loading" class="preloader">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>

          <!-- Success Alert -->
          <v-snackbar v-model="showAlert" color="success" top right>
            Login successful!
            <template v-slot:action="{ attrs }">
              <v-btn text v-bind="attrs" @click="showAlert = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const db = getFirestore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const showAlert = ref(false)
const passwordVisible = ref(false)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const login = async () => {
  loading.value = true // Show preloader
  const auth = getAuth()
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    const idTokenResult = await user.getIdTokenResult(true)
    let userRole = idTokenResult.claims.role 

    if (!userRole) {
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        userRole = userDoc.data().role
      } else {
        console.error('No such document!')
        userRole = 'user'
      }
    }

    showAlert.value = true // Show success alert
    setTimeout(() => {
      if (userRole === 'admin') {
        router.push('/admin-dashboard')
      } else if (userRole === 'manager') {
        router.push('/manager-dashboard')
      } else {
        router.push('/user-dashboard')
      }
    }, 1500)
  } catch (error) {
    alert(`Login failed: ${error.message}`)
  } finally {
    loading.value = false // Hide preloader
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(-45deg, #ff6b6b, #f06595, #f79c42, #ffbb33);
  background-size: 400% 400%;
  animation: gradientBackground 15s ease infinite;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.login-card {
  padding: 2rem;
  border-radius: 12px;
}

.logo-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo {
  width: 60px;
  height: auto;
  margin-right: 10px;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
}

.login-button {
  margin-top: 1rem;
}

.signup-link {
  text-align: center;
  margin-top: 1rem;
}

.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}
</style>
