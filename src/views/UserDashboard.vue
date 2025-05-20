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
          <li>
            <button @click="logout" class="bg-red-500 hover:bg-red-700 px-3 py-1 rounded">Sair</button>
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
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const user = urlParams.get("user");

    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);
    }

    this.userName = user || "Usuário";
  },
  methods: {
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    logout() {
      localStorage.removeItem("auth_token");
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
        default:
          return "Dashboard";
      }
    }
  }
};
</script>
