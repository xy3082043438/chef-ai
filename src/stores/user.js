import { defineStore } from 'pinia'
import api from '@/api/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    preferences: [],
    inventory: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userId: (state) => state.user?.userId || state.user?.user_id || null,
    username: (state) => state.user?.username || ''
  },

  actions: {
    async register(username, password, email) {
      const data = await api.post('/api/user/register', {
        username,
        password,
        email
      })
      return data
    },

    async login(username, password) {
      const data = await api.post('/api/user/login', {
        username,
        password
      })
      if (data && data.token) {
        this.token = data.token
        localStorage.setItem('token', data.token)
        // Try to get userId from login response, or rely on fetchUserInfo later
        // If the backend returns userId in the map, use it.
        const uid = data.userId || data.user_id;
        if (uid) {
          this.user = { userId: uid, username }
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
             // If we don't get userId, we might need to fetch it or decode token.
             // For now, let's assumes username is enough for display, 
             // but we need userId for other calls.
             // If the API doesn't return it, we are stuck unless we decode JWT.
             // Let's store what we have.
             this.user = { username } 
             // We'll try to fetch info if possible, but we need ID for that. 
             // Maybe there is a /me endpoint? No.
        }
      }
      return data
    },

    async fetchUserInfo() {
      if (!this.userId) return
      const data = await api.get(`/api/user/info/${this.userId}`)
      this.user = data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    },

    async fetchPreferences() {
      if (!this.userId) return
      const data = await api.get('/api/user/preferences', {
        params: { user_id: this.userId }
      })
      this.preferences = Array.isArray(data) ? data : []
      return this.preferences
    },

    async addPreference(preferenceName) {
      const data = await api.post('/api/user/preferences', {
        user_id: this.userId,
        preference_name: preferenceName
      })
      await this.fetchPreferences()
      return data
    },

    async deletePreference(preferenceId) {
      const data = await api.delete(`/api/user/preferences/${preferenceId}`)
      await this.fetchPreferences()
      return data
    },

    async fetchInventory() {
      if (!this.userId) return
      const data = await api.get('/api/user/inventory', {
        params: { user_id: this.userId }
      })
      this.inventory = Array.isArray(data) ? data : []
      return this.inventory
    },

    async addInventory(foodName, quantity) {
      const data = await api.post('/api/user/inventory', {
        user_id: this.userId,
        food_name: foodName,
        quantity: quantity
      })
      await this.fetchInventory()
      return data
    },

    async updateInventory(inventoryId, quantity) {
      // Find the item to get its name
      const item = this.inventory.find(i => i.inventoryId === inventoryId || i.inventory_id === inventoryId);
      if (!item) return;
      
      const foodName = item.foodName || item.food_name;

      // OpenAPI only defines POST for /api/user/inventory (no PATCH).
      // Attempting to use POST to update/add logic.
      const data = await api.post('/api/user/inventory', {
        user_id: this.userId,
        food_name: foodName,
        quantity: quantity
      })
      await this.fetchInventory()
      return data
    },

    async deleteInventory(inventoryId) {
      const data = await api.delete(`/api/user/inventory/${inventoryId}`)
      await this.fetchInventory()
      return data
    },

    logout() {
      this.user = null
      this.token = null
      this.preferences = []
      this.inventory = []
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
