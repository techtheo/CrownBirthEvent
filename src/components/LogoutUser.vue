<script setup>
import { logoutUser } from '../services/authService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const router = useRouter()
const $toast = useToast()

const signOut = async () => {
  try {
    await logoutUser()
    $toast.success('Successfully logged out!')
    setTimeout(() => {
      router.push('/login')
    }, 2000) // Wait for 2 seconds before navigating to the login page
  } catch (error) {
    $toast.error('Logout failed. Please try again.')
  }
}
</script>

<template>
  <button
    @click="signOut"
    class="px-2 py-1 font-bold text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
  >
    Sign Out
  </button>
</template>
