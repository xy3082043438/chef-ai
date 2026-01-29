<template>
  <div class="recipe-detail-container">
    <el-button @click="goBack" class="back-btn">
      <el-icon><ArrowLeft /></el-icon>
      返回列表
    </el-button>

    <div v-if="loading" class="loading-container">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p>加载菜谱详情...</p>
    </div>

    <el-card v-else-if="recipe" class="recipe-card">
      <div class="recipe-header">
        <div class="recipe-image">
          <el-image
            :src="recipe.imageUrl"
            fit="cover"
          >
            <template #error>
              <div class="image-placeholder">
                <el-icon :size="64"><Picture /></el-icon>
                <span>暂无图片</span>
              </div>
            </template>
          </el-image>
        </div>
        <div class="recipe-basic">
          <h1 class="recipe-name">{{ recipe.menuName }}</h1>
          <div class="recipe-tags">
            <el-tag
              v-for="(ing, index) in (recipe.ingredients || []).slice(0, 5)"
              :key="index"
              type="info"
            >
              {{ ing }}
            </el-tag>
          </div>
          <p class="recipe-time">
            <el-icon><Clock /></el-icon>
            约 30 分钟
          </p>
        </div>
      </div>

      <el-divider />

      <div class="recipe-section">
        <h2 class="section-title">
          <el-icon><ShoppingCart /></el-icon>
          所需食材
        </h2>
        <el-table :data="ingredientTableData" style="width: 100%">
          <el-table-column prop="name" label="食材" />
          <el-table-column prop="quantity" label="用量" width="150" />
        </el-table>
      </div>

      <div class="recipe-section">
        <h2 class="section-title">
          <el-icon><Dish /></el-icon>
          烹饪步骤
        </h2>
        <el-steps direction="vertical" :active="steps.length" finish-status="success">
          <el-step
            v-for="(step, index) in steps"
            :key="index"
            :title="`步骤 ${index + 1}`"
            :description="step"
          />
        </el-steps>
      </div>

      <div v-if="recipe.recommendation" class="recipe-section">
        <h2 class="section-title">
          <el-icon><InfoFilled /></el-icon>
          烹饪建议
        </h2>
        <el-alert
          :title="recipe.recommendation"
          type="success"
          :closable="false"
          show-icon
        />
      </div>
    </el-card>

    <el-empty v-else description="菜谱不存在" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Loading, Picture, Clock, ShoppingCart, Dish, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '@/stores/recipe'

const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()

const loading = ref(true)
const recipe = computed(() => recipeStore.currentRecipe)

const steps = computed(() => {
  if (!recipe.value?.steps) return []
  try {
    return typeof recipe.value.steps === 'string'
      ? JSON.parse(recipe.value.steps)
      : recipe.value.steps
  } catch {
    return []
  }
})

const ingredientTableData = computed(() => {
  if (!recipe.value?.ingredients) return []
  try {
    const ingredients = typeof recipe.value.ingredients === 'string'
      ? JSON.parse(recipe.value.ingredients)
      : recipe.value.ingredients

    return ingredients.map((name) => ({
      name,
      quantity: '适量'
    }))
  } catch {
    return []
  }
})

onMounted(async () => {
  const menuId = route.params.id
  if (menuId && menuId !== 'undefined' && menuId !== 'null') {
    try {
      await recipeStore.fetchRecipeDetail(menuId)
    } catch (error) {
      console.error('获取菜谱详情失败:', error)
      ElMessage.error('加载菜谱详情失败，请检查网络或重试')
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
    ElMessage.error('无效的菜谱ID')
  }
})

const goBack = () => {
  router.push('/recipes')
}
</script>

<style scoped>
.recipe-detail-container {
  max-width: 900px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 24px;
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

.recipe-card {
  border-radius: 12px;
}

.recipe-header {
  display: flex;
  gap: 24px;
}

.recipe-image {
  width: 300px;
  height: 225px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  gap: 8px;
}

.recipe-basic {
  flex: 1;
}

.recipe-name {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16px;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.recipe-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
}

.recipe-section {
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .recipe-image {
    width: 280px;
    height: 200px;
  }

  .recipe-name {
    font-size: 24px;
  }

  .recipe-section {
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .recipe-detail-container {
    max-width: 100%;
  }

  .back-btn {
    margin-bottom: 16px;
  }

  .loading-container {
    min-height: 200px;
  }

  .loading-icon {
    font-size: 36px;
  }

  .recipe-header {
    flex-direction: column;
    gap: 16px;
  }

  .recipe-image {
    width: 100%;
    height: 200px;
  }

  .recipe-name {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .recipe-tags {
    gap: 6px;
    margin-bottom: 12px;
  }

  .recipe-time {
    font-size: 13px;
  }

  .recipe-section {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 18px;
    margin-bottom: 12px;
  }

}

@media (max-width: 480px) {
  .back-btn {
    margin-bottom: 12px;
    font-size: 13px;
    padding: 8px 12px;
  }

  .loading-container {
    min-height: 180px;
  }

  .loading-icon {
    font-size: 32px;
  }

  .recipe-header {
    gap: 12px;
  }

  .recipe-image {
    height: 180px;
    border-radius: 6px;
  }

  .recipe-name {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .recipe-tags {
    gap: 4px;
  }

  .recipe-time {
    font-size: 12px;
    gap: 6px;
  }

  .recipe-section {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 16px;
    margin-bottom: 10px;
    gap: 6px;
  }

  :deep(.el-table th) {
    padding: 8px 0;
  }

  :deep(.el-table td) {
    padding: 8px 0;
  }

}
</style>
