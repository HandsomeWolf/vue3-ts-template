import dayjs from 'dayjs'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './stores/index'
import 'dayjs/locale/zh-cn'
import 'element-plus/dist/index.css'

dayjs.locale('zh-cn')

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
