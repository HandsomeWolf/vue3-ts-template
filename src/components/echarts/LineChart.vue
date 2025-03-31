<script setup lang="ts">
import type * as echarts from 'echarts'
import { computed, nextTick, onMounted, ref } from 'vue'
// VChart已全局注册，不需要导入

// 定义组件属性
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      years: [],
      values: [],
    }),
  },
  backgroundColor: {
    type: String,
    default: '#fcdddf',
  },
})

// 图表实例引用
const chartRef = ref<any>(null)
const chartInstance = ref<echarts.ECharts | null>(null)

// 计算图表选项
const lineChartOption = computed(() => {
  return {
    backgroundColor: props.backgroundColor,
    tooltip: {
      trigger: 'axis',
      confine: true, // 确保tooltip不超出图表区域
      position: 'bottom',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#5a9fc8',
          width: 2,
        },
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '14%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.chartData.years,
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: 'thousand tons',
      nameTextStyle: {
        color: '#666',
        padding: [0, 0, 0, 40],
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee',
        },
      },
    },
    series: [{
      name: 'Methane Emissions',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: false,
      lineStyle: {
        color: '#5a9fc8',
        width: 3,
      },
      itemStyle: {
        color: '#5a9fc8',
        borderColor: '#fff',
        borderWidth: 2,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(90, 159, 200, 0.9)',
          }],
        },
      },
      data: props.chartData.values,
    }],
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
  getChartInstance,
})
</script>

<template>
  <VChart ref="chartRef" class="line-chart" :option="lineChartOption" autoresize />
</template>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 260px;
}
</style>
