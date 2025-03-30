<script setup lang='ts'>
import DownloadChartButton from '@/components/echarts/DownloadChartButton.vue'
import DownloadDataButton from '@/components/echarts/DownloadDataButton.vue'
import PieChart from '@/components/echarts/PieChart.vue'
import { downloadChartAsImage } from '@/utils/echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 饼图组件ref
const pieChartRef = ref<any>(null)

// 窗口宽度监听
const windowWidth = ref(window.innerWidth)

// 监听窗口大小变化
function handleResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 表格数据
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

// 下载饼图
function downloadPieChart() {
  if (pieChartRef.value) {
    const chartInstance = pieChartRef.value.getChartInstance()
    if (chartInstance) {
      downloadChartAsImage(chartInstance, 'methane-emissions-by-sector')
    }
    else {
      ElMessage.warning('无法获取图表实例')
    }
  }
  else {
    ElMessage.warning('无法获取图表组件')
  }
}

// 下载饼图数据
function downloadPieChartData() {
  ElMessageBox.confirm(
    'This will reset all filters and data selections. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
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
  <div class="methane-emissions-by-sectors">
    <div class="chart-actions" :class="{ 'mobile-actions': windowWidth <= 768 }">
      <DownloadChartButton
        :on-click="downloadPieChart"
        label="Download chart"
        :style="{ width: windowWidth <= 576 ? '100%' : 'auto' }"
      />
      <DownloadDataButton
        :on-click="downloadPieChartData"
        label="Download data"
        :style="{ width: windowWidth <= 576 ? '100%' : 'auto', marginLeft: windowWidth <= 576 ? '0' : '10px' }"
      />
    </div>

    <div id="pie-chart" class="chart">
      <PieChart ref="pieChartRef" :chart-data="methaneEmissionsBySectorsTableData" />
    </div>

    <div class="table-container">
      <el-table :data="methaneEmissionsBySectorsTableData" border style="width: 100%">
        <el-table-column prop="name" label="Source" min-width="180" />
        <el-table-column prop="year" label="2022" min-width="80" />
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.methane-emissions-by-sectors {
  width: 100%;
}

.chart {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: $breakpoint-xs) {
    padding: 10px;
  }
}

.chart-actions {
  margin-bottom: 15px;
  text-align: right;

  .el-button {
    margin-left: 10px;
  }

  &.mobile-actions {
    text-align: left;
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .el-button {
      margin-left: 0;
      flex: 1;
    }
  }

  @media (max-width: $breakpoint-xs) {
    &.mobile-actions {
      flex-direction: column;

      .el-button {
        width: 100%;
        margin-bottom: 8px;
      }
    }
  }
}

.table-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 15px;
}

:deep(.el-table) {
  margin-top: 5px;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;

  .el-table__header th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: bold;
  }

  @media (max-width: $breakpoint-xs) {
    .cell {
      padding: 8px;
      font-size: 12px;
    }
  }
}
</style>
