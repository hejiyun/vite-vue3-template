// src/store/frends.ts
import { defineStore } from 'pinia'
export const useFrendsStore = defineStore({
  id: 'frends',
  actions: {
    setData(data: any) {
      console.log(data)
    },
  },
})
