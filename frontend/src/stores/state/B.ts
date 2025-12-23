// src/stores/state/B.ts
import { defineStore } from 'pinia'

interface ProductState {
  isLoading: boolean;
  selectedId: number | null;
}

export const useBStore = defineStore('B', {
  state: (): ProductState => ({
    isLoading: false,
    selectedId: null,
  }),
  getters: {
  },
  actions: {
    async fetchProducts() {
      this.isLoading = true;
      // 這裡執行 API 請求，例如：
      // const response = await api.get('/products');
      // this.list = response.data;
      this.isLoading = false;
    },
    selectProduct(id: number) {
      this.selectedId = id;
    }
  }
})
