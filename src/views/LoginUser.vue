<script setup>
import { ref } from 'vue'
import { loginUser } from '../services/authService'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import NavBar from '@/components/NavBar.vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const $toast = useToast()
const router = useRouter()

const clearField = () => {
  email.value = ''
  password.value = ''
  errorMessage.value = ''
}

const login = async () => {
  try {
    errorMessage.value = ''
    loading.value = true
    const { role } = await loginUser(email.value, password.value)
    clearField()
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
    // Clear the error message after 3 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
    $toast.error('Login failed. Please check your credentials and try again.')
  } finally {
    loading.value = false
  }
}
</script>

<!-- <template>
  <NavBar />
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-gray-900">Login</h1>
      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
            {{ loading ? ' Logging In...' : 'Login' }}
            <span v-if="loading" class="animate-spin ml-2">⏳</span>
          </div>
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      <div class="flex justify-between">
        <div class="text-center">
          <router-link to="/forgot-password" class="text-blue-500 hover:underline">
            Forgot Password?
          </router-link>
        </div>
        <div class="text-center">
          <router-link to="/register" class="text-blue-500 hover:underline">
            Create account
          </router-link>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <router-link to="/" class="text-gray-500 hover:underline">
          <FontAwesomeIcon :icon="faArrowLeft" />
          <span class="ml-1">Back to home </span>
        </router-link>
      </div>
    </div>
  </div>
</template> -->
