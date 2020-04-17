<template>
  <v-app :style="{background: background}">
    <Mapediter />
  </v-app>
</template>

<script>
  import Mapediter from "./components/Main.vue";

  export default {
    name: "App",
    components: {
      Mapediter
    },
    computed:{
      background(){
        return this.$vuetify.theme.currentTheme.background ? this.$vuetify.theme.currentTheme.background : "#ffffff";
      }
    }
  };
</script>

<style>
</style>
