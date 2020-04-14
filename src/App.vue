<template>
  <div id="app">
    <Mapediter/>
  </div>
</template>

<script>
import Mapediter from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Mapediter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
