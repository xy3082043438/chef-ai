<template>
  <div class="loading-spinner" v-if="loading">
    <el-icon class="loading-icon" :size="size">
      <Loading />
    </el-icon>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  size: {
    type: Number,
    default: 48
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.loading-icon {
  animation: rotating 2s linear infinite;
  color: #409EFF;
}

.loading-text {
  margin-top: 12px;
  color: #909399;
  font-size: 14px;
}

@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
