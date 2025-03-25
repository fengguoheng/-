<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup>
import {onMounted } from 'vue';
onMounted(() => {
  console.log('App 组件已挂载');
});
</script>
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-menu-demo {
  margin-bottom: 20px;
}
</style>