<script setup lang='ts'>
import DownloadChartButton from '@/components/echarts/DownloadChartButton.vue'
import DownloadDataButton from '@/components/echarts/DownloadDataButton.vue'
import LineChart from '@/components/echarts/LineChart.vue'
import { downloadChartAsImage } from '@/utils/echarts'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

// 图表引用
const lineChartRef = ref<any>(null)

// 表单数据
const methaneEmissionsOverTimeForm = ref({
  totalEmission: '',
  emissionBySector: '',
})

// 图表数据
const lineChartData = {
  years: ['2018', '2019', '2020', '2021', '2022'],
  values: [273.717, 289.451, 265.332, 301.245, 320.189],
}

// 表格数据
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

// 查询提交
function handleMethaneEmissionsOverTimeSubmit() {
  console.warn('提交甲烷排放随时间变化查询', methaneEmissionsOverTimeForm.value)
  // 这里可以添加实际查询逻辑
}

// 下载图表
function downloadChart() {
  if (lineChartRef.value) {
    const chartInstance = lineChartRef.value.getChartInstance()
    if (chartInstance) {
      downloadChartAsImage(chartInstance, 'methane-emissions')
    }
    else {
      ElMessage.warning('无法获取图表实例')
    }
  }
  else {
    ElMessage.warning('无法获取图表组件')
  }
}

// 下载数据
function downloadChartData() {
  // 调用后台接口下载数据
  ElMessageBox.confirm(
    'This will reset all chart data to default settings. Continue?',
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
        message: '数据下载请求已发送',
      })
    })
    .catch(() => {
      // 用户取消下载
    })
}
</script>

<template>
  <div class="methane-emissions-over-time">
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
            <el-button type="primary" :icon="Search" @click="handleMethaneEmissionsOverTimeSubmit">
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
  </div>
</template>

<style lang="scss" scoped>
.methane-emissions-over-time {
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

.demo-form-inline {
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

.remark {
  margin-top: 15px;
  font-size: 13px;
  color: #909399;
  font-style: italic;
}
</style>
