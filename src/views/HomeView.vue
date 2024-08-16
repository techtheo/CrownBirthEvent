<script setup>
import NavBar from '@/components/NavBar.vue';
import UpcomingEvents from '@/components/UpcomingEvents.vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGetStarted = () => {
  router.push('/register')
}
</script>

<template>
  <main>
    <NavBar />
    <div class="container mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to Crownbirth Events</h1>
      <p class="text-lg text-gray-600 mb-8">
        We provide innovative solutions to drive your events forward. Join us to experience
        cutting-edge technology and exceptional service.
      </p>
      <button
        @click="handleGetStarted"
        class="border border-[#247b7b] text-[#247b7b] hover:bg-[#247b7b] hover:text-white transition px-6 py-3 rounded-md text-lg"
      >
        Get Started
      </button>
    </div>
    <UpcomingEvents />
  </main>
</template>
