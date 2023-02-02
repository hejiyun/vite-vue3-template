import { defineStore } from 'pinia'
import { useFrendsStore } from './frends'
import api from '@/api'

export const useUserStore = defineStore({
  id: 'user',
  state: function () {
    return {
      name: '张三',
    }
  },
  actions: {
    updateName(name: string) {
      this.name = name
    },
    // 使用 async await 获取异步请求后数据
    async login(account: string, pwd: string) {
      this.updateName('张三疯') // 同store的action方法可以直接this.调用
      const { data } = await api.login(account, pwd)
      const appStore = useFrendsStore()
      appStore.setData(data) // 调用 app store 里的 action 方法
      return data
    },
  },
  // getters为state响应式添加需要进行再运算的数值
  getters: {
    fullName: (state) => {
      return state.name + '丰'
    },
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'my_user', // 可以自定义key值名称
        storage: localStorage, // 定义当前store持久化数据值存储位置
        paths: ['name', 'age'], // paths,定义需要持久化的属性名称， 其他的将不会被持久化存储
      },
    ],
  },
})
