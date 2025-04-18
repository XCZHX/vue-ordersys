import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/iconfont.css'
import './assets/css/iconfont.js'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')
