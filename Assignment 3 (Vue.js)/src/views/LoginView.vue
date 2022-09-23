
<template>
    <div>
      <h1>LOGIN</h1>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="username" />
        <br />
        <br />
        <input v-model="password" placeholder="password" type="password" />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data: () => {
      return {
        username: "",
        password: "",
      };
    },
  };
  </script>  