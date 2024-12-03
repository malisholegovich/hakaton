import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'


import { loadFonts } from './plugins/webfontloader'
import router from './router';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
loadFonts()

createApp(App)
  .use(vuetify)
    .use(router)
    .use(VCalendar)
  .mount('#app')
