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
              <el-col :span="10">
                <el-input
                  v-model="newIngredient.name"
                  placeholder="食材名称"
                  clearable
                />
              </el-col>
              <el-col :span="6">
                <el-input-number
                  v-model="newIngredient.quantity"
                  :min="1"
                  :max="999"
                  placeholder="数量"
                  style="width: 100%"
                />
              </el-col>
              <el-col :span="8">
                <el-button type="primary" @click="addIngredient" :loading="addingIngredient">
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
            <el-table-column prop="quantity" label="数量" width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.quantity"
                  :min="1"
                  :max="999"
                  size="small"
                  @change="(val) => updateQuantity(row.inventoryId, val)"
                />
              </template>
            </el-table-column>
            <el-table-column width="80" align="center">
              <template #default="{ row }">
                <el-button
                  type="danger"
                  size="small"
                  circle
                  @click="removeIngredient(row.inventoryId)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
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
import { Star, ShoppingCart, Plus, Delete } from '@element-plus/icons-vue'
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

.preference-card,
.inventory-card {
  margin-bottom: 24px;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
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

:deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
}

:deep(.el-table) {
  margin-top: 16px;
}
</style>
