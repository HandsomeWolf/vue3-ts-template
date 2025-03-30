<script setup lang='ts'>
import { ref } from 'vue'

const feedbackFormDialogVisible = ref(false)
// 表单数据
const feedbackForm = ref({
  name: '',
  email: '',
  region: '',
  message: '',
  captcha: '',
})

function handleFeedbackFormSubmit() {
  console.warn('提交反馈表单')
  feedbackFormDialogVisible.value = false
  feedbackForm.value = {
    name: '',
    email: '',
    region: '',
    message: '',
    captcha: '',
  }
}

function showFeedbackDialog() {
  feedbackFormDialogVisible.value = true
}

// 导出方法供父组件使用
defineExpose({
  showFeedbackDialog,
})
</script>

<template>
  <!-- 反馈表单弹出框 -->
  <el-dialog v-model="feedbackFormDialogVisible" title="Feedback or Request Assistance" width="500" draggable>
    <el-form :model="feedbackForm" label-width="auto" style="max-width: 600px">
      <el-form-item label="Name">
        <el-input v-model="feedbackForm.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="feedbackForm.email" />
      </el-form-item>
      <el-form-item label="Subject">
        <el-select v-model="feedbackForm.region" placeholder="please select your zone">
          <el-option label="Feedback" value="1" />
          <el-option label="Contact CCCI" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="Message">
        <el-input v-model="feedbackForm.message" type="textarea" />
      </el-form-item>
      <el-form-item label="CAPTCHA">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input v-model="feedbackForm.captcha" placeholder="Please enter the verification code" />
          </el-col>
          <el-col :span="8">
            <el-image
              style="width: 100%; border-radius: 6px"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleFeedbackFormSubmit">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang='scss' scoped>
// 对话框样式优化
:deep(.el-dialog) {
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
}
</style>
