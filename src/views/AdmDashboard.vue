<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- Barra de navegação -->
    <nav class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-semibold">Painel Administrativo</h1>
          <p class="text-sm" v-if="userName">Bem-vindo, {{ userName }}</p>
        </div>
        <ul class="flex space-x-4 items-center">
          <li>
            <router-link to="/admin" class="hover:underline font-bold">
              Dashboard
            </router-link>
          </li>
          <li>
            <button
                @click="logout"
                class="flex items-center justify-center bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
                title="Sair"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <div class="flex-grow p-4">
      <AdminStats />
    </div>
  </div>
</template>

<script>
import AdminStats from '@/components/AdminStats.vue';

export default {
  name: 'AdmDashboard',
  components: { AdminStats },
  data() {
    return {
      userName: '',
    };
  },
  mounted() {
    const user = localStorage.getItem('user_name');
    this.userName = user || 'Administrador';
  },
  methods: {
    logout() {
      localStorage.removeItem('auth_token');
      this.$router.push('/');
    },
  },
};
</script>
