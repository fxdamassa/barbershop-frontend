<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <nav class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
          <p class="text-sm" v-if="userName">Bem-vindo, {{ userName }}</p>
        </div>
        <ul class="flex space-x-4">
          <li><router-link to="/dashboard" class="hover:underline" :class="{ 'font-bold': isActiveRoute('/dashboard') }">Dashboard</router-link></li>
          <li><router-link to="/schedule" class="hover:underline" :class="{ 'font-bold': isActiveRoute('/schedule') }">Agendar Corte</router-link></li>
          <li><router-link to="/contact" class="hover:underline" :class="{ 'font-bold': isActiveRoute('/contact') }">Contato</router-link></li>
          <li><button @click="logout" class="bg-red-500 hover:bg-red-700 px-3 py-1 rounded">Sair</button></li>
        </ul>
      </div>
    </nav>

    <div class="flex-grow">
      <div v-if="$route.path === '/dashboard'" class="p-6 space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Gráfico -->
          <div class="bg-white p-4 rounded shadow">
            <h3 class="text-center font-semibold mb-4">Agendamentos por mês</h3>
            <BarChart
                v-if="labels.length && values.length"
                :labels="labels"
                :values="values"
                :width="400"
                :height="300"
            />
            <p v-else class="text-center text-gray-500">Sem dados disponíveis.</p>
          </div>

          <!-- Tabela -->
          <div class="bg-white p-4 rounded shadow overflow-auto">
            <h3 class="text-center font-semibold mb-4">Meus Agendamentos</h3>
            <table v-if="agendamentos.length" class="w-full text-sm mt-2">
              <thead class="bg-gray-100">
              <tr>
                <th class="text-left p-2">Nome</th>
                <th class="text-left p-2">Data</th>
                <th class="text-left p-2">Horário</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in agendamentos" :key="index">
                <td class="p-2">{{ userName }}</td>
                <td class="p-2">{{ item.data_agendamento }}</td>
                <td class="p-2">{{ item.hora_agendamento.substring(0, 5) }}</td>
              </tr>
              </tbody>
            </table>
            <p v-else class="text-center text-gray-500">Nenhum agendamento encontrado.</p>
          </div>
        </div>
      </div>
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue';

export default {
  name: "UserDashboard",
  components: {
    BarChart
  },
  data() {
    return {
      userName: "",
      labels: [],
      values: [],
      agendamentos: []
    };
  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const user = urlParams.get("user");

    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);
    }

    this.userName = user || "Usuário";

    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/dashboard/estatisticas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data?.agendamentosPorMes?.length) {
        this.labels = data.agendamentosPorMes.map(item => this.mesNome(item.mes));
        this.values = data.agendamentosPorMes.map(item => item.total);
      }

      if (data?.agendamentosDetalhados?.length) {
        this.agendamentos = data.agendamentosDetalhados;
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  },
  methods: {
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    logout() {
      localStorage.removeItem("auth_token");
      this.$router.push("/");
    },
    mesNome(numero) {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return meses[numero - 1] || '';
    }
  },
  computed: {
    pageTitle() {
      switch (this.$route.path) {
        case "/schedule": return "Agendar Corte";
        case "/contact": return "Contato";
        default: return "Dashboard";
      }
    }
  }
};
</script>
