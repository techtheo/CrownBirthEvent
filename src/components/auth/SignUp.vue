<template>
  <v-container class="signup-container" fluid>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card class="signup-card" elevation="3">
          <v-card-title class="logo-title-wrapper">
            <router-link to="/">
              <v-img src="https://i.postimg.cc/kMLhjbp4/c-logo.png" alt="C Logo" class="logo" />
            </router-link>
            <h1 class="title">Sign Up</h1>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <v-text-field
                label="Username"
                v-model="username"
                outlined
                dense
                prepend-icon="mdi-account"
                required
              ></v-text-field>

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
                @input="validatePassword"
                :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="togglePasswordVisibility('password')"
                @focus="showPasswordRequirements = true"
                @blur="showPasswordRequirements = false"
                required
              ></v-text-field>

              <!-- Password Requirements -->
              <div v-if="showPasswordRequirements">
                <ul class="password-requirements-list">
                  <li :class="{ met: passwordLengthMet }">Minimum 8 characters</li>
                  <li :class="{ met: hasUppercase }">At least one uppercase letter</li>
                  <li :class="{ met: hasLowercase }">At least one lowercase letter</li>
                  <li :class="{ met: hasNumber }">At least one number</li>
                  <li :class="{ met: hasSpecialChar }">At least one special character</li>
                </ul>
                <p v-if="isPasswordStrong" class="password-strong">Password is strong</p>
              </div>

              <v-text-field
                :type="confirmPasswordVisible ? 'text' : 'password'"
                label="Confirm Password"
                v-model="confirmPassword"
                outlined
                dense
                prepend-icon="mdi-lock-check"
                :append-icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="togglePasswordVisibility('confirmPassword')"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              class="signup-button"
              @click="signup"
              :disabled="!isFormValid || loading"
              block
            >
              Sign Up
            </v-btn>
          </v-card-actions>

          <v-card-subtitle class="login-link">
            Already have an account?
            <router-link to="/login">Login</router-link>
          </v-card-subtitle>

          <!-- New Stylish Preloader -->
          <div id="preloader" class="new-preloader">
            <div class="loader"></div>
          </div>

          <v-snackbar v-model="showAlert" color="success" top right>
            Sign up successful!
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'

// Declare references and state variables
const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const loading = ref(false)
const showAlert = ref(false)
const showPasswordRequirements = ref(false)

// Password validation states
const passwordLengthMet = ref(false)
const hasUppercase = ref(false)
const hasLowercase = ref(false)
const hasNumber = ref(false)
const hasSpecialChar = ref(false)

// Validate password on input
const validatePassword = () => {
  passwordLengthMet.value = password.value.length >= 8
  hasUppercase.value = /[A-Z]/.test(password.value)
  hasLowercase.value = /[a-z]/.test(password.value)
  hasNumber.value = /[0-9]/.test(password.value)
  hasSpecialChar.value = /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
}

const isPasswordStrong = computed(() => {
  return (
    passwordLengthMet.value &&
    hasUppercase.value &&
    hasLowercase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  )
})

const isFormValid = computed(() => {
  return (
    username.value &&
    email.value &&
    isPasswordStrong.value &&
    password.value === confirmPassword.value
  )
})

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordVisible.value = !passwordVisible.value
  } else if (field === 'confirmPassword') {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  }
}

// Updated signup function with JS preloader
const signup = async () => {
  if (!isFormValid.value) {
    alert('Please ensure all fields are filled correctly and passwords match the requirements.')
    return
  }

  // Show preloader
  document.getElementById('preloader').style.display = 'flex';

  // Add delay of 1 second
  await new Promise(resolve => setTimeout(resolve, 1000));

  loading.value = true
  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
    const user = userCredential.user

    await setDoc(doc(db, 'users', user.uid), {
      username: username.value,
      email: email.value,
      role: 'user'
    })

    showAlert.value = true
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error) {
    alert(`Sign-up failed: ${error.message}`)
  } finally {
    loading.value = false
    // Hide preloader
    document.getElementById('preloader').style.display = 'none';
  }
}
</script>

<style scoped>
.signup-container {
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

.signup-card {
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
  width: 50px;
  height: auto;
  margin-right: 10px;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
}

.password-requirements-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.password-requirements-list li {
  color: red;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.password-requirements-list li.met {
  color: green;
}

.password-strong {
  color: green;
  font-weight: bold;
  font-size: 0.9rem;
}

.signup-button {
  margin-top: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}

/* New Stylish Preloader Styles */
.new-preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  display: none;
  justify-content: center;
  align-items: center;
}

.loader {
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
