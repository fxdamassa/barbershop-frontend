<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- Topbar no estilo do Painel ADM -->
    <header class="bg-blue-600 text-white px-6 py-6">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
          <p class="text-sm opacity-90" v-if="userName">Bem-vindo, {{ userName }}</p>
        </div>

        <nav class="flex gap-2">
          <router-link
              to="/dashboard"
              :class="navLinkClass('/dashboard')"
          >
            Dashboard
          </router-link>

          <router-link
              to="/schedule"
              :class="navLinkClass('/schedule')"
          >
            Agendar Corte
          </router-link>

          <router-link
              to="/contact"
              :class="navLinkClass('/contact')"
          >
            Contato
          </router-link>

          <router-link
              v-if="userRole === 'adm'"
              to="/admin"
              :class="navLinkClass('/admin')"
          >
            Painel ADM
          </router-link>

          <button
              @click="logout"
              class="px-3 py-2 rounded bg-red-500 hover:bg-red-600"
              title="Sair"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>

    <!-- Conteúdo -->
    <div class="flex-grow">
      <UserStats v-if="$route.path === '/dashboard'" />
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import UserStats from '@/components/UserStats.vue';

export default {
  name: 'UserDashboard',
  components: { UserStats },
  data() {
    return {
      userName: '',
      userRole: ''
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const user = urlParams.get('user');
    const role = urlParams.get('role');

    if (tokenFromUrl) localStorage.setItem('auth_token', tokenFromUrl);
    if (role) {
      localStorage.setItem('user_role', role);
      this.userRole = role;
    } else {
      this.userRole = localStorage.getItem('user_role') || '';
    }

    this.userName = user || 'Usuário';
  },
  methods: {
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    navLinkClass(path) {
      return [
        'px-3 py-2 rounded',
        this.isActiveRoute(path)
            ? 'bg-white/20 font-semibold'
            : 'bg-white/10 hover:bg-white/20'
      ];
    },
    logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      this.$router.push('/');
    }
  },
  computed: {
    pageTitle() {
      switch (this.$route.path) {
        case '/schedule': return 'Agendar Corte';
        case '/contact':  return 'Contato';
        case '/admin':    return 'Painel ADM';
        default:          return 'Dashboard';
      }
    }
  }
};
</script>

<style scoped>
/* sem estilos adicionais; tudo via classes utilitárias */
</style>
