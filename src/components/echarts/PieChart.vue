<script setup lang="ts">
import type * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
// 定义组件属性
const props = defineProps({
  chartData: {
    type: Array as () => ChartDataItem[],
    required: true,
    default: () => [],
  },
  seriesName: {
    type: String,
    default: '排放源',
  },
  backgroundColor: {
    type: String,
    default: '#fcdddf',
  },
})

// VChart已全局注册，不需要导入

// 获取饼图颜色方法
function getPieColor(index: number): string {
  const colors = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
    '#2ab7ca',
  ]
  return colors[index % colors.length]
}

// 定义项目数据类型
interface ChartDataItem {
  name: string
  value?: number
  year?: string
  [key: string]: any
}

// 图表实例引用
const chartRef = ref<any>(null)
const chartInstance = ref<echarts.ECharts | null>(null)

// 窗口宽度监听
const windowWidth = ref(window.innerWidth)

// 监听窗口大小变化
function handleResize() {
  windowWidth.value = window.innerWidth
  // 窗口大小变化时重新调整图表
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始化时先调用一次，确保获取正确的窗口宽度
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 计算图表选项
const pieChartOption = computed(() => {
  const legendData = props.chartData.map((item: ChartDataItem) => item.name)

  const seriesData = props.chartData.map((item: ChartDataItem) => {
    return {
      name: item.name,
      value: typeof item.value === 'number' ? item.value : Number.parseFloat(item.year || item.value as any || '0'),
    }
  })

  // 在移动端使用不同的配置
  const isMobile = windowWidth.value <= 768
  const isSmallMobile = windowWidth.value <= 480

  return {
    backgroundColor: props.backgroundColor,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      // 移动端tooltip位置调整，确保在可视区内
      position(pos: any, params: any, dom: any, rect: any, size: any) {
        // 计算tooltip宽度和高度
        const tooltipWidth = size.contentSize[0]
        const tooltipHeight = size.contentSize[1]

        // 计算屏幕宽度和高度
        const viewWidth = windowWidth.value
        const viewHeight = window.innerHeight

        // 初始位置
        let x = pos[0]
        let y = pos[1]

        // 确保水平方向在视图内
        if (x + tooltipWidth > viewWidth) {
          x = x - tooltipWidth
        }

        // 确保垂直方向在视图内
        if (y + tooltipHeight > viewHeight) {
          y = y - tooltipHeight
        }

        return [x, y]
      },
      confine: true, // 限制在视图内
      // 移动端更宽一点
      extraCssText: isMobile ? 'max-width:80%; white-space:pre-wrap; word-break:break-all;' : '',
    },
    legend: {
      orient: isMobile ? 'horizontal' : 'horizontal',
      bottom: isMobile ? 0 : 10,
      left: 'center',
      itemGap: isMobile ? 8 : 20,
      itemWidth: isMobile ? 10 : 25,
      itemHeight: isMobile ? 10 : 14,
      data: legendData,
      // 移动端图例优化
      formatter(name: string) {
        // 在小屏幕上缩短图例文本
        if (isSmallMobile && name.length > 8) {
          return `${name.substring(0, 8)}...`
        }
        return name
      },
      tooltip: {
        show: true,
        formatter(param: any) {
          return param.name
        },
      },
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
      // 如果图例太多，允许滚动
      type: legendData.length > (isMobile ? 3 : 6) ? 'scroll' : 'plain',
      pageIconSize: isMobile ? 10 : 15,
    },
    grid: {
      containLabel: true,
    },
    series: [
      {
        name: props.seriesName,
        type: 'pie',
        // 在移动端调整半径和中心位置
        radius: isMobile ? ['20%', '55%'] : ['25%', '60%'],
        center: isMobile ? ['50%', '38%'] : ['50%', '40%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: isMobile ? 5 : 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          // 在移动端隐藏标签，改用点击显示tooltip
          show: !isMobile,
          position: 'outside',
          formatter: '{b}: {c} ({d}%)',
          alignTo: 'edge',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: isMobile ? 12 : 14,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: !isMobile,
          length: 15,
          length2: 20,
          smooth: true,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        data: seriesData,
      },
    ],
  }
})

// 监听数据变化，更新图表
watch(() => props.chartData, () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(pieChartOption.value)
  }
}, { deep: true })

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
  <VChart ref="chartRef" class="pie-chart" :option="pieChartOption" autoresize />

  <!-- 在移动端添加图表说明 -->
  <div v-if="windowWidth <= 768" class="mobile-chart-hint">
    <div class="hint-icon">
      👆
    </div>
    <div class="hint-text">
      点击扇区查看详细数据
    </div>
  </div>

  <!-- 移动端添加表格视图切换 -->
  <div v-if="windowWidth <= 768" class="mobile-data-view">
    <div class="data-title">
      数据明细
    </div>
    <div class="data-list">
      <div v-for="(item, index) in chartData" :key="index" class="data-item">
        <div class="data-color" :style="{ backgroundColor: getPieColor(index) }" />
        <div class="data-name">
          {{ item.name }}
        </div>
        <div class="data-value">
          {{ typeof item.value === 'number' ? item.value : Number.parseFloat(item.year || (item.value as any) || '0') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pie-chart {
  width: 100%;
  height: 400px;

  @media (max-width: $breakpoint-sm) {
    height: 350px;
  }

  @media (max-width: $breakpoint-xs) {
    height: 300px;
  }
}

.mobile-chart-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-top: -20px;
  margin-bottom: 15px;
  background-color: #f7f9fa;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;

  .hint-icon {
    font-size: 14px;
    margin-right: 5px;
    animation: pulse 2s infinite;
  }

  .hint-text {
    line-height: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.mobile-data-view {
  margin-top: 10px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;

  .data-title {
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 500;
    background-color: #f5f7fa;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
  }

  .data-list {
    padding: 5px 0;
  }

  .data-item {
    display: flex;
    align-items: center;
    padding: 8px 15px;
    font-size: 13px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .data-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      margin-right: 8px;
    }

    .data-name {
      flex: 1;
      color: #606266;
    }

    .data-value {
      font-weight: 600;
      color: #303133;
    }
  }
}
</style>
