<script lang="ts" setup>
import { LineChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import VChart from 'vue-echarts'
import Footer from '../home/components/Footer.vue'
import Header from '../home/components/Header.vue'

// 定义表格数据类型
interface TableItem {
  date: string
  country: string
  jurisdiction: string
  emissionSource: string
  value: number
}

// 注册ECharts组件
use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
])

// 筛选表单数据
const filterForm = reactive({
  country: '',
  jurisdiction: '',
  emissionSources: [],
})

// 筛选选项
const countryOptions = [
  { value: 'china', label: 'China' },
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'UK' },
  { value: 'germany', label: 'Germany' },
]

const jurisdictionOptions = [
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'State' },
  { value: 'local', label: 'Local' },
]

const emissionSourcesOptions = [
  { value: 'industrial', label: 'Industrial' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'energy', label: 'Energy' },
]

// 图表配置
const chartOption = ref({
  // title: {
  //   text: 'Emission Trends Over Time',
  // },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Industrial', 'Transportation', 'Residential', 'Commercial', 'Energy'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Industrial',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
    },
    {
      name: 'Transportation',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149],
    },
    {
      name: 'Residential',
      type: 'line',
      data: [150, 232, 201, 154, 190, 330, 410, 182, 191, 234, 290, 330],
    },
    {
      name: 'Commercial',
      type: 'line',
      data: [320, 332, 301, 334, 390, 330, 320, 132, 101, 134, 90, 230],
    },
    {
      name: 'Energy',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330],
    },
  ],
})

// 表格数据
const tableData = ref<TableItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 生成模拟数据
function generateMockData(): TableItem[] {
  const result: TableItem[] = []
  for (let i = 0; i < 100; i++) {
    const month = i % 12
    const emissionSources = ['Industrial', 'Transportation', 'Residential', 'Commercial', 'Energy']

    result.push({
      date: `2023-${(month + 1).toString().padStart(2, '0')}-01`,
      country: countryOptions[i % countryOptions.length].label,
      jurisdiction: jurisdictionOptions[i % jurisdictionOptions.length].label,
      emissionSource: emissionSources[i % emissionSources.length],
      value: Math.floor(Math.random() * 1000),
    })
  }
  return result
}

// 模拟API请求
function fetchData() {
  // 模拟API延迟
  setTimeout(() => {
    const allData = generateMockData()
    tableData.value = allData.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
    total.value = allData.length
  }, 500)
}

// 处理筛选变化
function handleFilterChange() {
  currentPage.value = 1
  fetchData()
  // 可以发送后端请求，这里先用模拟数据
}

// 处理页码变化
function handleCurrentChange(val: number) {
  currentPage.value = val
  fetchData()
}

// 处理每页数量变化
function handleSizeChange(val: number) {
  pageSize.value = val
  fetchData()
}

// 处理下载
function handleDownload() {
  ElMessage.success('下载功能已触发，实际下载功能需要根据后端API实现')

  // 实际下载逻辑示例（可以根据后端API调整）:
  // 1. 创建一个隐藏的a标签
  // 2. 设置href为下载链接
  // 3. 触发点击事件

  // const downloadLink = document.createElement('a')
  // downloadLink.href = '/api/emission-data/download'
  // downloadLink.download = 'emission-data.csv'
  // document.body.appendChild(downloadLink)
  // downloadLink.click()
  // document.body.removeChild(downloadLink)
}
// 下载数据
function downloadData() {
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
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <Header />
      <el-main>
        <div class="emission-monitoring-container main-container">
          <!-- 筛选栏 -->
          <div class="filter-section">
            <el-form :inline="true" :model="filterForm" class="filter-form">
              <el-form-item label="Country" style="width: 200px">
                <el-select v-model="filterForm.country" placeholder="Select Country" clearable @change="handleFilterChange">
                  <el-option v-for="item in countryOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="Jurisdiction" style="width: 300px">
                <el-select v-model="filterForm.jurisdiction" placeholder="Select Jurisdiction" clearable @change="handleFilterChange">
                  <el-option v-for="item in jurisdictionOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="Emission Sources" style="max-width: 550px;min-width: 340px">
                <el-select v-model="filterForm.emissionSources" multiple placeholder="Select Emission Sources" @change="handleFilterChange">
                  <el-option v-for="item in emissionSourcesOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFilterChange">
                  Query
                </el-button>
                <DownloadDataButton :on-click="downloadData" label="Download data" />
              </el-form-item>
            </el-form>
          </div>

          <!-- 折线图 -->
          <div class="chart-section">
            <div class="chart-title">
              Emission Trends
            </div>
            <div class="chart-container">
              <VChart class="chart" :option="chartOption" autoresize />
            </div>
          </div>

          <!-- 数据表格 -->
          <div class="table-section">
            <div class="table-header">
              <div class="table-title">
                Emission Data
              </div>
              <el-button type="primary" @click="handleDownload">
                Download Data
              </el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" height="400">
              <el-table-column prop="date" label="Date" />
              <el-table-column prop="country" label="Country" />
              <el-table-column prop="jurisdiction" label="Jurisdiction" />
              <el-table-column prop="emissionSource" label="Emission Source" />
              <el-table-column prop="value" label="Value" />
            </el-table>
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-main>
      <Footer />
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  background-color: #f9fbfd;
  min-height: 100vh;
}

.el-main {
  padding: 30px;
}

::v-deep(.el-header),
::v-deep(.el-footer) {
  height: auto;
}

::v-deep(.el-container) {
  flex-direction: column;
}

.emission-monitoring-container {

  .filter-section {
    background-color: #f5f7fa;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .chart-section {
    background-color: #fff;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .chart-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .chart-container {
      height: 400px;

      .chart {
        height: 100%;
        width: 100%;
      }
    }
  }

  .table-section {
    background-color: #fff;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .table-title {
        font-size: 18px;
        font-weight: 600;
      }
    }

    .el-pagination {
      margin-top: 16px;
      justify-content: flex-end;
    }
  }
}

::v-deep(.el-form-item){
  margin-bottom: 0;
}
</style>
