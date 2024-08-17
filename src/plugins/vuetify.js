import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Global CSS

// Import Vuetify components and directives
import { VApp, VAppBar, VBtn, VIcon, VList, VListItem, VListItemContent, VListItemTitle, VListItemAction, VNavigationDrawer, VMain, VContainer, VDivider } from 'vuetify/components';

// Create and configure Vuetify instance
const vuetify = createVuetify({
  components: {
    VApp,
    VAppBar,
    VBtn,
    VIcon,
    VList,
    VListItem,
    VListItemContent,
    VListItemTitle,
    VListItemAction,
    VNavigationDrawer,
    VMain,
    VContainer,
    VDivider
  },
  directives: {},
});

export default vuetify;
