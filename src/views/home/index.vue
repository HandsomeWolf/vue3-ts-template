<script setup lang='ts'>
import chinaJson from '@/assets/GEOJSON/china.json'
import usaJson from '@/assets/GEOJSON/USA.json'
import DownloadChartButton from '@/components/echarts/DownloadChartButton.vue'
import DownloadDataButton from '@/components/echarts/DownloadDataButton.vue'
import LineChart from '@/components/echarts/LineChart.vue'
import PieChart from '@/components/echarts/PieChart.vue'
import { COLOR_SCHEMES } from '@/constants/echarts'
import { chinaEmissionsData, chinaPolicyScoreData, emissionsData, policyScoreData } from '@/mock'
import { exportToExcel } from '@/utils'
import { downloadChartAsImage } from '@/utils/echarts'
import {
  Edit,
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick, onMounted, ref } from 'vue'
import FeedbackForm from './components/FeedbackForm.vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
// 图表实例
let usaChart: echarts.ECharts | null = null
let chinaChart: echarts.ECharts | null = null

// 线图组件ref
const lineChartRef = ref<any>(null)
// 饼图组件ref
const pieChartRef = ref<any>(null)

// 图表配置选项
const usaMapOption = ref({})
const chinaMapOption = ref({})

// 弹窗，开始{

// 点击地图的弹窗
const mapInfoDialogVisible = ref(false)
const mapInfoDialogTitle = ref('')

// 点击更多的弹窗
const projectDetailDialogVisible = ref(false)
const currentProjectDetail = ref<{
  name?: string
  address?: string
  description?: string
  agencies?: string
  link?: string
  [key: string]: any
}>({})

// 选项卡
const mapTabsActive = ref('policyComprehensiveness')

// 选项卡1
const policyComprehensivenessTableData = ref([
  {
    country: 'Tom',
    jurisdiction: 'No. 189, Grove St, Los Angeles',
    yearEffective: 'N',
    policy: 'Y',
  },
])
// 选项卡2
const policyAmbitionScoreAndCorrespondingRankingTableData = ref([
  {
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])

// 选项卡3
const methaneEmissionsOverTimeForm = ref({
  totalEmission: '',
  emissionBySector: '',
})
const methaneEmissionsOverTimeTableData = ref([
  {
    name: 'Tom',
    source: 'No. 189, Grove St, Los Angeles',
    1990: 100,
    1991: 101,
    1992: 102,
    1993: 103,
    1994: 104,
    1995: 105,
    1996: 106,
    1997: 107,
    1998: 108,
    1999: 109,
    2000: 110,
  },
])

// select联动
function handleTotalEmissionChange(value: string) {
  if (value === 'emissionBySector') {
    methaneEmissionsOverTimeForm.value.emissionBySector = ''
  }
}

function handleMethaneEmissionsOverTimeSubmit() {
  console.log('handleMethaneEmissionsOverTimeSubmit')
}

// 选项卡4
const methaneEmissionsBySectorsTableData = ref([
  {
    name: 'Biomass/biofuel burning',
    year: '0.002456',
  },
  {
    name: 'Livestock',
    year: '0.045205',
  },
  {
    name: 'Fossil energy combustion',
    year: '0.036695',
  },
  {
    name: 'Landfills',
    year: '0.496842',
  },
  {
    name: 'Coal exploitation',
    year: '0.015967',
  },
  {
    name: 'Rice cultivation',
    year: '0',
  },
  {
    name: 'Wastewater',
    year: '0.021379',
  },
])

// 选项卡5
const policyAndPilotProjectsTableData = ref([
  {
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
// 搜索框
const policiesAndPilotProjectsForm = ref({
  user: '',
  region: '',
  date: '',
  policy: '',
})

function handlePoliciesAndPilotProjectsSubmit() {
  console.log('handlePoliciesAndPilotProjectsSubmit')
}

// 更多按钮点击事件
function handlePolicyAndPilotProjectsTableDataMoreClick(row: any) {
  console.warn('点击行:', row)
  currentProjectDetail.value = row
  projectDetailDialogVisible.value = true
}

// 下载表格数据TODO:
function downloadPolicyAndPilotProjectsData() {
  try {
    // 创建映射对象
    const fieldMapping: Record<string, string> = {
      name: 'Methane Mitigation/Utilization Amount',
      description: 'Project Description',
      agencies: 'Implementing Agencies',
      link: 'Link',
    }

    // 为address字段创建多个映射
    const repeatedFields = [
      'Jurisdiction',
      'Specific Location',
      'Latitude',
      'Longitude',
      'Country',
      'Continent',
      'Sector',
      'Focus',
      'Goal',
      'Government Partners',
      'Start Time',
      'End Time',
      'Project Status',
      'Federal/Central',
      'State/Province',
      'Local',
      'Private',
      'Other',
      'Funding Appropriation Status',
      'Funding Sources as Listed',
      'Cost',
      'Funding Gap',
      'Metrics',
      'Notes',
    ]

    // 准备导出数据
    const exportData = policyAndPilotProjectsTableData.value.map((item) => {
      // 创建一个导出对象
      const exportItem: Record<string, any> = {}

      // 添加基本字段
      if (item.name)
        exportItem['Methane Mitigation/Utilization Amount'] = item.name

      // 针对详情字段进行处理
      const rowWithDetails = item as {
        name: string
        address: string
        description?: string
        agencies?: string
        link?: string
      }

      if (rowWithDetails.description)
        exportItem['Project Description'] = rowWithDetails.description
      if (rowWithDetails.agencies)
        exportItem['Implementing Agencies'] = rowWithDetails.agencies
      if (rowWithDetails.link)
        exportItem.Link = rowWithDetails.link

      // 对address字段进行多重映射
      if (item.address) {
        repeatedFields.forEach((field) => {
          exportItem[field] = item.address
        })
      }

      return exportItem
    })

    // 导出到Excel
    exportToExcel(exportData, 'policies-and-projects', 'Policies and Projects')
  }
  catch (error: any) {
    console.error('Export failed:', error)
    ElMessage.error(`Export failed: ${error.message}`)
  }
}

// 选项卡6
const detailMapRef = ref<any>(null)
const detailMapOption = ref({})

// 初始化详细下钻地区地图
function initDetailMap(mapName: string, country: string) {
  // 确保DOM已经渲染
  nextTick(() => {
    // 设置当前地图名称
    currentDetailMapName.value = mapName

    // 根据国家和地区名称确定显示哪些点位
    if (country === 'usa') {
      projectPoints.value = usaProjectPoints.filter((point) => {
        // 这里筛选属于当前州的点位
        return point.name.includes(mapName)
      })
    }
    else if (country === 'china') {
      projectPoints.value = chinaProjectPoints.filter((point) => {
        // 筛选属于当前省份的点位
        return point.name.includes(mapName)
      })
    }
    else {
      projectPoints.value = []
    }

    // 模拟获取特定州或省的地图数据
    // 实际项目中应从API获取或使用预先准备好的地图数据
    // 这里为演示，我们提取GeoJSON中该州/省的特定Feature
    let stateFeature = null
    let mapJsonData = null

    if (country === 'usa') {
      // 从美国地图中找到对应的州
      stateFeature = usaJson.features.find(feature => feature.properties.name === mapName)
      if (stateFeature) {
        // 创建新的GeoJSON对象，只包含该州的feature
        mapJsonData = {
          type: 'FeatureCollection',
          features: [stateFeature],
        }
      }
      else {
        console.error(`未找到州: ${mapName}`)
        mapJsonData = {
          type: 'FeatureCollection',
          features: [],
        }
      }
    }
    else if (country === 'china') {
      // 从中国地图中找到对应的省
      stateFeature = chinaJson.features.find(feature => feature.properties.name === mapName)
      if (stateFeature) {
        // 创建新的GeoJSON对象，只包含该省的feature
        mapJsonData = {
          type: 'FeatureCollection',
          features: [stateFeature],
        }
      }
      else {
        console.error(`未找到省: ${mapName}`)
        mapJsonData = {
          type: 'FeatureCollection',
          features: [],
        }
      }
    }

    // 注册地图
    if (mapJsonData && mapJsonData.features.length > 0) {
      try {
        echarts.registerMap(mapName, mapJsonData as any)

        // 创建地图配置
        const option = {
          backgroundColor: '#ffffff',
          tooltip: {
            trigger: 'item',
            formatter(params: any) {
              if (params.componentSubType === 'effectScatter') {
                return `<b>${params.name}</b><br/>
                        ${params.data.description}<br/>
                        经度: ${params.data.longitude}<br/>
                        纬度: ${params.data.latitude}<br/>
                        减排量: ${params.data.value[2]} 千吨`
              }
              return params.name
            },
          },
          visualMap: {
            show: false,
            min: 0,
            max: 50,
            inRange: {
              color: ['#FFC65D', '#FF9853', '#FF7B52', '#FF4C52'],
            },
          },
          series: [
            {
              name: '地区',
              type: 'map',
              map: mapName,
              roam: true,
              label: {
                show: true,
                fontSize: 10,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 12,
                  fontWeight: 'bold',
                },
                itemStyle: {
                  areaColor: '#e6f7ff',
                },
              },
              select: {
                disabled: true,
              },
              itemStyle: {
                areaColor: '#f3f3f3',
                borderColor: '#999',
              },
              data: [],
            },
            {
              name: '项目位置',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: projectPoints.value.map(point => ({
                name: point.name,
                value: [point.longitude, point.latitude, point.value],
                description: point.description,
              })),
              symbolSize(val: any) {
                return val[2] / 3 + 12
              },
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke',
              },
              hoverAnimation: true,
              itemStyle: {
                color: '#ff4c52',
                shadowBlur: 10,
                shadowColor: '#333',
              },
              zlevel: 1,
            },
          ],
        }

        // 设置图表选项
        detailMapOption.value = option

        // 确保图表已渲染并更新
        nextTick(() => {
          if (detailMapRef.value && detailMapRef.value.chart) {
            detailMapRef.value.chart.setOption(option, true)
          }
        })
      }
      catch (error) {
        console.error('地图注册或设置失败:', error)
      }
    }
    else {
      console.warn(`无法为 ${mapName} 加载地图数据`)

      // 创建备用地图显示
      const option = {
        backgroundColor: '#ffffff',
        series: [],
      }

      detailMapOption.value = option

      nextTick(() => {
        if (detailMapRef.value && detailMapRef.value.chart) {
          detailMapRef.value.chart.setOption(option, true)
        }
      })
    }
  })
}
// 定义地区地图和坐标点数据
const currentDetailMapName = ref('')
const projectPoints = ref<any[]>([])

// 模拟项目点位信息（实际项目中应从API获取）
const usaProjectPoints = [
  { name: 'California Solar Project', longitude: -119.4179, latitude: 36.7783, description: '太阳能发电项目，减少甲烷排放', value: 35 },
  { name: 'California Wind Project', longitude: -121.4944, latitude: 38.5816, description: '风能发电项目，替代化石燃料', value: 28 },
  { name: 'Texas Wind Farm', longitude: -99.9018, latitude: 31.9686, description: '风能发电场，减少化石燃料使用', value: 42 },
  { name: 'Texas Oil Capture', longitude: -97.7431, latitude: 30.2672, description: '石油开采甲烷捕获项目', value: 38 },
  { name: 'New York Waste Management', longitude: -73.9352, latitude: 40.7306, description: '垃圾处理项目，减少填埋场甲烷排放', value: 28 },
  { name: 'New York Landfill Gas', longitude: -74.0060, latitude: 40.7128, description: '填埋场气体收集与利用', value: 25 },
  { name: 'Colorado Natural Gas Capture', longitude: -105.7821, latitude: 39.5501, description: '天然气捕获项目', value: 23 },
  { name: 'Colorado Methane Reduction', longitude: -104.9903, latitude: 39.7392, description: '甲烷减排综合项目', value: 19 },
]

const chinaProjectPoints = [
  { name: '北京市生物质能源项目', longitude: 116.4074, latitude: 39.9042, description: '生物质能源转换项目', value: 25 },
  { name: '北京市垃圾填埋气回收', longitude: 116.2363, latitude: 39.8343, description: '垃圾填埋场甲烷回收利用', value: 22 },
  { name: '四川省沼气利用工程', longitude: 104.0665, latitude: 30.6598, description: '农村沼气利用减排项目', value: 38 },
  { name: '四川省畜牧业减排', longitude: 103.7558, latitude: 29.6136, description: '畜牧业甲烷减排项目', value: 33 },
  { name: '上海市垃圾分类处理', longitude: 121.4737, latitude: 31.2304, description: '城市垃圾分类与甲烷回收', value: 31 },
  { name: '上海市工业废水处理', longitude: 121.5574, latitude: 31.0449, description: '工业废水处理减少甲烷排放', value: 27 },
  { name: '广东省畜牧业减排项目', longitude: 113.2644, latitude: 23.1291, description: '畜牧业甲烷捕获与利用', value: 29 },
  { name: '广东省天然气利用项目', longitude: 114.0579, latitude: 22.5431, description: '天然气替代煤炭清洁能源项目', value: 32 },
]

// 显示州或省份详情
function showStateDetails(name: string, country: string) {
  mapInfoDialogTitle.value = `${name}`
  mapInfoDialogVisible.value = true

  // 根据不同国家和地区加载对应数据
  if (country === 'usa') {
    // 加载美国数据
  }
  else if (country === 'china') {
    // 加载中国数据
  }

  // 初始化详细地图
  initDetailMap(name, country)
}

// 弹窗，结束}

// 反馈表单引用
const feedbackFormRef = ref<InstanceType<typeof FeedbackForm> | null>(null)

// 处理反馈按钮点击
function handleFeedbackClick() {
  feedbackFormRef.value?.showFeedbackDialog()
}

// 切换地图数据源
const dataSources = ref('')

// 标题的数据，便于重用
const mapTitles: Record<string, { usa: string, china: string }> = {
  default: {
    usa: 'United States',
    china: 'China',
  },
  1: {
    usa: 'Total methane emissions by state in 2022',
    china: 'Total methane emissions by province in 2022',
  },
  2: {
    usa: 'Strength of policy objectives scores for each state',
    china: 'Policy ambition scores for each province',
  },
}

// 初始化页面地图
function initMap() {
  // 创建图表实例
  usaChart = echarts.init(document.getElementById('usa-map'))
  chinaChart = echarts.init(document.getElementById('china-map'))

  updateChinaMap()
  updateUSAMap()
}

// 页面地图切换数据
function handleUpdateMapChange(value?: string) {
  updateUSAMap(value)
  updateChinaMap(value)
}

// 美国地图更新函数
function updateUSAMap(value?: string) {
  // 使用类型断言转换为echarts所需的GeoJSON格式
  const convertedUSAJson = {
    type: 'FeatureCollection' as const,
    features: usaJson.features,
  }

  echarts.registerMap('USA', convertedUSAJson as any, {
    'Alaska': {
      left: -131,
      top: 25,
      width: 15,
    },
    'Hawaii': {
      left: -110,
      top: 28,
      width: 5,
    },
    'Puerto Rico': {
      left: -76,
      top: 26,
      width: 2,
    },
  })

  let title: string
  let colorScheme: string[]
  let dataRange: number[]
  let mapData: any[] = []

  if (value === '1') {
    title = 'Total methane emissions by state in 2022'
    colorScheme = COLOR_SCHEMES.EMISSIONS
    dataRange = [300, 35000]
    mapData = emissionsData
  }
  else if (value === '2') {
    title = 'Strength of policy objectives scores for each state'
    colorScheme = COLOR_SCHEMES.POLICY
    dataRange = [0, 100]
    mapData = policyScoreData
  }
  else {
    title = 'USA'
    colorScheme = ['#e0e0e0']
    dataRange = [0, 100]
    mapData = []
  }

  const option = {
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter(params: any) {
        if (!params.value)
          return `${params.name}: No data yet`
        return `${params.name}: ${params.value}${value === '1' ? ' thousand tons' : ' point'}`
      },
    },
    visualMap: {
      left: 'right',
      min: dataRange[0],
      max: dataRange[1],
      inRange: {
        color: colorScheme,
      },
      text: ['高', '低'],
      calculable: true,
      show: value !== '0',
    },
    series: [
      {
        name: '数据',
        type: 'map',
        roam: true,
        map: 'USA',
        label: {
          show: true,
          fontSize: 8,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold',
          },
          itemStyle: {
            areaColor: '#e6f7ff',
          },
        },
        select: {
          disabled: true,
        },
        data: mapData,
      },
    ],
  }

  // 添加点击事件
  if (usaChart) {
    usaChart.off('click')
    usaChart.on('click', (params: any) => {
      showStateDetails(params.name, 'usa')
    })

    usaChart.setOption(option)
    // 更新VChart选项
    usaMapOption.value = option
  }
}

// 中国地图更新函数
function updateChinaMap(value?: string) {
  // 使用类型断言转换为echarts所需的GeoJSON格式
  const convertedChinaJson = {
    type: 'FeatureCollection' as const,
    features: chinaJson.features,
  }

  echarts.registerMap('China', convertedChinaJson as any)

  let title: string
  let colorScheme: string[]
  let dataRange: number[]
  let mapData: any[] = []

  if (value === '1') {
    title = 'Total methane emissions by province in 2022'
    colorScheme = COLOR_SCHEMES.EMISSIONS
    dataRange = [1000, 28000]
    mapData = chinaEmissionsData
  }
  else if (value === '2') {
    title = 'Policy ambition scores for each province'
    colorScheme = COLOR_SCHEMES.POLICY
    dataRange = [30, 95]
    mapData = chinaPolicyScoreData
  }
  else {
    title = 'China'
    colorScheme = ['#e0e0e0']
    dataRange = [0, 100]
    mapData = []
  }

  const option = {
    backgroundColor: '#ffffff',
    tooltip: {
      trigger: 'item',
      formatter(params: any) {
        if (!params.value && params.value !== 0)
          return `${params.name}: No data yet`
        return `${params.name}: ${params.value}${value === '1' ? ' thousand tons' : ' point'}`
      },
    },
    visualMap: {
      left: 'right',
      min: dataRange[0],
      max: dataRange[1],
      inRange: {
        color: colorScheme,
      },
      text: ['高', '低'],
      calculable: true,
      show: value !== '0',
    },
    series: [
      {
        name: '数据',
        type: 'map',
        map: 'China',
        roam: true,
        label: {
          show: true,
          fontSize: 8,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold',
          },
          itemStyle: {
            areaColor: '#e6f7ff',
          },
        },
        select: {
          disabled: true,
        },
        data: mapData,
      },
    ],
  }

  // 确保图表实例存在
  if (chinaChart) {
    // 清除之前的配置
    chinaChart.clear()

    // 设置新的配置
    chinaChart.setOption(option, true)
    // 更新VChart选项
    chinaMapOption.value = option

    // 添加点击事件
    chinaChart.off('click')
    chinaChart.on('click', (params: any) => {
      console.warn('点击省份:', params.name)
      showStateDetails(params.name, 'china')
    })
  }
}

onMounted(() => {
  initMap()
})

// 折线图数据
const lineChartData = {
  years: ['2018', '2019', '2020', '2021', '2022'],
  values: [273.717, 289.451, 265.332, 301.245, 320.189],
}

// 通用图表下载方法
function downloadEchartsImage(chartRef: any, filename: string, backgroundColor: string = '#fcdddf') {
  if (chartRef.value) {
    const chartInstance = chartRef.value.getChartInstance()
    if (chartInstance) {
      downloadChartAsImage(chartInstance, filename, backgroundColor)
    }
    else {
      ElMessage.warning('无法获取图表实例')
    }
  }
  else {
    ElMessage.warning('无法获取图表组件')
  }
}

function downloadChart() {
  downloadEchartsImage(lineChartRef, 'methane-emissions')
}

function downloadChartData() {
  // 调用后台接口下载数据
  ElMessageBox.confirm(
    '确定要下载图表数据吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    },
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '数据下载请求已发送',
      })
    })
    .catch(() => {
      // 用户取消下载
    })
}

function downloadPieChart() {
  downloadEchartsImage(pieChartRef, 'methane-emissions-by-sector')
}

function downloadPieChartData() {
  ElMessageBox.confirm(
    '确定要下载饼图数据吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    },
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '饼图数据下载请求已发送',
      })
    })
    .catch(() => {
      // 用户取消下载
    })
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <Header />
      <el-main>
        <div class="main-container">
          <div class="dashboard-header">
            <h2 class="dashboard-title">
              Interactive Maps
            </h2>
            <div class="dashboard-controls">
              <el-select
                v-model="dataSources" clearable placeholder="Select Data to Display"
                class="data-select" @change="handleUpdateMapChange"
              >
                <el-option label="Total Emissions Data" value="1" />
                <el-option label="Policy Ambition Scores" value="2" />
              </el-select>
              <div v-if="dataSources" class="dashboard-legend">
                <div class="legend-title">
                  {{ dataSources === '1' ? 'Emissions Level' : 'Policy Score' }}
                </div>
                <div
                  class="legend-gradient"
                  :class="{ 'emissions-gradient': dataSources === '1', 'policy-gradient': dataSources === '2' }"
                />
                <div class="legend-labels">
                  <span>{{ dataSources === '1' ? 'Low' : 'Weak' }}</span>
                  <span>{{ dataSources === '1' ? 'High' : 'Strong' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="maps-container">
            <div class="map-card">
              <div class="map-card-header">
                <h3 class="map-card-title">
                  {{ dataSources ? mapTitles[dataSources].usa
                    : mapTitles.default.usa }}
                </h3>
                <div v-if="dataSources === '1'" class="map-card-subtitle">
                  Methane emissions in thousand
                  tons
                </div>
                <div v-else-if="dataSources === '2'" class="map-card-subtitle">
                  Score out of 100 points
                </div>
              </div>
              <div class="map-card-body">
                <VChart id="usa-map" class="map-chart usa-map" :option="usaMapOption" autoresize />
              </div>
              <div class="map-card-footer">
                <div class="map-info">
                  Click on a state to view detailed information
                </div>
              </div>
            </div>

            <div class="map-card">
              <div class="map-card-header">
                <h3 class="map-card-title">
                  {{ dataSources ? mapTitles[dataSources].china
                    : mapTitles.default.china }}
                </h3>
                <div v-if="dataSources === '1'" class="map-card-subtitle">
                  Methane emissions in thousand
                  tons
                </div>
                <div v-else-if="dataSources === '2'" class="map-card-subtitle">
                  Score out of 100 points
                </div>
              </div>
              <div class="map-card-body">
                <VChart
                  id="china-map" class="map-chart china-map" :option="chinaMapOption"
                  autoresize
                />
              </div>
              <div class="map-card-footer">
                <div class="map-info">
                  Click on a province to view detailed information
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      <Footer />
    </el-container>
  </div>

  <el-button class="feedback-btn" type="primary" :icon="Edit" circle @click="handleFeedbackClick" />

  <!-- 反馈表单组件 -->
  <FeedbackForm ref="feedbackFormRef" />

  <!-- 点击地图的弹窗 -->
  <el-dialog v-model="mapInfoDialogVisible" :title="mapInfoDialogTitle" width="1000" draggable>
    <el-tabs v-model="mapTabsActive" class="map-tabs">
      <el-tab-pane label="policy comprehensiveness" name="policyComprehensiveness">
        <el-table :data="policyComprehensivenessTableData" border style="width: 100%">
          <el-table-column prop="jurisdiction" label="Jurisdiction" width="180" />
          <el-table-column prop="country" label="Country" width="180" />
          <el-table-column prop="yearEffective" label="Year Effective" width="180" />
          <el-table-column prop="policy" label="Policy" width="180" />
          <el-table-column prop="country" label="Type of Instrument" width="180" />
          <el-table-column prop="yearEffective" label="Cross-sectoral coordination (F)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="yearEffective" label="Policy instruments (F)" width="180">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Evaluation and adjustment (S)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Stakeholder engagement (S)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Stringency (F)" width="180">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Enforceability (F)" width="180">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Emission source coverage (S)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Monitoring protocols (S)" width="200">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Total Policy Score" width="180" />
          <el-table-column prop="country" label="Comprehensiveness Score" width="220" />
          <el-table-column prop="country" label="Ambition Score" width="180" />
          <el-table-column prop="country" label="Link" width="180" />
          <el-table-column prop="country" label="Policy Description" width="180" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        label="Policy ambition score and corresponding ranking"
        name="policyAmbitionScoreAndCorrespondingRanking"
      >
        <el-table :data="policyAmbitionScoreAndCorrespondingRankingTableData" border style="width: 100%">
          <el-table-column prop="name" label="name" width="120" />
          <el-table-column prop="address" label="Total_Policy_Score" />
          <el-table-column prop="address" label="Comprehensiveness_Score" width="260" />
          <el-table-column prop="address" label="Ambition_Score" />
        </el-table>
        <div class="remark">
          Data Provided by CCCI
        </div>
      </el-tab-pane>
      <el-tab-pane label="methane emissions over time" name="methaneEmissionsOverTime">
        <!-- 表单与下载左右对齐 -->
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form :inline="true" :model="methaneEmissionsOverTimeForm" class="demo-form-inline">
              <el-form-item>
                <el-select
                  v-model="methaneEmissionsOverTimeForm.totalEmission"
                  placeholder="total emission" style="width: 240px"
                  @change="handleTotalEmissionChange"
                >
                  <el-option label="total emission" value="totalEmission" />
                  <el-option label="emission by sector" value="emissionBySector" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-if="methaneEmissionsOverTimeForm.totalEmission === 'emissionBySector'"
                  v-model="methaneEmissionsOverTimeForm.emissionBySector"
                  placeholder="emission by sector" style="width: 240px"
                >
                  <el-option label="Biomass/biofuel burning" value="Biomass/biofuel burning" />
                  <el-option label="Coal exploitation" value="Coal exploitation" />
                  <el-option label="Fossil energy combustion" value="Fossil energy combustion" />
                  <el-option label="Landfills" value="Landfills" />
                  <el-option label="Livestock" value="Livestock" />
                  <el-option label="Oil&Gas exploitation" value="Oil&Gas exploitation" />
                  <el-option label="Rice cultivation" value="Rice cultivation" />
                  <el-option label="Wastewater" value="Wastewater" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleMethaneEmissionsOverTimeSubmit">
                  Query
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="9">
            <div class="chart-actions">
              <DownloadChartButton :on-click="downloadChart" label="Download chart" />
              <DownloadDataButton :on-click="downloadChartData" label="Download data" />
            </div>
          </el-col>
        </el-row>
        <div id="line-chart" class="chart">
          <LineChart ref="lineChartRef" :chart-data="lineChartData" />
        </div>
        <el-table :data="methaneEmissionsOverTimeTableData" border style="width: 100%">
          <el-table-column prop="name" label="name" width="180" />
          <el-table-column prop="source" label="Source" />
          <el-table-column prop="1990" label="1990" />
          <el-table-column prop="1991" label="1991" />
          <el-table-column prop="1992" label="1992" />
          <el-table-column prop="1993" label="1993" />
          <el-table-column prop="1994" label="1994" />
          <el-table-column prop="1995" label="1995" />
          <el-table-column prop="1996" label="1996" />
          <el-table-column prop="1997" label="1997" />
          <el-table-column prop="1998" label="1998" />
          <el-table-column prop="1999" label="1999" />
          <el-table-column prop="2000" label="2000" />
        </el-table>

        <div class="remark">
          Data Provided by xxx
        </div>
      </el-tab-pane>
      <el-tab-pane label="methane emissions (by sectors)" name="methaneEmissionsBySectors">
        <div class="chart-actions">
          <DownloadChartButton :on-click="downloadPieChart" label="Download chart" />
          <DownloadDataButton :on-click="downloadPieChartData" label="Download data" />
        </div>

        <div id="pie-chart" class="chart">
          <PieChart ref="pieChartRef" :chart-data="methaneEmissionsBySectorsTableData" />
        </div>

        <el-table :data="methaneEmissionsBySectorsTableData" border style="width: 100%">
          <el-table-column prop="name" label="Source" width="500" />
          <el-table-column prop="year" label="2022" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="policies and pilot projects" name="policiesAndPilotProjects">
        <el-form :inline="true" :model="policiesAndPilotProjectsForm" class="demo-form-inline">
          <el-form-item style="width: 310px">
            <el-input v-model="policiesAndPilotProjectsForm.user" placeholder="Jurisdiction" clearable />
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select v-model="policiesAndPilotProjectsForm.region" placeholder="Sectors" clearable>
              <el-option label="Agriculture" value="Agriculture" />
              <el-option label="AAAA" value="AAAA" />
              <el-option label="BBBB" value="BBBB" />
              <el-option label="CCCC" value="CCCC" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="policiesAndPilotProjectsForm.date" range-separator="To"
              start-placeholder="Start year" end-placeholder="End year" type="yearrange"
              placeholder="Year" clearable
            />
          </el-form-item>
          <el-form-item style="width: 310px">
            <el-input v-model="policiesAndPilotProjectsForm.policy" placeholder="Policy" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePoliciesAndPilotProjectsSubmit">
              Query
            </el-button>
            <DownloadDataButton :on-click="downloadPolicyAndPilotProjectsData" label="Download" />
          </el-form-item>
        </el-form>
        <el-table :data="policyAndPilotProjectsTableData" border style="width: 100%">
          <el-table-column prop="address" label="Jurisdiction" width="200" />
          <el-table-column prop="address" label="Specific Location" width="200" />
          <el-table-column prop="address" label="Latitude" width="200" />
          <el-table-column prop="address" label="Longitude" width="200" />
          <el-table-column prop="address" label="Country" width="200" />
          <el-table-column prop="address" label="Continent" width="200" />
          <el-table-column prop="address" label="Sector" width="200" />
          <el-table-column prop="address" label="Focus" width="200" />
          <!-- <el-table-column prop="address" label="Project Description" width="200" /> -->
          <el-table-column prop="address" label="Goal" width="200" />
          <el-table-column prop="name" label="Methane Mitigation/Utilization Amount" width="300" />
          <!-- <el-table-column prop="address" label="Implementing Agencies" width="200" /> -->
          <el-table-column prop="address" label="Government Partners" width="200" />
          <!-- <el-table-column prop="address" label="Link" width="200" /> -->
          <el-table-column prop="address" label="Start Time" width="120" />
          <el-table-column prop="address" label="End Time" width="120" />
          <el-table-column prop="address" label="Project Status" width="120" />
          <el-table-column prop="address" label="Federal/Central" width="180" />
          <el-table-column prop="address" label="State/Province" width="180" />
          <el-table-column prop="address" label="Local" width="120" />
          <el-table-column prop="address" label="Private" width="120" />
          <el-table-column prop="address" label="Other" width="120" />
          <el-table-column prop="address" label="Funding Appropriation Status" width="300" />
          <el-table-column prop="address" label="Funding Sources as Listed" width="300" />
          <el-table-column prop="address" label="Cost" width="120" />
          <el-table-column prop="address" label="Funding Gap" width="180" />
          <el-table-column prop="address" label="Metrics" width="120" />
          <el-table-column prop="address" label="Notes" width="300" />
          <el-table-column label="Operation" width="120" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                type="default" size="small"
                @click="handlePolicyAndPilotProjectsTableDataMoreClick(row)"
              >
                View More
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="Pilot Project Positioning Map" name="pilotProjectPositioningMap">
        <div class="detail-map-container">
          <div class="map-description">
            以下地图显示了 <strong>{{ currentDetailMapName }}</strong>
            区域的甲烷减排项目分布情况，每个标记点代表一个项目位置。鼠标悬停在标记点上可查看详细信息。
          </div>
          <div v-if="projectPoints.length > 0" class="detail-map-info">
            该区域共有 <strong>{{ projectPoints.length }}</strong> 个减排项目，总减排量：
            <strong>{{ projectPoints.reduce((sum, point) => sum + point.value, 0) }}</strong> 千吨
          </div>
          <VChart ref="detailMapRef" class="detail-map" :option="detailMapOption" autoresize />

          <div v-if="projectPoints.length > 0" class="point-list">
            <h3>项目列表</h3>
            <el-table :data="projectPoints" border style="width: 100%">
              <el-table-column prop="name" label="项目名称" />
              <el-table-column prop="description" label="项目描述" />
              <el-table-column prop="longitude" label="经度" width="100" />
              <el-table-column prop="latitude" label="纬度" width="100" />
              <el-table-column prop="value" label="减排量(千吨)" width="120" />
            </el-table>
          </div>
          <div v-else class="no-data">
            当前区域暂无项目数据
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <!-- 项目详情弹窗 -->
  <el-dialog v-model="projectDetailDialogVisible" title="Project Details" width="700" draggable>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Project Description">
        {{ currentProjectDetail.description || 'No description available' }}
      </el-descriptions-item>
      <el-descriptions-item label="Implementing Agencies">
        {{ currentProjectDetail.agencies || 'No implementing agencies information available' }}
      </el-descriptions-item>
      <el-descriptions-item label="Link">
        <a v-if="currentProjectDetail.link" :href="currentProjectDetail.link" target="_blank">
          {{ currentProjectDetail.link }}
        </a>
        <span v-else>No link available</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<style lang='scss' scoped>
.common-layout {
    background-color: #f9fbfd;
    min-height: 100vh;
}

.el-main {
    padding: 30px;

    .el-select {
        margin-bottom: 20px;
        width: 200px;
    }

    .el-row {
        margin-bottom: 20px;
    }
}

.map-chart {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
}

.map-title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
}

.feedback-btn {
    position: fixed;
    right: 25px;
    bottom: 25px;
    z-index: 999;
    width: 50px;
    height: 50px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
}

::v-deep(.el-footer) {
    height: auto;
}

::v-deep(.el-header) {
    height: auto;
}

.remark {
    margin-top: 15px;
    font-size: 13px;
    color: #909399;
    font-style: italic;
}

.chart {
    border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chart-actions {
  margin-bottom: 15px;
  text-align: right;

  .el-button {
    margin-left: 10px;
  }
}

// 对话框样式优化
.el-dialog {
  border-radius: 8px;
  overflow: hidden;

  .el-dialog__header {
    padding: 20px;
    background-color: #f5f7fa;
  }

  .el-dialog__title {
    font-weight: bold;
    color: #303133;
  }

  .el-dialog__body {
    padding: 25px;
  }
}

// 标签页样式
.map-tabs {
  .el-tabs__header {
    margin-bottom: 20px;
  }

  .el-tabs__item {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }

  .el-tab-pane {
    padding: 10px 0;
  }
}

// 表格样式优化
.el-table {
  margin-top: 15px;
  border-radius: 8px;
  overflow: hidden;

  .el-table__header th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: bold;
  }

  .el-button--small {
    padding: 8px 15px;
  }
}

// 详细地图容器样式
.detail-map {
  width: 100%;
  height: 550px;
  border-radius: 8px;
}

.detail-map-container {
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.map-description {
  margin-bottom: 20px;
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
}

.point-list {
  margin-top: 30px;

  h3 {
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: bold;
    color: #303133;
    border-left: 4px solid #409EFF;
    padding-left: 10px;
  }
}

.no-data {
  text-align: center;
  margin: 40px 0;
  color: #909399;
  font-size: 16px;
}

.detail-map-info {
  background-color: #f0f9ff;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
  font-size: 15px;
  line-height: 1.5;

  strong {
    color: #1890ff;
  }
}

// 改进表单样式
.el-form {
  &.demo-form-inline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;

    .el-form-item {
      margin-bottom: 10px;
      margin-right: 0;
    }
  }
}

// 自定义组件样式
:deep(.el-collapse) {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;
  border: 1px solid #e4e7ed;

  .el-collapse-item__header {
    padding: 0 20px;
    font-weight: bold;
  }

  .el-collapse-item__content {
    padding: 15px 20px;
  }
}

.main-container {
  max-width: 1440px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.dashboard-title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 3px;
    background-color: #409EFF;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
}

.dashboard-controls {
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

.data-select {
  width: 240px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.dashboard-legend {
  display: flex;
  flex-direction: column;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.legend-title {
  font-size: 14px;
  margin-bottom: 5px;
  color: #606266;
}

.legend-gradient {
  height: 8px;
  border-radius: 4px;
  margin-bottom: 4px;

  &.emissions-gradient {
    background: linear-gradient(to right, #FFC65D, #FF9853, #FF7B52, #FF4C52);
  }

  &.policy-gradient {
    background: linear-gradient(to right, #b8e994, #78e08f, #38ada9, #079992);
  }
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.maps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
}

.map-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.map-card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f2f5;
}

.map-card-title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.map-card-subtitle {
  font-size: 13px;
  color: #909399;
}

.map-card-body {
  padding: 0;
  flex: 1;
  min-height: 400px;
}

.map-card-footer {
  padding: 12px 24px;
  border-top: 1px solid #f0f2f5;
  background-color: #fafafa;
}

.map-info {
  font-size: 13px;
  color: #606266;
  display: flex;
  align-items: center;

  &::before {
    content: 'ℹ️';
    margin-right: 6px;
    font-size: 14px;
  }
}

.map-chart {
  width: 100%;
  height: 450px;
  border-radius: 0;
  box-shadow: none;

  &:hover {
    box-shadow: none;
  }
}

.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.summary-card {
  background-color: #f9fbfd;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  gap: 20px;
  border-left: 4px solid #409EFF;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f7ff;
  }
}

.summary-icon {
  font-size: 24px;
  color: #409EFF;
  padding-top: 4px;
}

.summary-content {
  flex: 1;
}

.summary-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.summary-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

::v-deep(.el-container){
    flex-direction: column;
}
</style>
