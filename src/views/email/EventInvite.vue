<script setup>
import { ref } from 'vue'
import emailjs from 'emailjs-com'

//Todo: Implement Email to send event by invitation
const props = defineProps(['event'])
const recipientEmail = ref('')
const sending = ref(false)
const message = ref('')

const sendInvitation = async () => {
  sending.value = true
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        to_email: recipientEmail.value,
        event_name: props.event.name,
        event_date: props.event.date,
        event_location: props.event.location,
        event_link: `https://yourapp.com/events/${props.event.id}`
      },
      'YOUR_USER_ID'
    )
    message.value = 'Invitation sent successfully!'
  } catch (error) {
    console.error('Failed to send invitation:', error)
    message.value = 'Failed to send invitation. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="send-invitation">
    <h3>Send Invitation</h3>
    <input v-model="recipientEmail" type="email" placeholder="Recipient's email" />
    <button @click="sendInvitation" :disabled="sending">
      {{ sending ? 'Sending...' : 'Send Invitation' }}
    </button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>