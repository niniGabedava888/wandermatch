import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'
import router from './router'

library.add(
  solidIcons.faUserCircle,
  solidIcons.faPlaneDeparture,
  solidIcons.faHourglassHalf,
  solidIcons.faCheckCircle,
  solidIcons.faMapLocationDot,
  solidIcons.faSearch,
  solidIcons.faX,
  solidIcons.faArrowRight,
  solidIcons.faLocationDot,
)
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
