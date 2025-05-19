<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Estatísticas</h2>

    <!-- Select de ano -->
    <div class="mb-4 text-center">
      <label for="ano" class="font-semibold mr-2">Selecione o ano:</label>
      <select id="ano" v-model="selectedYear" @change="fetchEstatisticas" class="border rounded px-2 py-1">
        <option v-for="year in anosDisponiveis" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gráfico -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-center font-semibold mb-2">Agendamentos por mês</h3>
        <BarChart v-if="barLabels.length" :labels="barLabels" :values="barValues" :width="400" :height="300" />
        <p v-else class="text-center text-gray-500 mt-6">Sem dados disponíveis.</p>
      </div>

      <!-- Tabela -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-center font-semibold mb-2">Seus Agendamentos</h3>
        <table v-if="agendamentosDetalhados.length" class="w-full table-auto mt-2">
          <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2">Data</th>
            <th class="px-4 py-2">Horário</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in agendamentosDetalhados" :key="index">
            <td class="border px-4 py-2">{{ formatDate(item.data_agendamento) }}</td>
            <td class="border px-4 py-2">{{ item.hora_agendamento.slice(0, 5) }}</td>
          </tr>
          </tbody>
        </table>
        <p v-else class="text-center text-gray-500 mt-6">Nenhum agendamento encontrado.</p>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue';

export default {
  components: { BarChart },
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      anosDisponiveis: [],
      barLabels: [],
      barValues: [],
      agendamentosDetalhados: [],
    };
  },
  async mounted() {
    this.initAnosDisponiveis();
    await this.fetchEstatisticas();
  },
  methods: {
    initAnosDisponiveis() {
      const atual = new Date().getFullYear();
      this.anosDisponiveis = [];
      for (let i = 0; i < 5; i++) {
        this.anosDisponiveis.push(atual - i);
      }
    },
    async fetchEstatisticas() {
      const token = localStorage.getItem('auth_token');
      try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/dashboard/estatisticas?ano=${this.selectedYear}`, {
          headers: {Authorization: `Bearer ${token}`}
        });
        const data = await res.json();

        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        this.barLabels = data.agendamentosPorMes.map(item => meses[item.mes - 1]);
        this.barValues = data.agendamentosPorMes.map(item => item.total);
        this.agendamentosDetalhados = data.agendamentosDetalhados;
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR');
    }
  }
};
</script>
