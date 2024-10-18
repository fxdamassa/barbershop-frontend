<template>
  <div class="home">
    <h1>Bem-vindo ao BarberApp!</h1>
    <router-link to="/login">Fazer Login</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
</style>
