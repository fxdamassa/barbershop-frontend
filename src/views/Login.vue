<template>
  <div class="login">
    <h1>Login com Google</h1>
    <button @click="loginWithGoogle">Login via Google</button>
  </div>
</template>

<script>
export default {
  name: 'GoogleLogin',
  methods: {
    loginWithGoogle() {
      window.location.href = 'http://127.0.0.1:8000/api/google/redirect';
    },
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      this.$router.push({ name: 'CalendarView' });
    }
  },
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color: #45a049;
}
</style>
