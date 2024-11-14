<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-6">Marquinhos BarberShop</h1>
      <button
          @click="redirectToGoogle"
          class="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition"
      >
        <i class="fab fa-google mr-2"></i>
        Entrar com Google
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  methods: {
    redirectToGoogle() {
      window.location.href = 'http://127.0.0.1:8000/api/google/redirect';
    },
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      this.$router.push({ name: 'UserDashboard' });
    }
  },
};
</script>
