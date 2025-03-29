<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import type { PropType } from 'vue'

defineProps({
  onClick: {
    type: Function as PropType<() => void>,
    required: true
  },
  label: {
    type: String,
    default: '下载图表'
  }
})
</script>

<template>
  <el-button type="primary" @click="onClick" :icon="Download">
    {{ label }}
  </el-button>
</template> 