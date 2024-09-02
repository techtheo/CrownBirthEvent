import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import Preloader from './components/Preloader.vue';
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";


// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';
// import '@mobiscroll/vue/dist/css/mobiscroll.min.css';
// import { MbscDatepicker } from '@mobiscroll/vue';


// Import MDI font CSS
import '@mdi/font/css/materialdesignicons.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'


import App from './App.vue';
import router from './router';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
library.add(fas) // Include needed solid icons
library.add(far) // Include needed regular icons


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

app.use(ToastPlugin);
app.use(VueAwesomePaginate);
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.component('Preloader', Preloader);

app.mount('#app');
