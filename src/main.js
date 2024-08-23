import { createApp } from 'vue';
import { createPinia } from 'pinia';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';

// Import MDI font CSS
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',  // Set the default icon set to mdi
    sets: {
      mdi,  // Import mdi icons
    },
  },
});

import App from './App.vue';
import router from './router';
import Preloader from './components/Preloader.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.component('Preloader', Preloader);

app.mount('#app');
