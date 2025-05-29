<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- Menu de navegação -->
    <nav class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
          <p class="text-sm" v-if="userName">Bem-vindo, {{ userName }}</p>
        </div>
        <ul class="flex space-x-4">
          <li>
            <router-link to="/dashboard" class="hover:underline" :class="{ 'font-bold': isActiveRoute('/dashboard') }">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/schedule" class="hover:underline" :class="{ 'font-bold': isActiveRoute('/schedule') }">Agendar Corte</router-link>
          </li>
          <li>
            <router-link to="/contact" class="hover:underline" :class="{ 'font-bold': isActiveRoute('/contact') }">Contato</router-link>
          </li>
          <li v-if="userRole === 'adm'">
            <router-link to="/admin" class="hover:underline" :class="{ 'font-bold': isActiveRoute('/admin') }">Painel ADM</router-link>
          </li>
          <li>
            <button @click="logout" class="flex items-center justify-center bg-red-500 hover:bg-red-700 px-3 py-1 rounded" title="Sair">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-11v1m0 0V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2v-1" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <div class="flex-grow">
      <!-- Mostra o componente de estatísticas somente no dashboard -->
      <UserStats v-if="$route.path === '/dashboard'" />
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import UserStats from '@/components/UserStats.vue';

export default {
  name: "UserDashboard",
  components: {
    UserStats
  },
  data() {
    return {
      userName: "",
      userRole: ""
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const user = urlParams.get("user");
    const role = urlParams.get("role");

    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);
    }
    if (role) {
      localStorage.setItem("user_role", role);
      this.userRole = role;
    } else {
      this.userRole = localStorage.getItem("user_role") || "";
    }

    this.userName = user || "Usuário";
  },
  methods: {
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    logout() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_role");
      this.$router.push("/");
    }
  },
  computed: {
    pageTitle() {
      switch (this.$route.path) {
        case "/schedule":
          return "Agendar Corte";
        case "/contact":
          return "Contato";
        case "/admin":
          return "Painel ADM";
        default:
          return "Dashboard";
      }
    }
  }
};
</script>
