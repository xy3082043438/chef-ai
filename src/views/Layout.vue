<template>
  <div class="layout-container">
    <el-container class="layout-wrapper">
      <el-aside width="220px" class="sidebar">
        <div class="sidebar-header">
          <img class="logo" src="/logo.jpg" alt="Chef AI" />
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          
          <el-menu-item index="/personalization">
            <el-icon><Setting /></el-icon>
            <span>个性化设置</span>
          </el-menu-item>
          
          <el-menu-item index="/recipes">
            <el-icon><Dish /></el-icon>
            <span>菜谱推荐</span>
          </el-menu-item>
        </el-menu>
        
        <div class="sidebar-footer">
          <div class="user-info">
            <el-avatar :size="40" :src="userStore.user?.avatar">
              {{ userStore.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
            <div class="user-detail">
              <span class="username">{{ userStore.username }}</span>
              <span class="user-email">{{ userStore.user?.email }}</span>
            </div>
          </div>
          <el-button type="text" @click="handleLogout" class="logout-btn">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </el-aside>
      
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { HomeFilled, Setting, Dish, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    userStore.logout()
    router.push('/login')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.layout-wrapper {
  min-height: 100vh;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}

.logo {
  display: block;
  width: auto;
  height: auto;
  max-width: 160px;
  max-height: 48px;
  margin: 0;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.user-email {
  font-size: 12px;
  color: #909399;
}

.logout-btn {
  width: 100%;
  color: #f56c6c;
}

.logout-btn:hover {
  background: #fef0f0;
}

.main-content {
  background: #f5f7fa;
  padding: 24px;
  overflow-y: auto;
}
</style>
