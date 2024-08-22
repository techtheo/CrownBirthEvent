<script setup>
import { ref, computed } from 'vue'
import { searchEvents } from '@/services/searchEvent'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const searchQuery = ref('')
const events = ref([])
const loading = ref(false)
const itemsPerPage = 10
const currentPage = ref(1)
const totalItems = ref(0)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage - 1, totalItems.value))

const search = async () => {
  loading.value = true
  try {
    const { data, totalItems: total } = await searchEvents(
      searchQuery.value,
      currentPage.value,
      itemsPerPage
    )
    events.value = data
    totalItems.value = total
  } catch (error) {
    console.error('Failed to search events:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = () => {
  search()
}
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10">
    <div class="flex justify-center items-center">
      <input
        v-model="searchQuery"
        @keydown.enter="search"
        class="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2"
        placeholder="Search events..."
      />
      <button
        @click="search"
        class="px-4 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 focus:outline-none"
      >
        <FontAwesomeIcon :icon="faSearch" />
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">Loading events...</div>

    <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 px-6 text-left">S/N</th>
            <th class="py-2 px-6 text-left">Name</th>
            <th class="py-2 px-6 text-left">Date</th>
            <th class="py-2 px-6 text-left">Description</th>
            <th class="py-2 px-6 text-left">Location</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(event, index) in events"
            :key="event.id"
            :class="{
              'bg-gray-100': (index + 1) % 2 === 0, // Apply background color to even rows
              'bg-white': (index + 1) % 2 !== 0 // Default background color for odd rows
            }"
            class="hover:bg-gray-100"
          >
            <td class="py-2 px-6">{{ index + 1 }}</td>
            <td class="py-2 px-6">{{ event.name }}</td>
            <td class="py-2 px-6">{{ event.date }}</td>
            <td class="py-2 px-6">{{ event.description }}</td>
            <td class="py-2 px-6">{{ event.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex justify-between w-full overflow-hidden p-6 shadow-lg bg-[#ffffff] example-one"
      v-if="events.length"
    >
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
