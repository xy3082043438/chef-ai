<template>
  <div class="recipes-container">
    <div class="page-header">
      <h1 class="page-title">菜谱推荐</h1>
      <p class="page-description">基于您的口味偏好和食材库存，AI 为您推荐美味菜谱</p>
    </div>

    <el-card class="user-summary">
      <el-row :gutter="20" align="middle">
        <el-col :xs="24" :sm="16" :md="16">
          <div class="summary-info">
            <div class="summary-item">
              <el-icon><Star /></el-icon>
              <span>口味偏好：{{ userStore.preferences.map(p => p.preferenceName).join('、') || '未设置' }}</span>
            </div>
            <div class="summary-item">
              <el-icon><ShoppingCart /></el-icon>
              <span>可用食材：{{ userStore.inventory.map(i => i.foodName).join('、') || '未设置' }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" class="action-col">
          <el-button type="primary" size="large" @click="generateRecipes" :loading="generating" class="generate-btn">
            <el-icon><MagicStick /></el-icon>
            生成推荐
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <div v-if="recipeStore.loading" class="loading-container">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p>正在生成菜谱推荐...</p>
    </div>

    <div v-else-if="recipeStore.recipes.length > 0" class="recipes-grid">
      <el-card
        v-for="recipe in recipeStore.recipes"
        :key="recipe.menuId"
        class="recipe-card"
        @click="viewRecipe(recipe.menuId)"
      >
        <div class="recipe-image">
          <el-image
            :src="recipe.imageUrl"
            fit="cover"
            :lazy="true"
          >
            <template #error>
              <div class="image-placeholder">
                <el-icon :size="48"><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="recipe-info">
          <h3 class="recipe-name">{{ recipe.menuName }}</h3>
          <div class="recipe-ingredients">
            <el-tag
              v-for="(ing, index) in (recipe.ingredients || []).slice(0, 3)"
              :key="index"
              size="small"
              type="info"
            >
              {{ ing }}
            </el-tag>
            <el-tag v-if="(recipe.ingredients || []).length > 3" size="small" type="info">
              +{{ (recipe.ingredients || []).length - 3 }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty
      v-else-if="!recipeStore.loading"
      description="还没有菜谱推荐"
    >
      <template #description>
        <p>点击"生成推荐"按钮，让 AI 为您推荐美味菜谱</p>
      </template>
      <el-button type="primary" @click="generateRecipes">
        <el-icon><MagicStick /></el-icon>
        生成推荐
      </el-button>
    </el-empty>

    <el-divider />

    <div class="history-header">
      <h2 class="history-title">历史记录</h2>
      <el-button text @click="loadHistory" :loading="historyLoading">
        刷新
      </el-button>
    </div>

    <div v-if="historyLoading" class="loading-container">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p>正在加载历史菜谱...</p>
    </div>

    <div v-else-if="recipeStore.history.length > 0" class="recipes-grid">
      <el-card
        v-for="recipe in recipeStore.history"
        :key="`history-${recipe.menuId}`"
        class="recipe-card"
        @click="viewRecipe(recipe.menuId)"
      >
        <div class="recipe-image">
          <el-image
            :src="recipe.imageUrl"
            fit="cover"
            :lazy="true"
          >
            <template #error>
              <div class="image-placeholder">
                <el-icon :size="48"><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="recipe-info">
          <h3 class="recipe-name">{{ recipe.menuName }}</h3>
          <div class="recipe-ingredients">
            <el-tag
              v-for="(ing, index) in (recipe.ingredients || []).slice(0, 3)"
              :key="index"
              size="small"
              type="info"
            >
              {{ ing }}
            </el-tag>
            <el-tag v-if="(recipe.ingredients || []).length > 3" size="small" type="info">
              +{{ (recipe.ingredients || []).length - 3 }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty
      v-else
      description="暂无历史菜谱"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, ShoppingCart, MagicStick, Loading, Picture } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useRecipeStore } from '@/stores/recipe'

const router = useRouter()
const userStore = useUserStore()
const recipeStore = useRecipeStore()

const generating = ref(false)
const historyLoading = ref(false)

onMounted(async () => {
  if (userStore.preferences.length === 0) {
    await userStore.fetchPreferences()
  }
  if (userStore.inventory.length === 0) {
    await userStore.fetchInventory()
  }
  await loadHistory()
})

const generateRecipes = async () => {
  if (userStore.preferences.length === 0 && userStore.inventory.length === 0) {
    ElMessage.warning('请先在个性化设置中添加口味偏好或食材库存')
    router.push('/personalization')
    return
  }

  generating.value = true
  try {
    await recipeStore.fetchRecommendations()
    if (recipeStore.recipes.length > 0) {
      ElMessage.success(`为您推荐了 ${recipeStore.recipes.length} 道菜谱`)
    } else {
      ElMessage.warning('未找到合适的菜谱，请尝试调整您的偏好设置')
    }
    await loadHistory()
  } catch (error) {
    console.error('获取菜谱推荐失败:', error)
  } finally {
    generating.value = false
  }
}

const loadHistory = async () => {
  historyLoading.value = true
  try {



    await recipeStore.fetchHistory(20)
  } catch (error) {
    console.error('获取历史菜谱失败:', error)
  } finally {
    historyLoading.value = false
  }
}

const viewRecipe = (menuId) => {
  router.push(`/recipe/${menuId}`)
}
</script>

<style scoped>
.recipes-container {
  max-width: 1200px;
  margin: 0 auto;
}

.user-summary {
  margin-bottom: 24px;
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loading-icon {
  font-size: 48px;
  color: #409EFF;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.recipe-card {
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.recipe-image {
  height: 180px;
  overflow: hidden;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #c0c4cc;
}

.recipe-info {
  padding: 16px;
}

.recipe-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.recipe-ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.history-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.action-col {
  text-align: right;
}

.generate-btn {
  width: 100%;
}

@media (max-width: 1024px) {
  .recipes-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .user-summary {
    margin-bottom: 20px;
  }

  .summary-info {
    margin-bottom: 16px;
  }

  .summary-item {
    font-size: 13px;
  }

  .action-col {
    text-align: left;
  }

  .generate-btn {
    width: 100%;
  }

  .recipes-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .recipe-image {
    height: 150px;
  }

  .recipe-info {
    padding: 12px;
  }

  .recipe-name {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .history-title {
    font-size: 18px;
  }

  .loading-container {
    min-height: 200px;
  }

  .loading-icon {
    font-size: 36px;
  }
}

@media (max-width: 480px) {
  .user-summary {
    margin-bottom: 16px;
  }

  .summary-item {
    font-size: 12px;
    gap: 6px;
  }

  .generate-btn {
    font-size: 14px;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .recipe-card {
    display: flex;
    flex-direction: row;
  }

  .recipe-image {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }

  .recipe-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;
  }

  .recipe-name {
    font-size: 14px;
    margin-bottom: 6px;
  }

  .recipe-ingredients {
    gap: 4px;
  }

  .history-header {
    margin-bottom: 12px;
  }

  .history-title {
    font-size: 16px;
  }
}
</style>
