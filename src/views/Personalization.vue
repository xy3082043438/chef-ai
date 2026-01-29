<template>
  <div class="personalization-container">
    <div class="page-header">
      <h1 class="page-title">个性化设置</h1>
      <p class="page-description">设置您的口味偏好和食材库存，AI 将根据这些信息为您推荐菜谱</p>
    </div>

    <el-row :gutter="24">
      <el-col :xs="24" :lg="12">
        <el-card class="preference-card">
          <template #header>
            <div class="card-header">
              <span>
                <el-icon><Star /></el-icon>
                口味偏好
              </span>
            </div>
          </template>

          <div class="add-form">
            <el-input
              v-model="newPreference"
              placeholder="添加口味偏好（如：辣、清淡、素食）"
              @keyup.enter="addPreference"
              clearable
            >
              <template #append>
                <el-button @click="addPreference">
                  <el-icon><Plus /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>

          <div class="tag-list" v-if="userStore.preferences.length > 0">
            <el-tag
              v-for="pref in userStore.preferences"
              :key="pref.preferenceId"
              closable
              @close="removePreference(pref.preferenceId)"
              class="preference-tag"
            >
              {{ pref.preferenceName }}
            </el-tag>
          </div>

          <el-empty v-else description="还没有添加口味偏好" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="inventory-card">
          <template #header>
            <div class="card-header">
              <span>
                <el-icon><ShoppingCart /></el-icon>
                食材库存
              </span>
            </div>
          </template>

          <div class="add-form">
            <el-row :gutter="12">
              <el-col :xs="24" :sm="10" :md="10">
                <el-input
                  v-model="newIngredient.name"
                  placeholder="食材名称"
                  clearable
                />
              </el-col>
              <el-col :xs="12" :sm="6" :md="6">
                <el-input-number
                  v-model="newIngredient.quantity"
                  :min="1"
                  :max="999"
                  placeholder="数量"
                  style="width: 100%"
                />
              </el-col>
              <el-col :xs="12" :sm="8" :md="8">
                <el-button type="primary" @click="addIngredient" :loading="addingIngredient" class="add-btn">
                  <el-icon><Plus /></el-icon>
                  添加
                </el-button>
              </el-col>
            </el-row>
          </div>

          <el-table
            :data="userStore.inventory"
            style="width: 100%"
            v-if="userStore.inventory.length > 0"
          >
            <el-table-column prop="foodName" label="食材名称" />
            <el-table-column prop="quantity" label="数量" width="160">
              <template #default="{ row }">
                <div class="quantity-col">
                  <el-input-number
                    v-model="row.quantity"
                    :min="1"
                    :max="999"
                    size="small"
                    style="width: 100px"
                    @change="(val) => updateQuantity(row.inventoryId, val)"
                  />
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    @click="removeIngredient(row.inventoryId)"
                    class="delete-btn"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-else description="还没有添加食材库存" />
        </el-card>
      </el-col>
    </el-row>

    <div class="save-section">
      <el-button type="primary" size="large" @click="goToRecipes">
        <el-icon><Dish /></el-icon>
        生成菜谱推荐
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, ShoppingCart, Plus, Delete, Dish } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const newPreference = ref('')
const newIngredient = reactive({
  name: '',
  quantity: 1
})
const addingIngredient = ref(false)

onMounted(async () => {
  await Promise.all([
    userStore.fetchPreferences(),
    userStore.fetchInventory()
  ])
})

const addPreference = async () => {
  if (!newPreference.value.trim()) {
    ElMessage.warning('请输入口味偏好')
    return
  }

  try {
    await userStore.addPreference(newPreference.value.trim())
    ElMessage.success('添加成功')
    newPreference.value = ''
  } catch (error) {
    console.error('添加口味偏好失败:', error)
  }
}

const removePreference = async (preferenceId) => {
  try {
    await userStore.deletePreference(preferenceId)
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除口味偏好失败:', error)
  }
}

const addIngredient = async () => {
  if (!newIngredient.name.trim()) {
    ElMessage.warning('请输入食材名称')
    return
  }

  addingIngredient.value = true
  try {
    await userStore.addInventory(newIngredient.name.trim(), newIngredient.quantity)
    ElMessage.success('添加成功')
    newIngredient.name = ''
    newIngredient.quantity = 1
  } catch (error) {
    console.error('添加食材失败:', error)
  } finally {
    addingIngredient.value = false
  }
}

const updateQuantity = async (inventoryId, quantity) => {
  try {
    await userStore.updateInventory(inventoryId, quantity)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新食材数量失败:', error)
  }
}

const removeIngredient = async (inventoryId) => {
  try {
    await userStore.deleteInventory(inventoryId)
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除食材失败:', error)
  }
}

const goToRecipes = () => {
  router.push('/recipes')
}
</script>

<style scoped>
.personalization-container {
  max-width: 1200px;
  margin: 0 auto;
}

.quantity-col {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn {
  flex-shrink: 0;
}

.preference-card,
.inventory-card {
  margin-bottom: 24px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.add-form {
  margin-bottom: 20px;
}

.add-btn {
  width: 100%;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preference-tag {
  font-size: 14px;
  padding: 6px 12px;
}

.save-section {
  text-align: center;
  padding: 24px 0;
}

@media (max-width: 1024px) {
  .preference-card,
  .inventory-card {
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .personalization-container {
    padding-bottom: 20px;
  }

  .preference-card,
  .inventory-card {
    margin-bottom: 16px;
    min-height: 300px;
  }

  .card-header {
    font-size: 16px;
  }

  .add-form {
    margin-bottom: 16px;
  }

  .add-btn {
    width: 100%;
  }

  .tag-list {
    gap: 8px;
  }

  .preference-tag {
    font-size: 13px;
    padding: 5px 10px;
  }

  .save-section {
    padding: 16px 0;
  }
}

@media (max-width: 480px) {
  .personalization-container {
    padding-bottom: 16px;
  }

  .preference-card,
  .inventory-card {
    margin-bottom: 12px;
    min-height: auto;
  }

  .card-header {
    font-size: 15px;
    gap: 6px;
  }

  .add-form {
    margin-bottom: 12px;
  }

  .add-btn {
    font-size: 12px;
    padding: 8px 12px;
  }

  .tag-list {
    gap: 6px;
  }

  .preference-tag {
    font-size: 12px;
    padding: 4px 8px;
  }

  .save-section {
    padding: 12px 0;
  }

  :deep(.el-table th) {
    padding: 6px 0;
  }

  :deep(.el-table td) {
    padding: 6px 0;
  }

}
</style>
