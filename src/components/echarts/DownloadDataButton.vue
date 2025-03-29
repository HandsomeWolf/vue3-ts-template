<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'
import type { PropType } from 'vue'

defineProps({
  onClick: {
    type: Function as PropType<() => void>,
    required: true
  },
  label: {
    type: String,
    default: '下载数据'
  }
})
</script>

<template>
  <el-button type="success" @click="onClick" :icon="DocumentCopy">
    {{ label }}
  </el-button>
</template> 