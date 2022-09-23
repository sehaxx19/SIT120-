<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import MapCanvas from "./components/MapCanvas.vue";

</script>


<template>
  <div class="container">
    <nav>
      <NavBar class="navbar" />
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  display: flex;
}
</style>
