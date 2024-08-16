<script setup>
import { ref, onMounted, computed } from 'vue'
import { updateEvent, deleteEvent } from '@/services/eventService'
import { getAllEventsWithUserDetails } from '@/services/allUserEvents'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const events = ref([])
const loading = ref(false)
const toastMessage = ref('')
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const eventToDelete = ref(null)
const editEventData = ref({ id: '', name: '', date: '', description: '', location: '' })

const itemsPerPage = 10
const currentPage = ref(1)
const totalItems = ref(0)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage - 1, totalItems.value))

const fetchEvents = async () => {
  loading.value = true
  try {
    const { data, totalItems: total } = await getAllEventsWithUserDetails(
      currentPage.value,
      itemsPerPage
    )
    events.value = data
    totalItems.value = total
  } catch (error) {
    showToast('Failed to fetch events: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handlePageChange = () => {
  fetchEvents()
}

onMounted(() => {
  fetchEvents()
})

const deleteExistingEvent = async () => {
  loading.value = true
  try {
    if (eventToDelete.value) {
      await deleteEvent(eventToDelete.value.id)
      await fetchEvents()
      showToast('Event deleted successfully!')
      showDeleteModal.value = false
    }
  } catch (error) {
    showToast('Failed to delete event: ' + error.message)
    console.log(error)
  } finally {
    loading.value = false
  }
}

const confirmDeleteEvent = (event) => {
  eventToDelete.value = event
  showDeleteModal.value = true
}

const editEvent = (event) => {
  editEventData.value = { ...event }
  showEditModal.value = true
}

const updateExistingEvent = async () => {
  loading.value = true
  try {
    await updateEvent(editEventData.value.id, editEventData.value)
    await fetchEvents()
    showToast('Event updated successfully!')
    showEditModal.value = false
  } catch (error) {
    showToast('Failed to update event: ' + error.message)
    console.log(error)
  } finally {
    loading.value = false
  }
}

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10">
    <h2 class="text-3xl font-semibold text-center mb-8">All Events</h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <span class="animate-spin text-3xl">⏳</span>
      <p>Loading events...</p>
    </div>

    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 px-6 text-left">S/N</th>
            <th class="py-2 px-6 text-left">Name</th>
            <th class="py-2 px-6 text-left">Date</th>
            <th class="py-2 px-6 text-left">Description</th>
            <th class="py-2 px-6 text-left">Location</th>
            <th class="py-2 px-6 text-left">User Name</th>
            <th class="py-2 px-6 text-left">User Email</th>
            <th class="py-2 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(event, index) in events"
            :key="event.id"
            :class="{
              'bg-gray-100': (index + 1) % 2 === 0,
              'bg-white': (index + 1) % 2 !== 0
            }"
            class="hover:bg-gray-100"
          >
            <td class="py-2 px-6">{{ index + 1 }}</td>
            <td class="py-2 px-6">{{ event.name }}</td>
            <td class="py-2 px-6">{{ event.date }}</td>
            <td class="py-2 px-6">{{ event.description }}</td>
            <td class="py-2 px-6">{{ event.location }}</td>
            <td class="py-2 px-6">{{ event.userName }}</td>
            <td class="py-2 px-6">{{ event.userEmail }}</td>
            <td class="py-2 px-6 text-center">
              <button @click="editEvent(event)" class="text-indigo-500 hover:text-indigo-700 mr-4">
                Edit
              </button>
              <button @click="confirmDeleteEvent(event)" class="text-red-500 hover:text-red-700">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between w-full overflow-hidden p-6 shadow-lg bg-[#ffffff] example-one">
      <VueAwesomePaginate
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :max-pages-shown="5"
        v-model="currentPage"
        @click="handlePageChange"
      >
        <template #prev-button>
          <FontAwesomeIcon :icon="faChevronLeft" />
        </template>
        <template #next-button>
          <FontAwesomeIcon :icon="faChevronRight" />
        </template>
      </VueAwesomePaginate>
      <div>Showing {{ startIndex }} to {{ endIndex }} of {{ totalItems }} results</div>
    </div>
    <!-- Edit Event Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Edit Event</h3>
        <form @submit.prevent="updateExistingEvent">
          <div class="mb-4">
            <input
              v-model="editEventData.name"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Event Name"
              required
            />
          </div>
          <div class="mb-4">
            <input
              v-model="editEventData.date"
              type="date"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div class="mb-4">
            <textarea
              v-model="editEventData.description"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Event Description"
              required
            ></textarea>
          </div>
          <div class="mb-6">
            <input
              v-model="editEventData.location"
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
            <span v-else>Update Event</span>
          </button>
          <button
            type="button"
            @click="showEditModal = false"
            class="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Confirm Deletion</h3>
        <p class="mb-6">
          Are you sure you want to delete the event <strong>{{ eventToDelete?.name }}</strong
          >?
        </p>
        <div class="flex justify-between">
          <button
            @click="deleteExistingEvent"
            :disabled="loading"
            class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none mr-2"
          >
            <span v-if="loading" class="animate-spin mr-2">⏳</span>
            <span v-else>Yes, Delete</span>
          </button>
          <button
            @click="showDeleteModal = false"
            class="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<style scoped::deep>
.example-one .pagination-container {
  column-gap: 10px;
}
.example-one .paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.example-one .paginate-buttons:hover {
  background-color: #d8d8d8;
}
.example-one .active-page {
  background-color: #247b7b;
  border: 1px solid #247b7b;
  color: white;
}
.example-one .active-page:hover {
  background-color: #1b6363;
}
.example-one .back-button:active,
.example-one .next-button:active {
  background-color: #c4c4c4;
}
</style>
