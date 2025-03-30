<script setup lang='ts'>
import DownloadChartButton from '@/components/echarts/DownloadChartButton.vue'
import DownloadDataButton from '@/components/echarts/DownloadDataButton.vue'
import PieChart from '@/components/echarts/PieChart.vue'
import { downloadChartAsImage } from '@/utils/echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

// 饼图组件ref
const pieChartRef = ref<any>(null)

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
  <div class="methane-emissions-by-sectors">
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
}

.chart-actions {
  margin-bottom: 15px;
  text-align: right;

  .el-button {
    margin-left: 10px;
  }
}

:deep(.el-table) {
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;

  .el-table__header th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: bold;
  }
}
</style>
