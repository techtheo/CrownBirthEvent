<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useDisplay } from 'vuetify'
import Search from '@/components/SearchEvent.vue'
// import logo from '../../assets/logo.png'
import LogoutUser from '@/components/LogoutUser.vue'

const route = useRoute()
const router = useRouter()
const display = useDisplay()

const sidebarMenu = ref(true)
const toggleMini = ref(false)

const user = ref({})

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('user') || '{}')
})

const menuItems = [
  { title: 'Create Event', route: '/dashboard/create-event', icon: 'fas fa-calendar-plus-o' },
  { title: 'Bookings', route: '/dashboard/event-bookings', icon: 'fas fa-bullhorn' },
  {
    title: 'Market Intelligence',
    route: '/dashboard/market-intelligence',
    icon: 'fas fa-map-marker'
  },
  { title: 'Feeds', route: '/dashboard/feeds', icon: 'fas fa-wifi' },
  {
    title: 'Brand Health',
    route: '/dashboard/brand-health',
    icon: 'fas fa-ambulance'
  },
  {
    title: 'Influencers',
    route: '/dashboard/influencers',
    icon: 'fas fa-bookmark'
  },
  {
    title: 'Competitor Insights',
    route: '/dashboard/competitor-insights',
    icon: 'fas fa-qrcode'
  },
  {
    title: 'Account Settings',
    route: '/dashboard/account-settings',
    icon: 'fas fa-unlock'
  }
]

const userLinks = [
  { title: 'Edit Profile', to: '/edit-profile' },
  { title: 'Check Status', to: '/check-status' }
]

const showLinks = ref(false)

const toggleLinks = () => {
  showLinks.value = !showLinks.value
}

const mini = computed(() => {
  return display.smAndDown.value || toggleMini.value
})

const navigate = (path) => {
  router.push(path)
}

const isActive = (path) => {
  return route.path === path || (path === '/dashboard' && route.path === '/dashboard/create-event')
}
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer v-model="sidebarMenu" :mini-variant="mini">
        <RouterLink to="/">
          <div class="px-2 flex justify-center items-center my-5">
            <!-- <img :src="logo" alt="" /> -->
            <p class="text-2xl font-bold capitalize">
              cb<span class="text-[#247b7b]">events</span>
            </p>
          </div>
        </RouterLink>      

        <v-list density="compact" nav>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            @click="navigate(item.route)"
            :class="{ 'v-list-item--active': isActive(item.route) }"
            link
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="font-bold">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="sidebarMenu = !sidebarMenu"
        ></v-app-bar-nav-icon>
        <Search />
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>fa-bell</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn text v-bind="props" @click="toggleLinks">
              <v-avatar size="32" class="mr-2">
                <v-img :src="`/images/${user.photo}`"></v-img>
              </v-avatar>
              <v-icon icon="fas fa-chevron-down" />
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(link, index) in userLinks" :key="index" :to="link.to">
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <LogoutUser />
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
