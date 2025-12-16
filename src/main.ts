import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import router from "./router";
import { useProfile } from "./composables/useProfile";

const app = createApp(App)
app.use(Antd)
app.use(router)

// Initialize profile from local storage
const { init } = useProfile();
init();

app.mount('#app')
