<script setup>
import { ref, onMounted } from 'vue'
import { getUpcomingEvents } from '@/services/eventService'

const upcomingEvents = ref([])

const fetchUpcomingEvents = async () => {
  try {
    upcomingEvents.value = await getUpcomingEvents(5)
    console.log('Upcoming events:', upcomingEvents.value)
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error)
  }
}

onMounted(fetchUpcomingEvents)
</script>

<template>
  <div class="upcoming-events">
    <h2>Upcoming Events</h2>
    <p v-if="upcomingEvents.length === 0">No upcoming events found.</p>
    <div v-else class="event-cards">
      <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
        <h3>{{ event.name }}</h3>
        <p>Date: {{ event.date.toLocaleDateString() }}</p>
        <p>Location: {{ event.location }}</p>
        <p>{{ event.description }}</p>
      </div>
    </div>
  </div>
</template>
