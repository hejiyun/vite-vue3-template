<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const activeIndex = ref('1')
const scrollTop = ref(0)
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  activeIndex.value = key
}
const handleScroll = () => {
  scrollTop.value = document.documentElement.scrollTop
}
onMounted(() => {
  nextTick(() => {
    window.addEventListener('scroll', handleScroll, true)
  })
})
</script>
<template>
  <div class="common-layout">
    <div :class="scrollTop > 20 ? `fix-nav black` : `fix-nav`">这个是问题不是问题？</div>
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          :text-color="'white'"
          :active-text-color="'red'"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">All</el-menu-item>
          <el-menu-item index="2">Art</el-menu-item>
          <el-menu-item index="3">Gaming</el-menu-item>
          <el-menu-item index="4">Memberships</el-menu-item>
          <el-menu-item index="5">PFPs</el-menu-item>
          <el-menu-item index="6">Photography</el-menu-item>
        </el-menu>
        <div class="header-box">
          <div v-show="activeIndex == '1'" class="">
            <img
              src="https://image.mux.com/QM7crBeHarQknL7IbaBsGog9YAsYdHa74sziJEPGVa8/thumbnail.jpg?time=1"
              alt=""
            />
          </div>
          <div v-show="activeIndex == '2'" class="">
            <img
              src="https://i.seadn.io/s/production/e1c8571a-4231-4a2c-95eb-dd21825c0992.png?auto=format&w=3840"
              alt=""
            />
          </div>
          <div v-show="activeIndex == '3'" class="">swiper</div>
          <div v-show="activeIndex == '4'" class="">
            swiper
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
            </ul>
          </div>
          <div v-show="activeIndex == '5'" class="">swiper</div>
          <div v-show="activeIndex == '6'" class="">swiper</div>
        </div>
      </el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.el-header {
  height: 70vh;
  padding: 0 64px;
  padding-top: 72px;
  box-sizing: border-box;
  background-image: linear-gradient(rgba(0, 0, 0, 0.859) 0%, #fff 50%, #fff 100%);
}
.el-header .header-box {
  margin-top: 30px;
  max-height: 546.8px;
  box-sizing: border-box;
  border-radius: 10px;
}
.el-menu {
  height: 40px;
  background: none;
  border-bottom: none;
  .el-menu-item {
    border-bottom: none;
    border-radius: 10px;
    color: white;
  }
  .active-color {
    color: white !important;
    background: rgba(255, 255, 255, 0.12);
  }
  .is-active {
    color: white !important;
    background: rgba(255, 255, 255, 0.12) !important;
  }
}

.fix-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  color: #fff;
  padding: 0 64px;
}
.fix-nav.black {
  color: black;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}

.el-main {
  min-height: 100vh;
}
.el-footer {
  height: 90vh;
}
</style>
