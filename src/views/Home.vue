<template>
  <div class="home-container">
    <div class="welcome-card">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎回来，{{ userStore.username }}！</h1>
        <p class="welcome-text">准备好开始今天的美食之旅了吗？</p>
      </div>
      <div class="welcome-image">
        <img src="@/assets/cooking.svg" alt="Cooking" />
      </div>
    </div>
    
    <el-row :gutter="20" class="action-cards">
      <el-col :xs="24" :sm="12" :md="8">
        <div class="action-card" @click="$router.push('/personalization')">
          <div class="card-icon personalization">
            <el-icon :size="32"><Setting /></el-icon>
          </div>
          <h3>个性化设置</h3>
          <p>设置您的口味偏好和食材库存</p>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <div class="action-card" @click="$router.push('/recipes')">
          <div class="card-icon recipes">
            <el-icon :size="32"><Dish /></el-icon>
          </div>
          <h3>菜谱推荐</h3>
          <p>获取AI为您推荐的菜谱</p>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <div class="action-card" @click="$router.push('/personalization')">
          <div class="card-icon inventory">
            <el-icon :size="32"><ShoppingCart /></el-icon>
          </div>
          <h3>食材管理</h3>
          <p>查看和管理您的食材库存</p>
        </div>
      </el-col>
    </el-row>
    
    <div class="quick-summary">
      <el-card class="summary-card">
        <template #header>
          <div class="card-header">
            <span>您的个性化设置</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="summary-item">
              <el-icon class="summary-icon"><Star /></el-icon>
              <div class="summary-info">
                <span class="summary-label">口味偏好</span>
                <span class="summary-value">{{ userStore.preferences.length }} 个</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="summary-item">
              <el-icon class="summary-icon"><ShoppingCart /></el-icon>
              <div class="summary-info">
                <span class="summary-label">食材库存</span>
                <span class="summary-value">{{ userStore.inventory.length }} 种</span>
              </div>
            </div>
          </el-col>
        </el-row>
        
        <el-button type="primary" text @click="$router.push('/personalization')">
          查看详情
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Setting, Dish, ShoppingCart, Star, ArrowRight } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(async () => {
  await Promise.all([
    userStore.fetchPreferences(),
    userStore.fetchInventory()
  ])
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: #fff;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.welcome-text {
  font-size: 16px;
  opacity: 0.9;
}

.welcome-image img {
  width: 120px;
  height: 120px;
}

.action-cards {
  margin-bottom: 24px;
}

.action-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  height: 100%;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.card-icon.personalization {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: #fff;
}

.card-icon.recipes {
  background: linear-gradient(135deg, #67C23A 0%, #85ce61 100%);
  color: #fff;
}

.card-icon.inventory {
  background: linear-gradient(135deg, #E6A23C 0%, #f3c06b 100%);
  color: #fff;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 14px;
  color: #909399;
}

.summary-card {
  border-radius: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.summary-icon {
  font-size: 24px;
  color: #409EFF;
}

.summary-info {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 14px;
  color: #909399;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-image {
    margin-top: 24px;
  }
  
  .welcome-image img {
    width: 80px;
    height: 80px;
  }
}
</style>
