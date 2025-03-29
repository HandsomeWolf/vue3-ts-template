<script setup lang='ts'>
import chinaJson from '@/assets/GEOJSON/china.json'
import usaJson from '@/assets/GEOJSON/USA.json'
import {
  DocumentCopy,
  Download,
  Edit,
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref, nextTick } from 'vue'
import * as XLSX from 'xlsx'

// 图表实例
let usaChart: echarts.ECharts | null = null
let chinaChart: echarts.ECharts | null = null

// VChart组件ref
const lineChartRef = ref<any>(null)

// 图表配置选项
const usaMapOption = ref({})
const chinaMapOption = ref({})
const lineChartOption = ref({})

// 饼图配置选项
const pieChartOption = ref({})
const pieChartRef = ref<any>(null)

// 定义两种不同的颜色方案
const colorSchemes = {
  emissions: ['#ffedd5', '#fed7aa', '#fb923c', '#ea580c', '#9a3412'], // 橙色到红色
  policy: ['#fef9c3', '#86efac', '#22c55e', '#15803d', '#0ea5e9'], // 黄色到绿色到蓝色
}

// 模拟数据 - 2022年各州甲烷排放量（单位：thousand tons）
const emissionsData = [
  { name: 'Texas', value: 35000 },
  { name: 'California', value: 28000 },
  { name: 'Louisiana', value: 25000 },
  { name: 'Oklahoma', value: 22000 },
  { name: 'Pennsylvania', value: 20000 },
  { name: 'Ohio', value: 18000 },
  { name: 'Illinois', value: 16000 },
  { name: 'Florida', value: 15000 },
  { name: 'Michigan', value: 14000 },
  { name: 'New York', value: 13000 },
  { name: 'Colorado', value: 12000 },
  { name: 'Indiana', value: 11000 },
  { name: 'North Dakota', value: 10000 },
  { name: 'West Virginia', value: 9500 },
  { name: 'Wyoming', value: 9000 },
  { name: 'Kansas', value: 8500 },
  { name: 'New Mexico', value: 8000 },
  { name: 'Virginia', value: 7500 },
  { name: 'Missouri', value: 7000 },
  { name: 'Georgia', value: 6500 },
  { name: 'Alabama', value: 6000 },
  { name: 'Wisconsin', value: 5500 },
  { name: 'Kentucky', value: 5000 },
  { name: 'Iowa', value: 4500 },
  { name: 'Arkansas', value: 4000 },
  { name: 'Mississippi', value: 3500 },
  { name: 'Oregon', value: 3000 },
  { name: 'Utah', value: 2800 },
  { name: 'Nevada', value: 2600 },
  { name: 'Arizona', value: 2400 },
  { name: 'Idaho', value: 2200 },
  { name: 'Washington', value: 2000 },
  { name: 'Nebraska', value: 1800 },
  { name: 'South Carolina', value: 1600 },
  { name: 'Tennessee', value: 1400 },
  { name: 'Minnesota', value: 1200 },
  { name: 'Montana', value: 1000 },
  { name: 'Connecticut', value: 900 },
  { name: 'Hawaii', value: 800 },
  { name: 'Alaska', value: 700 },
  { name: 'Maine', value: 600 },
  { name: 'New Hampshire', value: 550 },
  { name: 'Rhode Island', value: 500 },
  { name: 'Delaware', value: 450 },
  { name: 'South Dakota', value: 400 },
  { name: 'Vermont', value: 350 },
  { name: 'District of Columbia', value: 300 },
]

// 模拟数据 - 各州政策目标力度得分（0-100分）
const policyScoreData = [
  { name: 'California', value: 95 },
  { name: 'New York', value: 90 },
  { name: 'Massachusetts', value: 88 },
  { name: 'Washington', value: 85 },
  { name: 'Oregon', value: 83 },
  { name: 'Vermont', value: 82 },
  { name: 'Colorado', value: 80 },
  { name: 'Hawaii', value: 78 },
  { name: 'Maine', value: 77 },
  { name: 'Rhode Island', value: 75 },
  { name: 'Connecticut', value: 73 },
  { name: 'New Jersey', value: 72 },
  { name: 'Minnesota', value: 70 },
  { name: 'Maryland', value: 68 },
  { name: 'Illinois', value: 65 },
  { name: 'Nevada', value: 63 },
  { name: 'New Mexico', value: 60 },
  { name: 'Michigan', value: 58 },
  { name: 'Pennsylvania', value: 55 },
  { name: 'Virginia', value: 53 },
  { name: 'Delaware', value: 50 },
  { name: 'North Carolina', value: 48 },
  { name: 'Arizona', value: 45 },
  { name: 'Florida', value: 43 },
  { name: 'Wisconsin', value: 40 },
  { name: 'Ohio', value: 38 },
  { name: 'Iowa', value: 35 },
  { name: 'Texas', value: 33 },
  { name: 'Indiana', value: 30 },
  { name: 'Missouri', value: 28 },
  { name: 'Georgia', value: 25 },
  { name: 'Kansas', value: 23 },
  { name: 'Oklahoma', value: 20 },
  { name: 'South Carolina', value: 18 },
  { name: 'Tennessee', value: 15 },
  { name: 'Kentucky', value: 13 },
  { name: 'Louisiana', value: 10 },
  { name: 'Alabama', value: 8 },
  { name: 'Mississippi', value: 5 },
  { name: 'West Virginia', value: 3 },
  { name: 'Wyoming', value: 2 },
]

// 模拟政策全面性数据
const policyComprehensiveData = {
  'California': {
    石油和天然气: ['确定排放源与计算排放量', '设置量化目标', '实施激励措施或法规'],
    煤炭: ['实施激励措施或法规', '定期评估与完善'],
    废弃物: ['确定排放源与计算排放量', '设置量化目标'],
    农业: ['利益相关方参与', '设置量化目标', '实施激励措施或法规'],
  },
  'Texas': {
    石油和天然气: ['确定排放源与计算排放量', '制定排放预测'],
    煤炭: ['确定排放源与计算排放量'],
    废弃物: ['制定排放预测'],
    农业: ['确定排放源与计算排放量'],
  },
  'New York': {
    石油和天然气: ['确定排放源与计算排放量', '设置量化目标', '实施激励措施或法规', '定期评估与完善'],
    煤炭: ['设置量化目标', '实施激励措施或法规', '定期评估与完善'],
    废弃物: ['确定排放源与计算排放量', '设置量化目标', '利益相关方参与'],
    农业: ['设置量化目标', '实施激励措施或法规', '利益相关方参与'],
  },
  'Colorado': {
    石油和天然气: ['确定排放源与计算排放量', '设置量化目标', '实施激励措施或法规'],
    煤炭: ['确定排放源与计算排放量', '制定排放预测'],
    废弃物: ['制定排放预测', '设置量化目标'],
    农业: ['确定排放源与计算排放量', '利益相关方参与'],
  },
}

// 模拟排放趋势数据（2018-2022）
const emissionsTrendData = {
  'California': {
    biomass: [1200, 1180, 1150, 1100, 1050],
    coal: [800, 750, 700, 650, 600],
    fossil: [2000, 1900, 1850, 1800, 1750],
    landfill: [1500, 1450, 1400, 1350, 1300],
    livestock: [3000, 2900, 2850, 2800, 2750],
    oil_gas: [4000, 3900, 3850, 3800, 3750],
    rice: [500, 480, 460, 440, 420],
    wastewater: [1000, 950, 900, 850, 800],
  },
  'Texas': {
    biomass: [800, 820, 850, 870, 900],
    coal: [2500, 2400, 2300, 2200, 2100],
    fossil: [3500, 3600, 3650, 3700, 3800],
    landfill: [2000, 2050, 2100, 2150, 2200],
    livestock: [4500, 4600, 4650, 4700, 4800],
    oil_gas: [8000, 8200, 8400, 8600, 8800],
    rice: [300, 310, 320, 330, 340],
    wastewater: [1500, 1550, 1600, 1650, 1700],
  },
  'New York': {
    biomass: [600, 580, 560, 540, 520],
    coal: [400, 350, 300, 250, 200],
    fossil: [1500, 1450, 1400, 1350, 1300],
    landfill: [1200, 1150, 1100, 1050, 1000],
    livestock: [800, 780, 760, 740, 720],
    oil_gas: [1000, 950, 900, 850, 800],
    rice: [50, 45, 40, 35, 30],
    wastewater: [700, 680, 660, 640, 620],
  },
  'Colorado': {
    biomass: [400, 410, 420, 430, 440],
    coal: [1200, 1150, 1100, 1050, 1000],
    fossil: [1800, 1750, 1700, 1650, 1600],
    landfill: [900, 920, 940, 960, 980],
    livestock: [1500, 1520, 1540, 1560, 1580],
    oil_gas: [2500, 2400, 2300, 2200, 2100],
    rice: [100, 95, 90, 85, 80],
    wastewater: [600, 610, 620, 630, 640],
  },
}

// 模拟政策数据
const policyData = {
  'California': [
    {
      jurisdiction: 'California',
      year: 2016,
      sector: 'Oil & Gas, Coal, Municipal Solid Waste, Wastewater, Rice, Manure, Enteric Fermentation',
      policyName: 'California Senate Bill 1383 Short-Lived Climate Pollutants',
      type: 'Plan and Strategy',
      targets: [
        'Methane will be reduced to 40% below 2013 levels by 2030',
        'Reduce the amount of organic waste sent to landfills by 75% below 2014 levels by 2025',
        'Achieve recovery of at least 20% of food waste by 2025',
        'Reduce dairy and livestock sector methane emissions of 40% below 2013 levels by 2030',
      ],
    },
    {
      jurisdiction: 'California',
      year: 2019,
      sector: 'Oil & Gas',
      policyName: 'Oil and Gas Methane Regulation',
      type: 'Regulation',
      targets: ['Reduce methane emissions from oil and gas operations by 45% by 2025'],
    },
  ],
  'Texas': [
    {
      jurisdiction: 'Texas',
      year: 2020,
      sector: 'Oil & Gas',
      policyName: 'Texas Methane Monitoring Program',
      type: 'Monitoring',
      targets: null,
    },
  ],
  'New York': [
    {
      jurisdiction: 'New York',
      year: 2019,
      sector: 'All Sectors',
      policyName: 'Climate Leadership and Community Protection Act',
      type: 'Legislation',
      targets: ['Reduce greenhouse gas emissions by 85% by 2050'],
    },
    {
      jurisdiction: 'New York',
      year: 2021,
      sector: 'Waste Management',
      policyName: 'Food Waste Recycling Law',
      type: 'Regulation',
      targets: ['Divert food waste from landfills for businesses generating more than 2 tons per week'],
    },
  ],
  'Colorado': [
    {
      jurisdiction: 'Colorado',
      year: 2020,
      sector: 'Oil & Gas',
      policyName: '2 Colorado Code Regs. §404-1',
      type: 'Regulation',
      targets: null,
    },
    {
      jurisdiction: 'Colorado',
      year: 2021,
      sector: 'Multiple Sectors',
      policyName: 'Greenhouse Gas Pollution Reduction Roadmap',
      type: 'Plan and Strategy',
      targets: ['Reduce greenhouse gas emissions by 26% by 2025', '50% by 2030', '90% by 2050'],
    },
  ],
}

// 中国省份甲烷排放量模拟数据（单位：thousand tons）
const chinaEmissionsData = [
  { name: '北京市', value: 3200 },
  { name: '天津市', value: 4500 },
  { name: '河北省', value: 18000 },
  { name: '山西省', value: 15000 },
  { name: '内蒙古自治区', value: 12000 },
  { name: '辽宁省', value: 10000 },
  { name: '吉林省', value: 5500 },
  { name: '黑龙江省', value: 7000 },
  { name: '上海市', value: 4800 },
  { name: '江苏省', value: 22000 },
  { name: '浙江省', value: 15000 },
  { name: '安徽省', value: 12000 },
  { name: '福建省', value: 8500 },
  { name: '江西省', value: 9000 },
  { name: '山东省', value: 25000 },
  { name: '河南省', value: 28000 },
  { name: '湖北省', value: 14000 },
  { name: '湖南省', value: 13000 },
  { name: '广东省', value: 20000 },
  { name: '广西壮族自治区', value: 9500 },
  { name: '海南省', value: 2500 },
  { name: '重庆市', value: 7500 },
  { name: '四川省', value: 16000 },
  { name: '贵州省', value: 8000 },
  { name: '云南省', value: 9000 },
  { name: '西藏自治区', value: 1000 },
  { name: '陕西省', value: 11000 },
  { name: '甘肃省', value: 6000 },
  { name: '青海省', value: 2000 },
  { name: '宁夏回族自治区', value: 3500 },
  { name: '新疆维吾尔自治区', value: 8000 },
  { name: '台湾省', value: 0 },
  { name: '香港特别行政区', value: 0 },
  { name: '澳门特别行政区', value: 0 },
]

// 中国省份政策目标力度模拟数据（0-100分）
const chinaPolicyScoreData = [
  { name: '北京市', value: 92 },
  { name: '天津市', value: 85 },
  { name: '河北省', value: 70 },
  { name: '山西省', value: 55 },
  { name: '内蒙古自治区', value: 45 },
  { name: '辽宁省', value: 65 },
  { name: '吉林省', value: 60 },
  { name: '黑龙江省', value: 58 },
  { name: '上海市', value: 90 },
  { name: '江苏省', value: 80 },
  { name: '浙江省', value: 85 },
  { name: '安徽省', value: 65 },
  { name: '福建省', value: 75 },
  { name: '江西省', value: 60 },
  { name: '山东省', value: 70 },
  { name: '河南省', value: 62 },
  { name: '湖北省', value: 68 },
  { name: '湖南省', value: 65 },
  { name: '广东省', value: 88 },
  { name: '广西壮族自治区', value: 58 },
  { name: '海南省', value: 70 },
  { name: '重庆市', value: 75 },
  { name: '四川省', value: 68 },
  { name: '贵州省', value: 50 },
  { name: '云南省', value: 55 },
  { name: '西藏自治区', value: 30 },
  { name: '陕西省', value: 62 },
  { name: '甘肃省', value: 45 },
  { name: '青海省', value: 40 },
  { name: '宁夏回族自治区', value: 38 },
  { name: '新疆维吾尔自治区', value: 35 },
  { name: '台湾省', value: 0 },
  { name: '香港特别行政区', value: 0 },
  { name: '澳门特别行政区', value: 0 },
]

// 中国省份排放趋势数据（2018-2022）
const chinaEmissionsTrendData = {
  北京: {
    biomass: [300, 290, 280, 270, 260],
    coal: [500, 480, 460, 440, 420],
    fossil: [800, 780, 760, 740, 720],
    landfill: [400, 390, 380, 370, 360],
    livestock: [200, 195, 190, 185, 180],
    oil_gas: [600, 580, 560, 540, 520],
    rice: [100, 98, 96, 94, 92],
    wastewater: [300, 290, 280, 270, 260],
  },
  上海: {
    biomass: [250, 245, 240, 235, 230],
    coal: [600, 580, 560, 540, 520],
    fossil: [1200, 1180, 1160, 1140, 1120],
    landfill: [800, 780, 760, 740, 720],
    livestock: [150, 145, 140, 135, 130],
    oil_gas: [700, 680, 660, 640, 620],
    rice: [120, 118, 116, 114, 112],
    wastewater: [400, 390, 380, 370, 360],
  },
  广东: {
    biomass: [700, 690, 680, 670, 660],
    coal: [2000, 1950, 1900, 1850, 1800],
    fossil: [3500, 3450, 3400, 3350, 3300],
    landfill: [2500, 2450, 2400, 2350, 2300],
    livestock: [1500, 1480, 1460, 1440, 1420],
    oil_gas: [4000, 3950, 3900, 3850, 3800],
    rice: [2800, 2780, 2760, 2740, 2720],
    wastewater: [3000, 2950, 2900, 2850, 2800],
  },
  四川: {
    biomass: [900, 910, 920, 930, 940],
    coal: [1800, 1780, 1760, 1740, 1720],
    fossil: [2000, 1980, 1960, 1940, 1920],
    landfill: [1500, 1480, 1460, 1440, 1420],
    livestock: [3500, 3520, 3540, 3560, 3580],
    oil_gas: [2000, 1980, 1960, 1940, 1920],
    rice: [2500, 2520, 2540, 2560, 2580],
    wastewater: [1800, 1780, 1760, 1740, 1720],
  },
}

// 中国省份政策数据
const chinaPolicyData = {
  北京: [
    {
      jurisdiction: '北京',
      year: 2018,
      sector: '多行业',
      policyName: '北京市打赢蓝天保卫战三年行动计划',
      type: '行动计划',
      targets: ['到2020年，全市PM2.5年均浓度比2015年下降30%以上'],
    },
    {
      jurisdiction: '北京',
      year: 2021,
      sector: '能源',
      policyName: '北京市能源消费总量和强度双控行动方案',
      type: '行动方案',
      targets: ['到2025年，非化石能源占一次能源消费比重达到14%左右'],
    },
  ],
  上海: [
    {
      jurisdiction: '上海',
      year: 2020,
      sector: '多行业',
      policyName: '上海市碳达峰实施方案',
      type: '实施方案',
      targets: ['力争2025年前实现碳达峰'],
    },
  ],
  广东: [
    {
      jurisdiction: '广东',
      year: 2019,
      sector: '工业、能源',
      policyName: '广东省绿色低碳循环发展实施方案',
      type: '实施方案',
      targets: ['到2025年，单位GDP能耗比2020年下降14%左右'],
    },
    {
      jurisdiction: '广东',
      year: 2021,
      sector: '交通',
      policyName: '广东省推广清洁能源汽车实施方案',
      type: '实施方案',
      targets: ['到2025年，全省新能源汽车新车销量占比达到20%以上'],
    },
  ],
  四川: [
    {
      jurisdiction: '四川',
      year: 2020,
      sector: '农业',
      policyName: '四川省农业农村碳达峰碳中和实施方案',
      type: '实施方案',
      targets: ['到2025年，农业面源污染得到初步遏制，主要农作物化肥、农药利用率达到43%以上'],
    },
  ],
}

// 弹窗，开始{
const mapInfoDialogVisible = ref(false)
const mapInfoDialogTitle = ref('')

// 项目详情弹窗
const projectDetailDialogVisible = ref(false)
const currentProjectDetail = ref<{ 
  name?: string; 
  address?: string;
  description?: string;
  agencies?: string;
  link?: string;
  [key: string]: any;
}>({})

// 选项卡
const mapTabsActive = ref('policyComprehensiveness')

// 选项卡1
const policyComprehensivenessTableData = ref([
  {
    country: 'Tom',
    jurisdiction: 'No. 189, Grove St, Los Angeles',
    yearEffective: 'N',
    policy: 'Y',
  },
])
// 选项卡2
const policyAmbitionScoreAndCorrespondingRankingTableData = ref([
  {
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])

// 选项卡3
const methaneEmissionsOverTimeForm = ref({
  totalEmission: '',
  emissionBySector: '',
})
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

// 选项卡4
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


// 选项卡5
const policyAndPilotProjectsTableData = ref([
  {
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
function handlePolicyAndPilotProjectsTableDataMoreClick(row: any) {
  console.warn('点击行:', row)
  currentProjectDetail.value = row
  projectDetailDialogVisible.value = true
}

// 下载表格数据
function downloadPolicyAndPilotProjectsData() {
  try {
    // 准备导出数据
    const exportData = policyAndPilotProjectsTableData.value.map(item => {
      // 创建一个带索引签名的对象，解决TypeScript错误
      const exportItem: { [key: string]: any } = {}
      
      // 遍历表格中所有列，将数据添加到导出对象
      if (item.address) exportItem['Jurisdiction'] = item.address
      if (item.address) exportItem['Specific Location'] = item.address
      if (item.address) exportItem['Latitude'] = item.address
      if (item.address) exportItem['Longitude'] = item.address
      if (item.address) exportItem['Country'] = item.address
      if (item.address) exportItem['Continent'] = item.address
      if (item.address) exportItem['Sector'] = item.address
      if (item.address) exportItem['Focus'] = item.address
      if (item.address) exportItem['Goal'] = item.address
      if (item.name) exportItem['Methane Mitigation/Utilization Amount'] = item.name
      if (item.address) exportItem['Government Partners'] = item.address
      if (item.address) exportItem['Start Time'] = item.address
      if (item.address) exportItem['End Time'] = item.address
      if (item.address) exportItem['Project Status'] = item.address
      if (item.address) exportItem['Federal/Central'] = item.address
      if (item.address) exportItem['State/Province'] = item.address
      if (item.address) exportItem['Local'] = item.address
      if (item.address) exportItem['Private'] = item.address
      if (item.address) exportItem['Other'] = item.address
      if (item.address) exportItem['Funding Appropriation Status'] = item.address
      if (item.address) exportItem['Funding Sources as Listed'] = item.address
      if (item.address) exportItem['Cost'] = item.address
      if (item.address) exportItem['Funding Gap'] = item.address
      if (item.address) exportItem['Metrics'] = item.address
      if (item.address) exportItem['Notes'] = item.address
      
      // 添加当前未显示在表格中但在详情弹窗中显示的字段
      // 使用类型断言解决TypeScript错误
      const rowWithDetails = item as { 
        name: string; 
        address: string; 
        description?: string;
        agencies?: string;
        link?: string;
      }
      
      if (rowWithDetails.description) exportItem['Project Description'] = rowWithDetails.description
      if (rowWithDetails.agencies) exportItem['Implementing Agencies'] = rowWithDetails.agencies
      if (rowWithDetails.link) exportItem['Link'] = rowWithDetails.link
      
      return exportItem
    })
    
    // 创建工作簿
    const wb = XLSX.utils.book_new()
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Policies and Projects')
    
    // 生成Excel文件并下载
    XLSX.writeFile(wb, `policies-and-projects-${new Date().getTime()}.xlsx`)
    
    ElMessage({
      type: 'success',
      message: 'Data exported successfully',
    })
  } catch (error: any) {
    console.error('Export failed:', error)
    ElMessage.error(`Export failed: ${error.message}`)
  }
}

function handleTotalEmissionChange(value: string) {
  if (value === 'emissionBySector') {
    methaneEmissionsOverTimeForm.value.emissionBySector = ''
  }
}

// 弹窗，结束}

// 反馈表单弹窗，开始{
const feedbackFormDialogVisible = ref(false)
// 反馈表单弹窗，结束}
const value = ref('')

// 定义地区地图和坐标点数据
const detailMapRef = ref<any>(null)
const detailMapOption = ref({})
const currentDetailMapName = ref('')
const projectPoints = ref<any[]>([])

// 模拟项目点位信息（实际项目中应从API获取）
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

const chinaProjectPoints = [
  { name: '北京市生物质能源项目', longitude: 116.4074, latitude: 39.9042, description: '生物质能源转换项目', value: 25 },
  { name: '北京市垃圾填埋气回收', longitude: 116.2363, latitude: 39.8343, description: '垃圾填埋场甲烷回收利用', value: 22 },
  { name: '四川省沼气利用工程', longitude: 104.0665, latitude: 30.6598, description: '农村沼气利用减排项目', value: 38 },
  { name: '四川省畜牧业减排', longitude: 103.7558, latitude: 29.6136, description: '畜牧业甲烷减排项目', value: 33 },
  { name: '上海市垃圾分类处理', longitude: 121.4737, latitude: 31.2304, description: '城市垃圾分类与甲烷回收', value: 31 },
  { name: '上海市工业废水处理', longitude: 121.5574, latitude: 31.0449, description: '工业废水处理减少甲烷排放', value: 27 },
  { name: '广东省畜牧业减排项目', longitude: 113.2644, latitude: 23.1291, description: '畜牧业甲烷捕获与利用', value: 29 },
  { name: '广东省天然气利用项目', longitude: 114.0579, latitude: 22.5431, description: '天然气替代煤炭清洁能源项目', value: 32 },
]

// 表单数据
const form = ref({
  name: '',
  email: '',
  region: '',
  message: '',
  captcha: '',
})

// 列表数据
const tableData = ref([])
const formInline = ref({
  user: '',
  region: '',
  date: '',
  policy: '',
})

function onSubmit() {
  console.warn('提交表单')
}

// 显示州或省份详情
function showStateDetails(name: string, country: string) {
  mapInfoDialogTitle.value = `${name}`
  mapInfoDialogVisible.value = true

  // 根据不同国家和地区加载对应数据
  if (country === 'usa') {
    // 加载美国数据
  }
  else if (country === 'china') {
    // 加载中国数据
  }
  
  // 初始化详细地图
  initDetailMap(name, country)
}

function initMap() {
  // 创建图表实例
  usaChart = echarts.init(document.getElementById('usa-map'))
  chinaChart = echarts.init(document.getElementById('china-map'))

  updateChinaMap()
  updateUSAMap()
}

// 地图切换数据
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

  let title: string
  let colorScheme: string[]
  let dataRange: number[]
  let mapData: any[] = []

  if (value === '1') {
    title = 'Total methane emissions by state in 2022'
    colorScheme = colorSchemes.emissions
    dataRange = [300, 35000]
    mapData = emissionsData
  }
  else if (value === '2') {
    title = 'Strength of policy objectives scores for each state'
    colorScheme = colorSchemes.policy
    dataRange = [0, 100]
    mapData = policyScoreData
  }
  else {
    title = 'USA'
    colorScheme = ['#e0e0e0']
    dataRange = [0, 100]
    mapData = []
  }

  const option = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
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
      text: ['高', '低'],
      calculable: true,
      show: value !== '0',
    },
    toolbox: {
      show: true,
      left: 'left',
      top: 'top',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {},
      },
    },
    series: [
      {
        name: '数据',
        type: 'map',
        roam: true,
        map: 'USA',
        emphasis: {
          label: {
            show: true,
          },
        },
        select: {
          label: {
            show: true,
          },
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

  let title: string
  let colorScheme: string[]
  let dataRange: number[]
  let mapData: any[] = []

  if (value === '1') {
    title = 'Total methane emissions by province in 2022'
    colorScheme = colorSchemes.emissions
    dataRange = [1000, 28000]
    mapData = chinaEmissionsData
  }
  else if (value === '2') {
    title = 'Policy ambition scores for each province'
    colorScheme = colorSchemes.policy
    dataRange = [30, 95]
    mapData = chinaPolicyScoreData
  }
  else {
    title = 'China'
    colorScheme = ['#e0e0e0']
    dataRange = [0, 100]
    mapData = []
  }

  const option = {
    backgroundColor: '#ffffff',
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
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
      text: ['高', '低'],
      calculable: true,
      show: value !== '0',
    },
    toolbox: {
      show: true,
      left: 'left',
      top: 'top',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {},
      },
    },
    series: [
      {
        name: '数据',
        type: 'map',
        map: 'China',
        roam: true,
        emphasis: {
          label: {
            show: true,
          },
        },
        select: {
          label: {
            show: true,
          },
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

function handleFeedbackClick() {
  feedbackFormDialogVisible.value = true
}

onMounted(() => {
  initMap()
  initLineChart()
  initPieChart()
})

// 折线图数据
const lineChartData = {
  years: ['2018', '2019', '2020', '2021', '2022'],
  values: [273.717, 289.451, 265.332, 301.245, 320.189],
}

// 初始化折线图
function initLineChart() {
  const option = {
    backgroundColor: '#fcdddf',
    tooltip: {
      trigger: 'axis',
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
      data: lineChartData.years,
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
      data: lineChartData.values,
    }],
  }

  lineChartOption.value = option
}

function downloadChart() {
  // 获取图表实例并下载
  if (lineChartRef.value && lineChartRef.value.chart) {
    const chartInstance = lineChartRef.value.chart
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fcdddf',
    })

    // 创建一个临时链接元素来下载图片
    const link = document.createElement('a')
    link.download = `methane-emissions-${new Date().getTime()}.png`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  else {
    ElMessage.warning('无法获取图表实例')
  }
}

function downloadChartData() {
  // 调用后台接口下载数据
  ElMessageBox.confirm(
    '确定要下载图表数据吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    },
  )
    .then(() => {
      // 这里应该调用后台接口
      // 模拟API调用
      ElMessage({
        type: 'success',
        message: '数据下载请求已发送',
      })

      // 实际项目中应该替换为真实的API调用
      // 例如: axios.get('/api/download-chart-data')
      //   .then(response => {
      //     // 处理响应
      //   })
      //   .catch(error => {
      //     ElMessage.error('下载失败：' + error.message)
      //   })
    })
    .catch(() => {
      // 用户取消下载
    })
}

// 初始化饼图
function initPieChart() {
  const option = {
    backgroundColor: '#fcdddf',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      itemGap: 20,
      data: methaneEmissionsBySectorsTableData.value.map(item => item.name)
    },
    grid: {
      containLabel: true
    },
    series: [
      {
        name: '排放源',
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
        data: methaneEmissionsBySectorsTableData.value.map(item => {
          return {
            name: item.name,
            value: parseFloat(item.year)
          }
        })
      }
    ]
  }
  
  pieChartOption.value = option
}

// 下载饼图
function downloadPieChart() {
  // 获取图表实例并下载
  if (pieChartRef.value && pieChartRef.value.chart) {
    const chartInstance = pieChartRef.value.chart
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fcdddf'
    })
    
    // 创建一个临时链接元素来下载图片
    const link = document.createElement('a')
    link.download = `methane-emissions-by-sector-${new Date().getTime()}.png`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    ElMessage.warning('无法获取图表实例')
  }
}

// 下载饼图数据
function downloadPieChartData() {
  // 调用后台接口下载数据
  ElMessageBox.confirm(
    '确定要下载饼图数据吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  )
    .then(() => {
      // 这里应该调用后台接口
      // 模拟API调用
      ElMessage({
        type: 'success',
        message: '饼图数据下载请求已发送',
      })
    })
    .catch(() => {
      // 用户取消下载
    })
}

// 初始化详细地区地图
function initDetailMap(mapName: string, country: string) {
  // 确保DOM已经渲染
  nextTick(() => {
    // 设置当前地图名称
    currentDetailMapName.value = mapName
    
    // 根据国家和地区名称确定显示哪些点位
    if (country === 'usa') {
      projectPoints.value = usaProjectPoints.filter(point => {
        // 这里筛选属于当前州的点位
        return point.name.includes(mapName);
      });
    } else if (country === 'china') {
      projectPoints.value = chinaProjectPoints.filter(point => {
        // 筛选属于当前省份的点位
        return point.name.includes(mapName);
      });
    } else {
      projectPoints.value = [];
    }
    
    // 模拟获取特定州或省的地图数据
    // 实际项目中应从API获取或使用预先准备好的地图数据
    // 这里为演示，我们提取GeoJSON中该州/省的特定Feature
    let stateFeature = null;
    let mapJsonData = null;
    
    if (country === 'usa') {
      // 从美国地图中找到对应的州
      stateFeature = usaJson.features.find(feature => feature.properties.name === mapName);
      if (stateFeature) {
        // 创建新的GeoJSON对象，只包含该州的feature
        mapJsonData = {
          type: 'FeatureCollection',
          features: [stateFeature]
        };
      } else {
        console.error(`未找到州: ${mapName}`);
        mapJsonData = {
          type: 'FeatureCollection', 
          features: []
        };
      }
    } else if (country === 'china') {
      // 从中国地图中找到对应的省
      stateFeature = chinaJson.features.find(feature => feature.properties.name === mapName);
      if (stateFeature) {
        // 创建新的GeoJSON对象，只包含该省的feature
        mapJsonData = {
          type: 'FeatureCollection',
          features: [stateFeature]
        };
      } else {
        console.error(`未找到省: ${mapName}`);
        mapJsonData = {
          type: 'FeatureCollection', 
          features: []
        };
      }
    }
    
    // 注册地图
    if (mapJsonData && mapJsonData.features.length > 0) {
      try {
        echarts.registerMap(mapName, mapJsonData);
        
        // 创建地图配置
        const option = {
          backgroundColor: '#ffffff',
          title: {
            text: `${mapName} 甲烷减排项目分布`,
            left: 'center',
            textStyle: {
              fontSize: 16,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
              if (params.componentSubType === 'effectScatter') {
                return `<b>${params.name}</b><br/>
                        ${params.data.description}<br/>
                        经度: ${params.data.longitude}<br/>
                        纬度: ${params.data.latitude}<br/>
                        减排量: ${params.data.value[2]} 千吨`;
              }
              return params.name;
            }
          },
          toolbox: {
            show: true,
            left: 'left',
            top: 'top',
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          visualMap: {
            show: false,
            min: 0,
            max: 50,
            inRange: {
              color: ['#FFC65D', '#FF9853', '#FF7B52', '#FF4C52']
            }
          },
          series: [
            {
              name: '地区',
              type: 'map',
              map: mapName,
              roam: true,
              emphasis: {
                label: {
                  show: true
                },
                itemStyle: {
                  areaColor: '#e6f7ff'
                }
              },
              itemStyle: {
                areaColor: '#f3f3f3',
                borderColor: '#999'
              },
              data: []
            },
            {
              name: '项目位置',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: projectPoints.value.map(point => ({
                name: point.name,
                value: [point.longitude, point.latitude, point.value],
                description: point.description
              })),
              symbolSize: function(val: any) {
                return val[2] / 3 + 12;
              },
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              itemStyle: {
                color: '#ff4c52',
                shadowBlur: 10,
                shadowColor: '#333'
              },
              zlevel: 1
            }
          ]
        };
        
        // 设置图表选项
        detailMapOption.value = option;
        
        // 确保图表已渲染并更新
        nextTick(() => {
          if (detailMapRef.value && detailMapRef.value.chart) {
            detailMapRef.value.chart.setOption(option, true);
          }
        });
      } catch (error) {
        console.error('地图注册或设置失败:', error);
      }
    } else {
      console.warn(`无法为 ${mapName} 加载地图数据`);
      
      // 创建备用地图显示
      const option = {
        backgroundColor: '#ffffff',
        title: {
          text: `${mapName} (地图数据暂不可用)`,
          left: 'center',
          textStyle: {
            fontSize: 16,
          },
        },
        series: []
      };
      
      detailMapOption.value = option;
      
      nextTick(() => {
        if (detailMapRef.value && detailMapRef.value.chart) {
          detailMapRef.value.chart.setOption(option, true);
        }
      });
    }
  });
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1 class="title">
          Global Methane Monitor
        </h1>
        <div class="description">
          Use the Global Methane Monitor to explore methane policy landscape, pilot mitigation projects, and emission trends in subnational jurisdiction worldwide.
        </div>
        <el-collapse accordion>
          <el-collapse-item name="1">
            <template #title>
              Names of Sector <el-icon class="header-icon">
                <info-filled />
              </el-icon>
            </template>
            <div>
              Biomass/biofuels burning
            </div>
            <div>
              Coal exploitation
            </div>
            <div>
              Fossil Energy Combustion
            </div>
            <div>
              Landfills
            </div>
            <div>
              Livestock
            </div>
            <div>
              Oil and gas exploitation
            </div>
            <div>Rice cultivation</div>
          </el-collapse-item>
        </el-collapse>
      </el-header>
      <el-main>
        <el-select
          v-model="value"
          clearable
          placeholder="Select Display Data "
          @change="handleUpdateMapChange"
        >
          <el-option
            label="total emission"
            value="1"
          />
          <el-option
            label="policy ambition"
            value="2"
          />
        </el-select>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="map-title">
              USA
            </div>
            <VChart id="usa-map" class="map-chart usa-map" :option="usaMapOption" autoresize />
          </el-col>
          <el-col :span="12">
            <div class="map-title">
              China
            </div>
            <VChart id="china-map" class="map-chart china-map" :option="chinaMapOption" autoresize />
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <footer>
          <el-descriptions>
            <el-descriptions-item label="Disclaimer">
              <div>Data subject to updates and change over time. Emission data is provided by 2022 and policy and project data is provided by 2024</div>
              <div>How to Cite the Data: [specific text TBD] </div>
            </el-descriptions-item>
            <el-descriptions-item label="Research Team">
              <div>
                California-China Climate Institute, University of California, Berkeley: Fan Dai, Rixin Zhu, Jessica Gordon
              </div>
              <div>
                Hong Kong University: Yuyu Zhou, Fengxiang Guo
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="Updates">
              CCCI will post notes about webpage updates periodically
            </el-descriptions-item>
            <el-descriptions-item label="Data Sources">
              Text TBD
            </el-descriptions-item>
            <el-descriptions-item label="Acknowledgments">
              We would like to thank Prof. Yuyu Zhou and Dr. Fengxiang Guo for sharing their data. We would also like to thank [list of website designers] for designing the site.
            </el-descriptions-item>
          </el-descriptions>
        </footer>
      </el-footer>
    </el-container>
  </div>

  <el-button class="feedback-btn" type="primary" :icon="Edit" circle @click="handleFeedbackClick" />

  <!-- 点击地图的弹窗 -->
  <el-dialog v-model="mapInfoDialogVisible" :title="mapInfoDialogTitle" width="800" draggable>
    <el-tabs v-model="mapTabsActive" class="map-tabs">
      <el-tab-pane label="policy comprehensiveness" name="policyComprehensiveness">
        <el-table :data="policyComprehensivenessTableData" border style="width: 100%">
          <el-table-column prop="jurisdiction" label="Jurisdiction" width="180" />
          <el-table-column prop="country" label="Country" width="180" />
          <el-table-column prop="yearEffective" label="Year Effective" width="180" />
          <el-table-column prop="policy" label="Policy" width="180" />
          <el-table-column prop="country" label="Type of Instrument" width="180" />
          <el-table-column prop="country" label="Cross-sectoral coordination (F)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Policy instruments (F)" width="180">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Evaluation and adjustment (S)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Stakeholder engagement (S)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Stringency (F)" width="180">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Enforceability (F)" width="180">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Emission source coverage (S)" width="240">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Monitoring protocols (S)" width="200">
            <template #default="{ row }">
              <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
                {{ row.country }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="country" label="Total Policy Score" width="180" />
          <el-table-column prop="country" label="Comprehensiveness Score" width="220" />
          <el-table-column prop="country" label="Ambition Score" width="180" />
          <el-table-column prop="country" label="Link" width="180" />
          <el-table-column prop="country" label="Policy Description" width="180" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Policy ambition score and corresponding ranking" name="policyAmbitionScoreAndCorrespondingRanking">
        <el-table :data="policyAmbitionScoreAndCorrespondingRankingTableData" border style="width: 100%">
          <el-table-column prop="name" label="name" width="120" />
          <el-table-column prop="address" label="Total_Policy_Score" />
          <el-table-column prop="address" label="Comprehensiveness_Score" width="260" />
          <el-table-column prop="address" label="Ambition_Score" />
        </el-table>
        <div class="remark">
          Data Provided by CCCI
        </div>
      </el-tab-pane>
      <el-tab-pane label="methane emissions over time" name="methaneEmissionsOverTime">
        <el-form :inline="true" :model="methaneEmissionsOverTimeForm" class="demo-form-inline">
          <el-form-item>
            <el-select
              v-model="methaneEmissionsOverTimeForm.totalEmission"
              placeholder="total emission"
              style="width: 240px"
              @change="handleTotalEmissionChange"
            >
              <el-option
                label="total emission"
                value="totalEmission"
              />
              <el-option
                label="emission by sector"
                value="emissionBySector"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-if="methaneEmissionsOverTimeForm.totalEmission === 'emissionBySector'"
              v-model="methaneEmissionsOverTimeForm.emissionBySector"
              placeholder="emission by sector"
              style="width: 240px"
            >
              <el-option
                label="Biomass/biofuel burning"
                value="Biomass/biofuel burning"
              />
              <el-option
                label="Coal exploitation"
                value="Coal exploitation"
              />
              <el-option
                label="Fossil energy combustion"
                value="Fossil energy combustion"
              />
              <el-option
                label="Landfills"
                value="Landfills"
              />
              <el-option
                label="Livestock"
                value="Livestock"
              />
              <el-option
                label="Oil&Gas exploitation"
                value="Oil&Gas exploitation"
              />
              <el-option
                label="Rice cultivation"
                value="Rice cultivation"
              />
              <el-option
                label="Wastewater"
                value="Wastewater"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">
              Query
            </el-button>
          </el-form-item>
        </el-form>

        <div class="chart-actions">
          <el-button type="primary" size="small" @click="downloadChart">
            <el-icon><Download /></el-icon> Download chart
          </el-button>
          <el-button type="success" size="small" @click="downloadChartData">
            <el-icon><DocumentCopy /></el-icon> Download data
          </el-button>
        </div>

        <div id="line-chart" class="chart">
          <VChart class="line-chart" :option="lineChartOption" ref="lineChartRef" autoresize />
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
      </el-tab-pane>
      <el-tab-pane label="methane emissions (by sectors)" name="methaneEmissionsBySectors">
        <div class="chart-actions">
          <el-button type="primary" size="small" @click="downloadPieChart">
            <el-icon><Download /></el-icon> 下载图表
          </el-button>
          <el-button type="success" size="small" @click="downloadPieChartData">
            <el-icon><DocumentCopy /></el-icon> 下载数据
          </el-button>
        </div>
        
        <div id="pie-chart" class="chart">
          <VChart class="pie-chart" :option="pieChartOption" ref="pieChartRef" autoresize />
        </div>
        
        <el-table :data="methaneEmissionsBySectorsTableData" border style="width: 100%">
          <el-table-column prop="name" label="Source" width="500" />
          <el-table-column prop="year" label="2022" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="policies and pilot projects" name="policiesAndPilotProjects">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item style="width: 310px">
              <el-input v-model="formInline.user" placeholder="Jurisdiction" clearable />
            </el-form-item>
            <el-form-item style="width: 180px">
              <el-select
                
                v-model="formInline.region"
                placeholder="Sectors"
                clearable
              >
                <el-option label="Agriculture" value="Agriculture" />
                <el-option label="AAAA" value="AAAA" />
                <el-option label="BBBB" value="BBBB" />
                <el-option label="CCCC" value="CCCC" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="formInline.date"
                range-separator="To"
                start-placeholder="Start year"
                end-placeholder="End year"
                type="yearrange"
                placeholder="Year"
                clearable
              />
            </el-form-item>
            <el-form-item  style="width: 310px">
              <el-input v-model="formInline.policy" placeholder="Policy" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">
                Query
              </el-button>
              <el-button type="success" @click="downloadPolicyAndPilotProjectsData">
                <el-icon><DocumentCopy /></el-icon> Download
              </el-button>
            </el-form-item>
          </el-form>
        <el-table :data="policyAndPilotProjectsTableData" border style="width: 100%">

            <el-table-column prop="address" label="Jurisdiction" width="200" />
            <el-table-column prop="address" label="Specific Location" width="200" />
            <el-table-column prop="address" label="Latitude" width="200" />
            <el-table-column prop="address" label="Longitude" width="200" />
            <el-table-column prop="address" label="Country" width="200" />
            <el-table-column prop="address" label="Continent" width="200" />
            <el-table-column prop="address" label="Sector" width="200" />
            <el-table-column prop="address" label="Focus" width="200" />
            <!-- <el-table-column prop="address" label="Project Description" width="200" /> -->
            <el-table-column prop="address" label="Goal" width="200" />
          <el-table-column prop="name" label="Methane Mitigation/Utilization Amount" width="300" />
          <!-- <el-table-column prop="address" label="Implementing Agencies" width="200" /> -->
          <el-table-column prop="address" label="Government Partners" width="200" />
          <!-- <el-table-column prop="address" label="Link" width="200" /> -->
          <el-table-column prop="address" label="Start Time" width="120" />
          <el-table-column prop="address" label="End Time" width="120" />
          <el-table-column prop="address" label="Project Status" width="120" />
          <el-table-column prop="address" label="Federal/Central" width="180" />
          <el-table-column prop="address" label="State/Province" width="180" />
          <el-table-column prop="address" label="Local" width="120" />
          <el-table-column prop="address" label="Private" width="120" />
          <el-table-column prop="address" label="Other" width="120" />
          <el-table-column prop="address" label="Funding Appropriation Status" width="300" />
          <el-table-column prop="address" label="Funding Sources as Listed" width="300" />
          <el-table-column prop="address" label="Cost" width="120" />
          <el-table-column prop="address" label="Funding Gap" width="180" />
          <el-table-column prop="address" label="Metrics" width="120" />
          <el-table-column prop="address" label="Notes" width="300" />
          <el-table-column label="Operation" width="120" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="default" size="small" @click="handlePolicyAndPilotProjectsTableDataMoreClick(row)">View More</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="Pilot Project Positioning Map" name="pilotProjectPositioningMap">
        <div class="detail-map-container">
          <div class="map-description">
            以下地图显示了 <strong>{{ currentDetailMapName }}</strong> 区域的甲烷减排项目分布情况，每个标记点代表一个项目位置。鼠标悬停在标记点上可查看详细信息。
          </div>
          <div v-if="projectPoints.length > 0" class="detail-map-info">
            该区域共有 <strong>{{ projectPoints.length }}</strong> 个减排项目，总减排量：
            <strong>{{ projectPoints.reduce((sum, point) => sum + point.value, 0) }}</strong> 千吨
          </div>
          <VChart class="detail-map" :option="detailMapOption" ref="detailMapRef" autoresize />
          
          <div class="point-list" v-if="projectPoints.length > 0">
            <h3>项目列表</h3>
            <el-table :data="projectPoints" border style="width: 100%">
              <el-table-column prop="name" label="项目名称" />
              <el-table-column prop="description" label="项目描述" />
              <el-table-column prop="longitude" label="经度" width="100" />
              <el-table-column prop="latitude" label="纬度" width="100" />
              <el-table-column prop="value" label="减排量(千吨)" width="120" />
            </el-table>
          </div>
          <div v-else class="no-data">
            当前区域暂无项目数据
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <!-- 反馈表单弹出框 -->
  <el-dialog v-model="feedbackFormDialogVisible" title="Feedback or Request Assistance" width="500" draggable>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="Subject">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Feedback" value="1" />
          <el-option label="Contact CCCI" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="Message">
        <el-input v-model="form.message" type="textarea" />
      </el-form-item>
      <el-form-item label="CAPTCHA">
        <el-col :span="10">
          <el-image style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
        </el-col>
        <el-col :span="14">
          <el-input v-model="form.captcha" placeholder="Please enter the verification code" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          Send
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="mapInfoDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="mapInfoDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 项目详情弹窗 -->
  <el-dialog v-model="projectDetailDialogVisible" title="Project Details" width="700" draggable>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Project Description">
        {{ currentProjectDetail.description || 'No description available' }}
      </el-descriptions-item>
      <el-descriptions-item label="Implementing Agencies">
        {{ currentProjectDetail.agencies || 'No implementing agencies information available' }}
      </el-descriptions-item>
      <el-descriptions-item label="Link">
        <a :href="currentProjectDetail.link" target="_blank" v-if="currentProjectDetail.link">
          {{ currentProjectDetail.link }}
        </a>
        <span v-else>No link available</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<style lang='scss' scoped>
.map-chart {
  width: 100%;
  height: 500px;
}

.map-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.feedback-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
}

.remark {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.line-chart {
  width: 100%;
  height: 260px;
}

.pie-chart {
  width: 100%;
  height: 400px;
}

.chart {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
}
::v-deep(.el-form--inline .el-form-item) {
  margin-right: 12px;
}

.chart-actions {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
}

.detail-map {
  width: 100%;
  height: 500px;
}

.detail-map-container {
  padding: 15px;
}

.map-description {
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.point-list {
  margin-top: 20px;
}

.no-data {
  text-align: center;
  margin: 20px 0;
  color: #999;
  font-size: 14px;
}

.detail-map-info {
  background-color: #f0f9ff;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border-left: 4px solid #1890ff;
}
</style>
