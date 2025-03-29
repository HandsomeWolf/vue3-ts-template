import dayjs from 'dayjs'
import {
  BarChart,
  CustomChart,
  HeatmapChart,
  LineChart,
  LinesChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
} from 'echarts/charts'
import {
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  GeoComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import {
  CanvasRenderer,
} from 'echarts/renderers'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
import ECharts from 'vue-echarts'
import App from './App.vue'
import router from './router'
import { store } from './stores/index'
import 'dayjs/locale/zh-cn'
import './styles/index.scss'
import 'element-plus/dist/index.css'

dayjs.locale('zh-cn')

use([
  SankeyChart,
  LinesChart,
  VisualMapComponent,
  PictorialBarChart,
  GraphicComponent,
  HeatmapChart,
  GeoComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  RadarChart,
  CustomChart,
  LineChart,
  ScatterChart,
  LegendComponent,
  CanvasRenderer,
  BarChart,
  GridComponent,
  PieChart,
  TooltipComponent,
  TitleComponent,
])

const app = createApp(App)

app.component('VChart', ECharts)

app.use(router)
app.use(store)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
