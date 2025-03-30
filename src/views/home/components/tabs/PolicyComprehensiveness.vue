<script setup lang='ts'>
import { ref } from 'vue'

const policyComprehensivenessTableData = ref([
  {
    country: 'Tom',
    jurisdiction: 'No. 189, Grove St, Los Angeles',
    yearEffective: 'N',
    policy: 'Y',
  },
])
</script>

<template>
  <div class="policy-comprehensiveness">
    <el-table :data="policyComprehensivenessTableData" border style="width: 100%">
      <el-table-column prop="jurisdiction" label="Jurisdiction" width="180" />
      <el-table-column prop="country" label="Country" width="180" />
      <el-table-column prop="yearEffective" label="Year Effective" width="180" />
      <el-table-column prop="policy" label="Policy" width="180" />
      <el-table-column prop="country" label="Type of Instrument" width="180" />
      <el-table-column prop="yearEffective" label="Cross-sectoral coordination (F)" width="240">
        <template #default="{ row }">
          <span :style="{ color: row.country === 'Y' ? 'green' : 'red' }">
            {{ row.country }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="yearEffective" label="Policy instruments (F)" width="180">
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
  </div>
</template>

<style lang="scss" scoped>
.policy-comprehensiveness {
  width: 100%;
  overflow-x: auto;
}

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
</style>
