<script setup lang='ts'>
import { ref } from 'vue'

const policyAmbitionScoreAndCorrespondingRankingTableData = ref([
  {
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
</script>

<template>
  <div class="policy-ambition-score">
    <el-table :data="policyAmbitionScoreAndCorrespondingRankingTableData" border style="width: 100%">
      <el-table-column prop="name" label="name" width="120" />
      <el-table-column prop="address" label="Total_Policy_Score" />
      <el-table-column prop="address" label="Comprehensiveness_Score" width="260" />
      <el-table-column prop="address" label="Ambition_Score" />
    </el-table>
    <div class="remark">
      Data Provided by CCCI
    </div>
  </div>
</template>

<style lang="scss" scoped>
.policy-ambition-score {
  width: 100%;

  :deep(.el-table) {
    margin-top: 15px;
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
}
</style>
