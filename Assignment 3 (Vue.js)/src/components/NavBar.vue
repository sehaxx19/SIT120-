<script setup lang="ts">
// import HelloWorldVue from "./HelloWorld.vue";
const helloWorld: string = "string";
import { RouterLink, RouterView } from "vue-router";
import Image from "primevue/image";
import Logo from "../assets/logo-1.svg";
import Avatar from "vue-avatar-component";
</script>

<template>
  <div class="navbar">
    <div class="nav-logo">
      <img src="@/assets/logo-4.png" alt="logo" class="logo" />
    </div>
    <div class="links">
      <RouterLink to="/" class="icon-cont">
        <font-awesome-icon icon="fa-solid fa-map" class="icon" />
      </RouterLink>
      <RouterLink to="/about" class="icon-cont">
        <font-awesome-icon icon="fa-solid fa-info" class="icon" />
      </RouterLink>
      <RouterLink to="/settings" class="icon-cont">
        <font-awesome-icon icon="fa-solid fa-cog" class="icon" />
      </RouterLink>
    </div>
    <div class="avatar">
      <avatar
        fullname="My Sticker"
        image="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ca06dc38260123.575ac5d985f23.png"
      ></avatar>
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 60%;
  height: auto;
}

.links {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navbar {
  /* border-right: 1px solid #a7a7a7; */
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  height: 100vh;
  width: 5rem;
  display: flex;
  flex-direction: column;
  background-color: #161616;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  justify-content: center;
  width: 100%;
  height: fit-content;
  margin-top: 2rem;
}
.icon-cont {
  color: #d3cccb;
  transition: 0.5s;
  border-radius: 4px;
  width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.icon-cont:hover {
  background-color: rgba(8, 192, 118, 0.4);
  transition: 0.5s;
  cursor: pointer;
}
</style>
