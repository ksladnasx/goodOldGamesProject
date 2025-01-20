import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
// import Title from './views/title.vue';

const app = createApp(App)
// app.component('Title', Title);
app.use(createPinia())
app.use(router)
app.mount('#app')