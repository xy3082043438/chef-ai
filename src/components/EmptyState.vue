<template>
  <div class="empty-state">
    <el-icon class="empty-icon">
      <component :is="icon" />
    </el-icon>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FolderOpened, Document, Warning } from '@element-plus/icons-vue'

const props = defineProps({
  type: {
    type: String,
    default: 'folder',
    validator: (val) => ['folder', 'document', 'warning'].includes(val)
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  }
})

const iconMap = {
  folder: FolderOpened,
  document: Document,
  warning: Warning
}

const icon = computed(() => iconMap[props.type] || FolderOpened)
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 72px;
  color: #DCDFE6;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
}
</style>
