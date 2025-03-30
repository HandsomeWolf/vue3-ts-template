<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const feedbackFormDialogVisible = ref(false)
// 表单数据
const feedbackForm = ref({
  name: '',
  email: '',
  region: '',
  message: '',
  captcha: '',
})

// 表单引用
const formRef = ref<FormInstance>()

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please enter your name', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please enter your email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email format', trigger: 'blur' },
  ],
  region: [
    { required: true, message: 'Please select a subject', trigger: 'change' },
  ],
  message: [
    { required: true, message: 'Please enter your message', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: 'Please enter the verification code', trigger: 'blur' },
  ],
})

function handleFeedbackFormSubmit() {
  if (!formRef.value)
    return

  formRef.value.validate((valid) => {
    if (valid) {
      console.warn('Form submitted successfully')
      feedbackFormDialogVisible.value = false
      // 重置表单
      formRef.value?.resetFields()
    }
    else {
      console.error('Form validation failed')
    }
  })
}

function showFeedbackDialog() {
  feedbackFormDialogVisible.value = true
}

// 窗口宽度监听
const windowWidth = ref(window.innerWidth)

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

// 导出方法供父组件使用
defineExpose({
  showFeedbackDialog,
})
</script>

<template>
  <!-- 反馈表单弹出框 -->
  <el-dialog
    v-model="feedbackFormDialogVisible"
    title="Feedback or Request Assistance"
    :width="windowWidth <= 768 ? '95%' : '500'"
    draggable
    class="feedback-dialog"
    top="5vh"
    :fullscreen="windowWidth <= 576"
  >
    <el-form
      ref="formRef"
      :model="feedbackForm"
      :rules="rules"
      label-width="auto"
      status-icon
      style="max-width: 600px"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="feedbackForm.name" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="feedbackForm.email" />
      </el-form-item>
      <el-form-item label="Subject" prop="region">
        <el-select v-model="feedbackForm.region" placeholder="please select a subject">
          <el-option label="Feedback" value="1" />
          <el-option label="Contact CCCI" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="Message" prop="message">
        <el-input v-model="feedbackForm.message" type="textarea" />
      </el-form-item>
      <el-form-item label="CAPTCHA" prop="captcha">
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
        <el-button @click="feedbackFormDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleFeedbackFormSubmit">
          Submit
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang='scss' scoped>
// 对话框样式优化
:deep(.feedback-dialog) {
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

    .el-form-item__label {
      font-size: 14px;
    }
  }

  @media (max-width: $breakpoint-xs) {
    .el-dialog__body {
      padding: 10px;
    }

    .el-dialog__header {
      padding: 12px;
    }

    .el-form-item {
      margin-bottom: 15px;
    }
  }
}
</style>
