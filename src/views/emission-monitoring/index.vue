<script lang="ts" setup>
import DownloadDataButton from '@/components/echarts/DownloadDataButton.vue'
import { QuestionFilled, Search } from '@element-plus/icons-vue'
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
import Header from '../home/components/header/index.vue'

// 定义表格数据类型
interface TableItem {
  name: string
  [key: string]: string | number
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
const tableData = ref<TableItem[]>([
  {
    name: 'Total',
    1990: '924.80',
    1991: '924.80',
    1992: '924.80',
    1993: '924.80',
    1994: '924.80',
    1995: '924.80',
    1996: '924.80',
    1997: '924.80',
    1998: '924.80',
    1999: '924.80',
    2000: '924.80',
    2001: '924.80',
    2002: '924.80',
    2003: '924.80',
    2004: '924.80',
    2005: '924.80',
    2006: '924.80',
    2007: '924.80',
    2008: '924.80',
    2009: '924.80',
    2010: '924.80',
    2011: '924.80',
    2012: '924.80',
    2013: '924.80',
    2014: '924.80',
    2015: '924.80',
    2016: '924.80',
    2017: '924.80',
    2018: '924.80',
    2019: '924.80',
    2020: '924.80',
    2021: '924.80',
    2022: '924.80',

  },
  {
    name: 'Energy',
    1990: '924.80',
    1991: '924.80',
    1992: '924.80',
    1993: '924.80',
    1994: '924.80',
    1995: '924.80',
    1996: '924.80',
    1997: '924.80',
    1998: '924.80',
    1999: '924.80',
    2000: '924.80',
    2001: '924.80',
    2002: '924.80',
    2003: '924.80',
    2004: '924.80',
    2005: '924.80',
    2006: '924.80',
    2007: '924.80',
    2008: '924.80',
    2009: '924.80',
    2010: '924.80',
    2011: '924.80',
    2012: '924.80',
    2013: '924.80',
    2014: '924.80',
    2015: '924.80',
    2016: '924.80',
    2017: '924.80',
    2018: '924.80',
    2019: '924.80',
    2020: '924.80',
    2021: '924.80',
    2022: '924.80',

  },
])

// 模拟API请求
function fetchData() {
  // 模拟API延迟
  // eslint-disable-next-line no-console
  console.log('TODO: 模拟API请求')
}

// 处理筛选变化
function handleFilterChange() {
  fetchData()
  // 可以发送后端请求，这里先用模拟数据
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
                <el-button type="primary" :icon="Search" @click="handleFilterChange">
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
            </div>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column
                prop="name"
                width="130"
                fixed="left"
              >
                <template #header>
                  <div style="display:flex;align-items:center">
                    <span>U.S.Methane</span>
                    <el-tooltip
                      content="U.S.Emissions of Methane, MMT CO2 equivalent"
                      placement="top"
                    >
                      <el-icon style="margin-left:4px;font-size:14px;color:#909399">
                        <QuestionFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
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
              <el-table-column prop="2001" label="2001" />
              <el-table-column prop="2002" label="2002" />
              <el-table-column prop="2003" label="2003" />
              <el-table-column prop="2004" label="2004" />
              <el-table-column prop="2005" label="2005" />
              <el-table-column prop="2006" label="2006" />
              <el-table-column prop="2007" label="2007" />
              <el-table-column prop="2008" label="2008" />
              <el-table-column prop="2009" label="2009" />
              <el-table-column prop="2010" label="2010" />
              <el-table-column prop="2011" label="2011" />
              <el-table-column prop="2012" label="2012" />
              <el-table-column prop="2013" label="2013" />
              <el-table-column prop="2014" label="2014" />
              <el-table-column prop="2015" label="2015" />
              <el-table-column prop="2016" label="2016" />
              <el-table-column prop="2017" label="2017" />
              <el-table-column prop="2018" label="2018" />
              <el-table-column prop="2019" label="2019" />
              <el-table-column prop="2020" label="2020" />
              <el-table-column prop="2021" label="2021" />
              <el-table-column prop="2022" label="2022" />
            </el-table>
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
