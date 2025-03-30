<script setup lang='ts'>
import DownloadDataButton from '@/components/echarts/DownloadDataButton.vue'
import { exportToExcel } from '@/utils'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 搜索表单数据
const policiesAndPilotProjectsForm = ref({
  user: '',
  region: '',
  date: '',
  policy: '',
})

// 表格数据
const policyAndPilotProjectsTableData = ref([
  {
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])

// 项目详情弹窗
const projectDetailDialogVisible = ref(false)
const currentProjectDetail = ref<{
  name?: string
  address?: string
  description?: string
  agencies?: string
  link?: string
  [key: string]: any
}>({})

// 窗口宽度监听
const windowWidth = ref(window.innerWidth)

// 查询提交
function handlePoliciesAndPilotProjectsSubmit() {
  console.warn('提交政策与试点项目查询', policiesAndPilotProjectsForm.value)
  // 这里可以添加实际查询逻辑
}

// 更多按钮点击事件
function handlePolicyAndPilotProjectsTableDataMoreClick(row: any) {
  console.warn('点击行:', row)
  currentProjectDetail.value = row
  projectDetailDialogVisible.value = true
}

// 下载表格数据
function downloadPolicyAndPilotProjectsData() {
  try {
    // 为address字段创建多个映射
    const repeatedFields = [
      'Jurisdiction',
      'Specific Location',
      'Latitude',
      'Longitude',
      'Country',
      'Continent',
      'Sector',
      'Focus',
      'Goal',
      'Government Partners',
      'Start Time',
      'End Time',
      'Project Status',
      'Federal/Central',
      'State/Province',
      'Local',
      'Private',
      'Other',
      'Funding Appropriation Status',
      'Funding Sources as Listed',
      'Cost',
      'Funding Gap',
      'Metrics',
      'Notes',
    ]

    // 准备导出数据
    const exportData = policyAndPilotProjectsTableData.value.map((item) => {
      // 创建一个导出对象
      const exportItem: Record<string, any> = {}

      // 添加基本字段
      if (item.name)
        exportItem['Methane Mitigation/Utilization Amount'] = item.name

      // 针对详情字段进行处理
      const rowWithDetails = item as {
        name: string
        address: string
        description?: string
        agencies?: string
        link?: string
      }

      if (rowWithDetails.description)
        exportItem['Project Description'] = rowWithDetails.description
      if (rowWithDetails.agencies)
        exportItem['Implementing Agencies'] = rowWithDetails.agencies
      if (rowWithDetails.link)
        exportItem.Link = rowWithDetails.link

      // 对address字段进行多重映射
      if (item.address) {
        repeatedFields.forEach((field) => {
          exportItem[field] = item.address
        })
      }

      return exportItem
    })

    // 导出到Excel
    exportToExcel(exportData, 'policies-and-projects', 'Policies and Projects')
  }
  catch (error: any) {
    console.error('Export failed:', error)
    ElMessage.error(`Export failed: ${error.message}`)
  }
}

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
</script>

<template>
  <div class="policies-and-pilot-projects">
    <el-form :inline="true" :model="policiesAndPilotProjectsForm" class="demo-form-inline">
      <el-form-item style="width: 310px">
        <el-input v-model="policiesAndPilotProjectsForm.user" placeholder="Jurisdiction" clearable />
      </el-form-item>
      <el-form-item style="width: 180px">
        <el-select v-model="policiesAndPilotProjectsForm.region" placeholder="Sectors" clearable>
          <el-option label="Agriculture" value="Agriculture" />
          <el-option label="AAAA" value="AAAA" />
          <el-option label="BBBB" value="BBBB" />
          <el-option label="CCCC" value="CCCC" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="policiesAndPilotProjectsForm.date" range-separator="To"
          start-placeholder="Start year" end-placeholder="End year" type="yearrange"
          placeholder="Year" clearable
        />
      </el-form-item>
      <el-form-item style="width: 310px">
        <el-input v-model="policiesAndPilotProjectsForm.policy" placeholder="Policy" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handlePoliciesAndPilotProjectsSubmit">
          Query
        </el-button>
        <DownloadDataButton :on-click="downloadPolicyAndPilotProjectsData" label="Download" />
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
          <el-button
            type="default" size="small"
            @click="handlePolicyAndPilotProjectsTableDataMoreClick(row)"
          >
            View More
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 项目详情弹窗 -->
    <el-dialog
      v-model="projectDetailDialogVisible"
      title="Project Details"
      :width="windowWidth <= 768 ? '95%' : '700'"
      draggable
      class="project-detail-dialog"
      top="5vh"
      :fullscreen="windowWidth <= 576"
    >
      <el-descriptions :column="windowWidth <= 576 ? 1 : 1" border>
        <el-descriptions-item label="Project Description">
          {{ currentProjectDetail.description || 'No description available' }}
        </el-descriptions-item>
        <el-descriptions-item label="Implementing Agencies">
          {{ currentProjectDetail.agencies || 'No implementing agencies information available' }}
        </el-descriptions-item>
        <el-descriptions-item label="Link">
          <a v-if="currentProjectDetail.link" :href="currentProjectDetail.link" target="_blank">
            {{ currentProjectDetail.link }}
          </a>
          <span v-else>No link available</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.policies-and-pilot-projects {
  width: 100%;
}

.el-form.demo-form-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  .el-form-item {
    margin-bottom: 10px;
    margin-right: 0;

    @media (max-width: $breakpoint-sm) {
      width: calc(50% - 5px) !important;

      .el-input, .el-select {
        width: 100%;
      }
    }

    @media (max-width: $breakpoint-xs) {
      width: 100% !important;
    }
  }

  @media (max-width: $breakpoint-xs) {
    .el-button {
      width: 100%;
    }
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

  .el-button--small {
    padding: 8px 15px;
  }

  @media (max-width: $breakpoint-sm) {
    // 移动端表格滚动优化
    .el-scrollbar__wrap {
      overflow-x: auto;
    }

    .el-table__body {
      width: 100% !important;
    }

    .el-table__fixed-right {
      height: auto !important;
    }

    // 固定列样式优化
    .is-right-fixed {
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: -3px 0 5px rgba(0, 0, 0, 0.05);
    }
  }

  @media (max-width: $breakpoint-xs) {
    .cell {
      padding: 8px;
      font-size: 12px;
    }

    .el-button--small {
      padding: 5px 10px;
      font-size: 12px;
    }
  }
}

:deep(.project-detail-dialog) {
  border-radius: 8px;
  overflow: hidden;

  .el-dialog__header {
    padding: 20px;
    background-color: #f5f7fa;
  }

  .el-dialog__title {
    font-weight: bold;
    color: #303133;
  }

  .el-dialog__body {
    padding: 25px;
  }

  @media (max-width: $breakpoint-sm) {
    .el-dialog__body {
      padding: 15px;
    }

    .el-dialog__header {
      padding: 15px;
    }
  }

  @media (max-width: $breakpoint-xs) {
    .el-dialog__body {
      padding: 10px;
    }

    .el-dialog__header {
      padding: 12px;
    }

    .el-descriptions__label {
      padding: 10px;
      font-size: 13px;
    }

    .el-descriptions__content {
      padding: 10px;
      font-size: 13px;
    }
  }
}
</style>
