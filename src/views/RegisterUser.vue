<script setup>
import { ref } from 'vue'
import { registerUser, signInWithGoogle } from '../services/authService'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const emailError = ref('')
const loading = ref(false)
const $toast = useToast()
const router = useRouter()

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const clearField = () => {
  email.value = ''
  password.value = ''
  errorMessage.value = ''
}

const register = async () => {
  try {
    errorMessage.value = ''
    if (!validateEmail(email.value)) {
      emailError.value = 'Please enter a valid email address.'
      return
    }
    emailError.value = ''
    loading.value = true
    await registerUser(email.value, password.value)
    clearField()
    $toast.success('Registration successful! Redirecting...')
    setTimeout(() => {
      router.push('/login')
    }, 2000) // Wait for 2 seconds before navigating to the login page
  } catch (error) {
    errorMessage.value = error.message
    // Clear the error message after 3 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}

const signInWithGoogleHandler = async () => {
  try {
    loading.value = true
    const { errorMessage, user, role } = await signInWithGoogle() // user credential destructuring user, token, errorMessage
    if (errorMessage) {
      throw new Error(errorMessage)
    }

    localStorage.setItem('user', JSON.stringify(user))
    // localStorage.setItem('token', token)

    // You can store the user and token in your state management or local storage
    // console.log('User:', user)
    // console.log('Token:', token)

    $toast.success('Login successful! Redirecting to dashboard...')
    setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    }, 2000)
  } catch (error) {
    errorMessage.value = error.message
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}
</script>

<!-- <template>
  <NavBar />
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-gray-900">Register</h1>
      <form @submit.prevent="register" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="emailError" class="text-red-500">{{ emailError }}</p>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          :disabled="loading"
        >
          <div class="flex items-center">
            {{ loading ? 'Signing Up...' : 'Register' }}
            <span v-if="loading" class="animate-spin ml-2">⏳</span>
          </div>
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

      <div class="text-center mt-4">
        <button
          @click="signInWithGoogleHandler"
          class="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
          :disabled="loading"
        >
          Sign in with Google
          <span v-if="loading" class="animate-spin ml-2">⏳</span>
        </button>
      </div>
      <div class="flex justify-center gap-1">
        <p>Already have an account?</p>
        <router-link to="/login" class="text-blue-500 hover:underline"> LogIn </router-link>
      </div>
    </div>
  </div>
</template> -->
