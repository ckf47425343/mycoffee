<template>
  <div id="app">
   <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
   </keep-alive>
   <router-view v-if="!$route.meta.keepAlive"></router-view>
    
  </div>
</template>
<script>
import  './assets/less/style.less'
export default {
  
}
</script>
