<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center mb-6">Bem-vindo ao Dashboard</h1>
      <p class="text-center">Você está autenticado!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDashboard',
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
    }
  },
};
</script>
