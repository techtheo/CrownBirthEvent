<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBars)

const route = useRoute()
const linkText = ref('Register')
const linkDestination = ref('/register')
const additionalText = ref('New to Crownbirth Events?')
const isMobile = useMediaQuery('(max-width: 767px)')
const isMenuOpen = ref(false)

const updateLinkInfo = () => {
  if (route.path === '/register') {
    linkText.value = 'Sign In'
    linkDestination.value = '/login'
    additionalText.value = 'Already have an account?'
  } else {
    linkText.value = 'Sign Up'
    linkDestination.value = '/register'
    additionalText.value = 'New to Crownbirth Events??'
  }
}

watch(() => route.path, updateLinkInfo, { immediate: true })
</script>

<template>
  <nav class="p-4 flex items-center justify-between sticky top-0 z-50">
    <RouterLink to="/" class="text-2xl text-[#247b7b] cursor-pointer uppercase font-bold">
      Eventz
    </RouterLink>
    <div v-if="isMobile" class="relative">
      <font-awesome-icon
        icon="bars"
        class="text-[#247b7b] text-2xl cursor-pointer"
        @click="isMenuOpen = !isMenuOpen"
      />
      <div
        v-if="isMenuOpen"
        class="absolute top-12 right-0 bg-white p-2 border border-[#247b7b] rounded text-[12px] text-center"
      >
        <div class="text-[#606060] text-sm mb-2">{{ additionalText }}</div>
        <RouterLink
          :to="linkDestination"
          class="block bg-white border border-[#247b7b] text-[#247b7b] hover:bg-[#247b7b] hover:text-white transition py-2 rounded font-bold"
        >
          {{ linkText }}
        </RouterLink>
      </div>
    </div>
    <div v-else class="text-[#606060] text-sm">
      {{ additionalText }} &nbsp;
      <RouterLink
        :to="linkDestination"
        class="bg-white border border-[#247b7b] text-[#247b7b] hover:bg-[#247b7b] hover:text-white transition p-2 py-2 rounded font-bold"
      >
        {{ linkText }}
      </RouterLink>
    </div>
  </nav>
</template>
