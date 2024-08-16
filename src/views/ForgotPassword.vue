<script setup>
import { ref } from 'vue'
import { triggerResetEmail } from '../services/authService'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { useRouter } from 'vue-router'

const email = ref('')
const emailError = ref('')
const loading = ref(false)
const $toast = useToast()
const router = useRouter()

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const sendResetLink = async () => {
  try {
    if (!validateEmail(email.value)) {
      emailError.value = 'Please enter a valid email address.'
      return
    }
    emailError.value = ''
    loading.value = true
    await triggerResetEmail(email.value)
    email.value = ''
    $toast.success('Password reset link sent! Check your email. Redirecting...')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    $toast.error('Failed to send reset link. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-gray-900">Reset Password</h1>
      <form @submit.prevent="sendResetLink" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="emailError" class="text-red-500">{{ emailError }}</p>
        <button
          type="submit"
          class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          :disabled="loading"
        >
          Send Reset Link
          <v-progress-circular
            v-if="loading"
            color="primary"
            indeterminate
            class="ml-2"
            size="24"
          ></v-progress-circular>
        </button>
      </form>
      <div class="text-center">
        <p>Remember password?</p>
        <router-link to="/login" class="text-blue-500 hover:underline"> LogIn </router-link>
      </div>
    </div>
  </div>
</template>
