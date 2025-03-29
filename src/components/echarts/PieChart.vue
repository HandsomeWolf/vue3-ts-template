<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
// VChart已全局注册，不需要导入

// 定义组件属性
const props = defineProps({
  chartData: {
    type: Array,
    required: true,
    default: () => []
  },
  seriesName: {
    type: String,
    default: '排放源'
  },
  backgroundColor: {
    type: String,
    default: '#fcdddf'
  }
})

// 图表实例引用
const chartRef = ref<any>(null)
const chartInstance = ref<echarts.ECharts | null>(null)

// 计算图表选项
const pieChartOption = computed(() => {
  const legendData = props.chartData.map((item: any) => item.name)
  
  const seriesData = props.chartData.map((item: any) => {
    return {
      name: item.name,
      value: typeof item.value === 'number' ? item.value : parseFloat(item.year || item.value)
    }
  })
  
  return {
    backgroundColor: props.backgroundColor,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      itemGap: 20,
      data: legendData
    },
    grid: {
      containLabel: true
    },
    series: [
      {
        name: props.seriesName,
        type: 'pie',
        radius: ['25%', '60%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c} ({d}%)',
          alignTo: 'edge',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 20,
          smooth: true,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        data: seriesData
      }
    ]
  }
})

// 在组件挂载后初始化图表实例
onMounted(async () => {
  await nextTick()
  if (chartRef.value) {
    chartInstance.value = chartRef.value.chart
  }
})

// 获取echarts实例的方法
function getChartInstance() {
  // 如果已经有缓存的实例，直接返回
  if (chartInstance.value) {
    return chartInstance.value
  }
  // 否则尝试从chartRef中获取
  if (chartRef.value) {
    chartInstance.value = chartRef.value.chart
    return chartInstance.value
  }
  return null
}

// 暴露图表实例获取方法给父组件
defineExpose({
  getChartInstance
})
</script>

<template>
  <VChart class="pie-chart" :option="pieChartOption" ref="chartRef" autoresize />
</template>

<style lang="scss" scoped>
.pie-chart {
  width: 100%;
  height: 400px;
}
</style> 