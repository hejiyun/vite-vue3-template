<template>
     
  <div>{{ userStore.name }}</div>
   
</template>

 
<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import API from '@/api'

const requestRes = async () => {
  const result = await API.login('zhangsan', '123456')
}

const userStore = useUserStore() // 获取
userStore.updateName('李四') // 修改

// const { name } = userStore //state可以使用解构获取值， 但是直接解构会让值失去响应式，

const { name } = storeToRefs(userStore) // 而使用 pinia的 storeToRefs 可以在解构的同时，保留其响应式特点

console.log(userStore.fullName) // getters中再运算的值可以直接获取响应式数值
</script>
