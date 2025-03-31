<script setup lang='ts'>
import chinaJson from '@/assets/GEOJSON/china.json'
import usaJson from '@/assets/GEOJSON/USA.json'
import { COLOR_SCHEMES } from '@/constants/echarts'
import { chinaEmissionsData, chinaPolicyScoreData, emissionsData, policyScoreData } from '@/mock'
import {
  Edit,
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import FeedbackForm from './components/FeedbackForm.vue'
import Footer from './components/Footer.vue'
import Header from './components/header/index.vue'
import MethaneEmissionsBySectors from './components/tabs/MethaneEmissionsBySectors.vue'
import MethaneEmissionsOverTime from './components/tabs/MethaneEmissionsOverTime.vue'
import PilotProjectMap from './components/tabs/PilotProjectMap.vue'
import PoliciesAndPilotProjects from './components/tabs/PoliciesAndPilotProjects.vue'
import PolicyAmbitionScore from './components/tabs/PolicyAmbitionScore.vue'
import PolicyComprehensiveness from './components/tabs/PolicyComprehensiveness.vue'
// 图表实例
let usaChart: echarts.ECharts | null = null
let chinaChart: echarts.ECharts | null = null

// 图表配置选项
const usaMapOption = ref({})
const chinaMapOption = ref({})

// 点击地图的弹窗
const mapInfoDialogVisible = ref(false)
const mapInfoDialogTitle = ref('')

// 选项卡
const mapTabsActive = ref('policyComprehensiveness')

// 当前选中的地区和国家（用于传递给 PilotProjectMap 组件）
const currentSelectedRegion = ref('')
const currentSelectedCountry = ref('usa')

// 显示州或省份详情
function showStateDetails(name: string, country: string) {
  mapInfoDialogTitle.value = `${name}`
  mapInfoDialogVisible.value = true

  // 设置当前选中的地区和国家，用于地图组件
  currentSelectedRegion.value = name
  currentSelectedCountry.value = country

  // 根据不同国家和地区加载对应数据
  if (country === 'usa') {
    // 加载美国数据
  }
  else if (country === 'china') {
    // 加载中国数据
  }
}

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

// 窗口宽度监听
const windowWidth = ref(window.innerWidth)

// 监听窗口大小变化
function handleResize() {
  windowWidth.value = window.innerWidth
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

  let colorScheme: string[]
  let dataRange: number[]
  let mapData: any[] = []

  if (value === '1') {
    colorScheme = COLOR_SCHEMES.EMISSIONS
    dataRange = [300, 35000]
    mapData = emissionsData
  }
  else if (value === '2') {
    colorScheme = COLOR_SCHEMES.POLICY
    dataRange = [0, 100]
    mapData = policyScoreData
  }
  else {
    colorScheme = ['#e0e0e0']
    dataRange = [0, 100]
    mapData = []
  }

  const option = {
    backgroundColor: '#f8f9fa',
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#eee',
      borderWidth: 1,
      padding: [10, 15],
      textStyle: {
        color: '#333',
        fontSize: 13,
      },
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
      text: ['High', 'Low'],
      calculable: true,
      show: value !== '0',
      textStyle: {
        color: '#666',
      },
    },
    series: [
      {
        name: '数据',
        type: 'map',
        roam: true,
        map: 'USA',
        silent: false,
        zoom: 1.2,
        itemStyle: {
          areaColor: '#f0f2f5',
          borderColor: '#cfd7e7',
          borderWidth: 0.5,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 5,
        },
        label: {
          show: true,
          fontSize: 8,
          color: '#555',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#333',
          },
          itemStyle: {
            areaColor: '#e1f0ff',
            borderColor: '#7bb6ff',
            borderWidth: 1.5,
            shadowColor: 'rgba(65, 133, 255, 0.3)',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
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

  let colorScheme: string[]
  let dataRange: number[]
  let mapData: any[] = []

  if (value === '1') {
    colorScheme = COLOR_SCHEMES.EMISSIONS
    dataRange = [1000, 28000]
    mapData = chinaEmissionsData
  }
  else if (value === '2') {
    colorScheme = COLOR_SCHEMES.POLICY
    dataRange = [30, 95]
    mapData = chinaPolicyScoreData
  }
  else {
    colorScheme = ['#e0e0e0']
    dataRange = [0, 100]
    mapData = []
  }

  const option = {
    backgroundColor: '#f8f9fa',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#eee',
      borderWidth: 1,
      padding: [10, 15],
      textStyle: {
        color: '#333',
        fontSize: 13,
      },
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
      text: ['High', 'Low'],
      calculable: true,
      show: value !== '0',
      textStyle: {
        color: '#666',
      },
    },
    series: [
      {
        name: '数据',
        type: 'map',
        map: 'China',
        roam: true,
        zoom: 1.2,
        itemStyle: {
          areaColor: '#f0f2f5',
          borderColor: '#cfd7e7',
          borderWidth: 0.5,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 5,
        },
        label: {
          show: true,
          fontSize: 8,
          color: '#555',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#333',
          },
          itemStyle: {
            areaColor: '#e1f0ff',
            borderColor: '#7bb6ff',
            borderWidth: 1.5,
            shadowColor: 'rgba(65, 133, 255, 0.3)',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
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
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
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
  <el-dialog
    v-model="mapInfoDialogVisible"
    :title="mapInfoDialogTitle"
    :width="windowWidth <= 768 ? '95%' : '1000'"
    :draggable="false"
    class="region-details-dialog"
    top="5vh"
    :fullscreen="windowWidth <= 576"
  >
    <!-- 极小屏幕使用下拉菜单替代标签页 -->
    <div v-if="windowWidth <= 480" class="mobile-tab-selector">
      <el-select
        v-model="mapTabsActive"
        class="mobile-select"
        placeholder="Select Content"
        size="large"
        style="width: 100%"
      >
        <el-option label="Policy Comprehensiveness" value="policyComprehensiveness" />
        <el-option label="Policy Ambition Score" value="policyAmbitionScoreAndCorrespondingRanking" />
        <el-option label="Emissions Over Time" value="methaneEmissionsOverTime" />
        <el-option label="Emissions by Sectors" value="methaneEmissionsBySectors" />
        <el-option label="Policies & Projects" value="policiesAndPilotProjects" />
        <el-option label="Project Map" value="pilotProjectPositioningMap" />
      </el-select>

      <div class="mobile-tab-content">
        <PolicyComprehensiveness v-if="mapTabsActive === 'policyComprehensiveness'" />
        <PolicyAmbitionScore v-else-if="mapTabsActive === 'policyAmbitionScoreAndCorrespondingRanking'" />
        <MethaneEmissionsOverTime v-else-if="mapTabsActive === 'methaneEmissionsOverTime'" />
        <MethaneEmissionsBySectors v-else-if="mapTabsActive === 'methaneEmissionsBySectors'" />
        <PoliciesAndPilotProjects v-else-if="mapTabsActive === 'policiesAndPilotProjects'" />
        <PilotProjectMap
          v-else-if="mapTabsActive === 'pilotProjectPositioningMap'"
          :region-name="currentSelectedRegion"
          :country="currentSelectedCountry"
        />
      </div>
    </div>

    <!-- 平板及以上尺寸使用标签页 -->
    <el-tabs
      v-else
      v-model="mapTabsActive"
      class="map-tabs"
      :type="windowWidth <= 576 ? 'card' : 'border-card'"
      :stretch="windowWidth <= 768"
    >
      <el-tab-pane label="Policy Comprehensiveness" name="policyComprehensiveness">
        <PolicyComprehensiveness />
      </el-tab-pane>
      <el-tab-pane
        label="Policy Ambition Score"
        name="policyAmbitionScoreAndCorrespondingRanking"
      >
        <PolicyAmbitionScore />
      </el-tab-pane>
      <el-tab-pane label="Emissions Over Time" name="methaneEmissionsOverTime">
        <MethaneEmissionsOverTime />
      </el-tab-pane>
      <el-tab-pane label="Emissions by Sectors" name="methaneEmissionsBySectors">
        <MethaneEmissionsBySectors />
      </el-tab-pane>

      <el-tab-pane label="Policies & Projects" name="policiesAndPilotProjects">
        <PoliciesAndPilotProjects />
      </el-tab-pane>

      <el-tab-pane label="Project Map" name="pilotProjectPositioningMap">
        <PilotProjectMap
          :region-name="currentSelectedRegion"
          :country="currentSelectedCountry"
        />
      </el-tab-pane>
    </el-tabs>
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

// .chart {
//     border: 1px solid #ebeef5;
//   border-radius: 8px;
//   padding: 20px;
//   margin-bottom: 20px;
//   background-color: white;
//   box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
// }

// .chart-actions {
//   margin-bottom: 15px;
//   text-align: right;

//   .el-button {
//     margin-left: 10px;
//   }
// }

// 对话框样式优化
.region-details-dialog {
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
    max-height: 80vh;
    overflow-y: auto;
  }

  @media (max-width: $breakpoint-sm) {
    .el-dialog__body {
      padding: 15px;
    }

    .el-dialog__header {
      padding: 15px;
    }
  }

  @media (max-width: $breakpoint-xs) {
    .el-dialog__body {
      padding: 10px;
      max-height: 85vh;
    }

    .el-dialog__header {
      padding: 12px;
    }
  }
}

// 移动端标签选择器
.mobile-tab-selector {
  .mobile-select {
    margin-bottom: 15px;

    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      padding: 0 15px;

      &.is-focus {
        box-shadow: 0 0 0 1px #409EFF inset;
      }
    }

    :deep(.el-select__tags) {
      max-width: calc(100% - 30px);
    }
  }

  .mobile-tab-content {
    margin-top: 15px;
    padding: 5px;
    min-height: 200px;
    background-color: #fff;
    border-radius: 4px;
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

  @media (max-width: $breakpoint-sm) {
    .el-tabs__header {
      margin-bottom: 15px;
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: #fff;
    }

    .el-tabs__item {
      padding: 0 10px;
      font-size: 13px;
      height: 36px;
      line-height: 36px;
    }
  }

  @media (max-width: $breakpoint-xs) {
    .el-tabs__header {
      padding: 8px 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    .el-tabs__nav {
      width: 100%;
      display: flex;
    }

    .el-tabs__item {
      flex: 1;
      text-align: center;
      padding: 0 5px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 32px;
      line-height: 32px;
    }

    .el-tabs__content {
      padding-top: 10px;
    }

    :deep(.el-tabs--card) {
      > .el-tabs__header {
        .el-tabs__nav {
          border: none;
          border-radius: 4px;
          background-color: #f5f7fa;
        }

        .el-tabs__item {
          border: none;
          margin: 0;
          transition: all 0.3s ease;
          border-radius: 4px;

          &.is-active {
            background-color: #409EFF;
            color: #fff;
          }

          &:not(.is-active):hover {
            color: #409EFF;
          }
        }
      }
    }
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
    background: linear-gradient(to right, #fffbeb, #fef3c7, #fdba74, #f97316, #c2410c);
  }

  &.policy-gradient {
    background: linear-gradient(to right, #fef9c3, #d9f99d, #86efac, #34d399, #0891b2);
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
  position: relative;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
    pointer-events: none;
    z-index: 1;
  }
}

.map-card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f2f5;
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(250, 250, 252, 1) 100%);
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
  position: relative;
  z-index: 2;
}

.map-card-footer {
  padding: 12px 24px;
  border-top: 1px solid #f0f2f5;
  background-color: #fafafa;
  position: relative;
  z-index: 2;
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
