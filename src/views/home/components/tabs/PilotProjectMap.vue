<script setup lang='ts'>
import chinaJson from '@/assets/GEOJSON/china.json'
import usaJson from '@/assets/GEOJSON/USA.json'
import * as echarts from 'echarts'
import { nextTick, onMounted, ref, watch } from 'vue'

// 定义组件接收的属性
const props = defineProps({
  // 地区名称，如州名或省名
  regionName: {
    type: String,
    required: true,
  },
  // 国家：'usa' 或 'china'
  country: {
    type: String,
    required: true,
    default: 'usa',
    validator: (value: string) => ['usa', 'china'].includes(value),
  },
})

// 图表实例引用
const detailMapRef = ref<any>(null)
// 图表配置选项
const detailMapOption = ref({})
// 当前地图名称
const currentRegionName = ref('')
// 地图上显示的项目点位
const projectPoints = ref<any[]>([])

// 模拟美国项目点位信息（实际项目中应从API获取）
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

// 模拟中国项目点位信息
const chinaProjectPoints = [
  { name: 'Beijing Biomass Energy Project', longitude: 116.4074, latitude: 39.9042, description: 'Biomass energy conversion project', value: 25 },
  { name: 'Beijing Landfill Gas Recovery', longitude: 116.2363, latitude: 39.8343, description: 'Methane recovery from landfill sites', value: 22 },
  { name: 'Sichuan Biogas Utilization Project', longitude: 104.0665, latitude: 30.6598, description: 'Rural biogas utilization for emission reduction', value: 38 },
  { name: 'Sichuan Livestock Emission Reduction', longitude: 103.7558, latitude: 29.6136, description: 'Livestock methane emission reduction project', value: 33 },
  { name: 'Shanghai Waste Sorting System', longitude: 121.4737, latitude: 31.2304, description: 'Urban waste sorting and methane recovery', value: 31 },
  { name: 'Shanghai Industrial Wastewater Treatment', longitude: 121.5574, latitude: 31.0449, description: 'Industrial wastewater treatment to reduce methane emissions', value: 27 },
  { name: 'Guangdong Livestock Emission Project', longitude: 113.2644, latitude: 23.1291, description: 'Livestock methane capture and utilization', value: 29 },
  { name: 'Guangdong Natural Gas Project', longitude: 114.0579, latitude: 22.5431, description: 'Natural gas as coal substitute for clean energy', value: 32 },
]

// 初始化详细地图
function initDetailMap() {
  // 确保组件属性有效
  if (!props.regionName) {
    console.warn('区域名称为空，无法初始化地图')
    return
  }

  // 确保DOM已经渲染
  nextTick(() => {
    // 设置当前地图名称
    currentRegionName.value = props.regionName

    // 根据国家和地区名称确定显示哪些点位
    if (props.country === 'usa') {
      projectPoints.value = usaProjectPoints.filter((point) => {
        // 这里筛选属于当前州的点位
        return point.name.includes(props.regionName)
      })
    }
    else if (props.country === 'china') {
      projectPoints.value = chinaProjectPoints.filter((point) => {
        // 筛选属于当前省份的点位
        return point.name.includes(props.regionName)
      })
    }
    else {
      projectPoints.value = []
    }

    // 获取特定州或省的地图数据
    let stateFeature = null
    let mapJsonData = null

    if (props.country === 'usa') {
      // 从美国地图中找到对应的州
      stateFeature = usaJson.features.find(feature => feature.properties.name === props.regionName)
      if (stateFeature) {
        // 创建新的GeoJSON对象，只包含该州的feature
        mapJsonData = {
          type: 'FeatureCollection',
          features: [stateFeature],
        }
      }
      else {
        console.error(`未找到州: ${props.regionName}`)
        mapJsonData = {
          type: 'FeatureCollection',
          features: [],
        }
      }
    }
    else if (props.country === 'china') {
      // 从中国地图中找到对应的省
      stateFeature = chinaJson.features.find(feature => feature.properties.name === props.regionName)
      if (stateFeature) {
        // 创建新的GeoJSON对象，只包含该省的feature
        mapJsonData = {
          type: 'FeatureCollection',
          features: [stateFeature],
        }
      }
      else {
        console.error(`未找到省: ${props.regionName}`)
        mapJsonData = {
          type: 'FeatureCollection',
          features: [],
        }
      }
    }

    // 注册地图
    if (mapJsonData && mapJsonData.features.length > 0) {
      try {
        echarts.registerMap(props.regionName, mapJsonData as any)

        // 创建地图配置
        const option = {
          backgroundColor: '#f8f9fa',
          tooltip: {
            trigger: 'item',
            formatter(params: any) {
              if (params.componentSubType === 'effectScatter' || params.componentSubType === 'scatter') {
                return `<b>${params.name}</b><br/>
                        ${params.data.description}<br/>
                        Longitude: ${params.data.longitude}<br/>
                        Latitude: ${params.data.latitude}<br/>
                        Emission Reduction: ${params.data.value[2]} thousand tons`
              }
              return params.name
            },
            confine: true,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#eee',
            borderWidth: 1,
            padding: [10, 15],
            textStyle: {
              color: '#333',
              fontSize: 13,
            },
          },
          visualMap: {
            show: false,
            min: 0,
            max: 50,
            inRange: {
              color: ['#fffbeb', '#fef3c7', '#fdba74', '#f97316', '#c2410c'],
            },
          },
          geo: {
            map: props.regionName,
            roam: true,
            label: {
              show: true,
              fontSize: 10,
              color: '#555',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
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
            itemStyle: {
              areaColor: '#f0f2f5',
              borderColor: '#cfd7e7',
              borderWidth: 0.5,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 5,
            },
            zoom: 1.2,
          },
          series: [
            {
              name: '项目位置标记',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: projectPoints.value.map(point => ({
                name: point.name,
                value: [point.longitude, point.latitude, point.value],
                description: point.description,
                longitude: point.longitude,
                latitude: point.latitude,
              })),
              symbolSize: 26,
              symbol: 'path://M12,0C7.4,0,3.7,3.7,3.7,8.3c0,8.7,7.6,15.1,7.9,15.4c0.1,0.1,0.3,0.2,0.4,0.2c0.1,0,0.3-0.1,0.4-0.2c0.3-0.3,7.9-6.7,7.9-15.4C20.3,3.7,16.6,0,12,0z',
              itemStyle: {
                color: '#f97316',
                shadowBlur: 8,
                shadowColor: 'rgba(249, 115, 22, 0.5)',
              },
              zlevel: 3,
              emphasis: {
                scale: 1.2,
                itemStyle: {
                  color: '#fdba74',
                },
              },
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
      console.warn(`无法为 ${props.regionName} 加载地图数据`)

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

// 当组件属性变化时重新初始化地图
watch(
  () => [props.regionName, props.country],
  () => {
    initDetailMap()
  },
)

// 组件挂载后初始化
onMounted(() => {
  initDetailMap()
})

// 获取地图实例的方法（供父组件调用）
function getChartInstance() {
  if (detailMapRef.value && detailMapRef.value.chart) {
    return detailMapRef.value.chart
  }
  return null
}

// 导出组件方法
defineExpose({
  getChartInstance,
})
</script>

<template>
  <div class="pilot-project-map-container">
    <div class="map-header">
      <h4 class="map-title">
        {{ regionName }} Project Distribution Map
      </h4>
      <div class="map-subtitle">
        Displaying methane reduction projects in the region
      </div>
    </div>
    <div class="detail-map-container">
      <VChart ref="detailMapRef" class="detail-map" :option="detailMapOption" autoresize />
    </div>
    <div class="map-footer">
      <div v-if="projectPoints.length > 0" class="project-count">
        Showing {{ projectPoints.length }} projects
      </div>
      <div v-else class="no-projects">
        No project data available for this region
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.pilot-project-map-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
    pointer-events: none;
    z-index: 1;
  }
}

.map-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(250, 250, 252, 1) 100%);
}

.map-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.map-subtitle {
  font-size: 13px;
  color: #909399;
}

.detail-map-container {
  flex: 1;
  padding: 0;
  min-height: 500px;
}

.detail-map {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.map-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f2f5;
  background-color: #fafafa;
}

.project-count {
  font-size: 13px;
  color: #606266;
}

.no-projects {
  font-size: 13px;
  color: #909399;
  font-style: italic;
}
</style>
