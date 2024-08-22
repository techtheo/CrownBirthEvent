<script setup>
import { ref } from 'vue'
import { createEvent } from '@/services/eventService'

const newEvent = ref({ name: '', date: '', description: '', location: '' })
const loading = ref(false)
const toastMessage = ref('')

const createNewEvent = async () => {
  loading.value = true
  try {
    await createEvent(newEvent.value)
    showToast('Event created successfully!')
    clearForm()
  } catch (error) {
    showToast('Failed to create event: ' + error.message)
  } finally {
    loading.value = false
  }
}

const clearForm = () => {
  newEvent.value = { name: '', date: '', description: '', location: '' }
}

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="max-w-lg mx-auto mt-10">
    <h2 class="text-2xl font-semibold text-center mb-6">Create Event</h2>
    <form @submit.prevent="createNewEvent" class="bg-white p-6 rounded-lg shadow-lg">
      <div class="mb-4">
        <input
          v-model="newEvent.name"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Event Name"
          required
        />
      </div>
      <div class="mb-4">
        <input
          v-model="newEvent.date"
          type="date"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div class="mb-4">
        <textarea
          v-model="newEvent.description"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Event Description"
          required
        ></textarea>
      </div>
      <div class="mb-6">
        <input
          v-model="newEvent.location"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Location Address"
          required
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none"
      >
        <span v-if="loading" class="animate-spin mr-2">⏳</span>
        <span v-else>Create Event</span>
      </button>
    </form>

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>
