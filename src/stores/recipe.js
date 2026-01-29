import { defineStore } from 'pinia'
import api from '@/api/request'
import { useUserStore } from './user'
import defaultRecipeImage from '@/assets/cooking.svg'

const normalizeRecipe = (source) => {
  const payload = source?.recipe || source || {}
  const outerImageUrl = source?.image_url || source?.imageUrl
  let ingredients = payload.ingredients
  if (typeof ingredients === 'string') {
    try { ingredients = JSON.parse(ingredients) } catch (e) { ingredients = [] }
  }

  let steps = payload.steps
  if (typeof steps === 'string') {
    try { steps = JSON.parse(steps) } catch (e) { steps = [] }
  }

  return {
    ...payload,
    menuId: payload.menuId || payload.menu_id,
    menuName: payload.menuName || payload.menu_name,
    ingredients,
    steps,
    imageUrl: outerImageUrl || payload.imageUrl || payload.image_url || payload.imgUrl || defaultRecipeImage
  }
}

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [],
    history: [],
    currentRecipe: null,
    loading: false
  }),

  getters: {
    recipeCount: (state) => state.recipes.length
  },

  actions: {
    async fetchRecommendations() {
      const userStore = useUserStore()
      if (!userStore.userId) return
      
      this.loading = true
      try {
        const data = await api.get('/api/recipes/recommendations', {
          params: { user_id: userStore.userId }
        })
        this.recipes = (Array.isArray(data) ? data : []).map(normalizeRecipe)
        return this.recipes
      } finally {
        this.loading = false
      }
    },

    async fetchHistory(limit) {
      const userStore = useUserStore()
      if (!userStore.userId) return

      const data = await api.get('/api/recipes/history', {
        params: {
          user_id: userStore.userId,
          limit
        }
      })
      this.history = (Array.isArray(data) ? data : []).map(normalizeRecipe)
      return this.history
    },

    async fetchRecipeDetail(menuId) {
      this.loading = true
      this.currentRecipe = null
      try {
        const data = await api.get(`/api/recipe/${menuId}`)
        if (data) {
          const payload = data.recipe || data
          let ingredients = payload.ingredients;
          if (typeof ingredients === 'string') {
            try { ingredients = JSON.parse(ingredients); } catch (e) { ingredients = []; }
          }
          
          let steps = payload.steps;
          if (typeof steps === 'string') {
            try { steps = JSON.parse(steps); } catch (e) { steps = []; }
          }

          const menuName = payload.menuName || payload.menu_name
          const recommendation = payload.recommendation || payload.recommendation_text
          const imageUrl = payload.imageUrl || payload.image_url || data.image_url || defaultRecipeImage

          this.currentRecipe = {
            ...payload,
            menuId: payload.menuId || payload.menu_id,
            menuName,
            recommendation,
            ingredients: Array.isArray(ingredients) ? ingredients : [],
            steps: Array.isArray(steps) ? steps : [],
            imageUrl
          }
        }
        return this.currentRecipe
      } finally {
        this.loading = false
      }
    },

    clearRecipes() {
      this.recipes = []
      this.currentRecipe = null
    }
  }
})
