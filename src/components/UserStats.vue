<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Estatísticas</h2>

    <!-- Select de ano -->
    <div class="mb-4 text-center">
      <label for="ano" class="font-semibold mr-2">Selecione o ano:</label>
      <select id="ano" v-model="selectedYear" class="border rounded px-2 py-1">
        <option v-for="year in anosDisponiveis" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gráfico -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-center font-semibold mb-2">Agendamentos por mês</h3>
        <BarChart
            v-if="Array.isArray(barLabels) && barLabels.length"
            :labels="barLabels"
            :values="barValues"
            :width="400"
            :height="300"
        />
        <p v-else class="text-center text-gray-500 mt-6">Sem dados disponíveis.</p>
      </div>

      <!-- Tabela -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-center font-semibold mb-2">Seus Agendamentos</h3>
        <table v-if="Array.isArray(agendamentosDetalhados) && agendamentosDetalhados.length" class="w-full table-auto mt-2">
          <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2">Data</th>
            <th class="px-4 py-2">Horário</th>
            <th class="px-4 py-2">Serviço</th>
            <th class="px-4 py-2">Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in agendamentosDetalhados" :key="index">
            <td class="border px-4 py-2">{{ formatDate(item.data_agendamento) }}</td>
            <td class="border px-4 py-2">{{ item.hora_agendamento.slice(0, 5) }}</td>
            <td class="border px-4 py-2">{{ getServicoNome(item.servico_id) }}</td>
            <td class="border px-4 py-2">
              <button
                  @click="excluirAgendamento(item.id)"
                  class="text-red-600 hover:text-red-800"
                  title="Excluir agendamento"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m12 0H5" />
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <p v-else class="text-center text-gray-500 mt-6">Nenhum agendamento encontrado.</p>

        <!-- Paginação -->
        <div v-if="pagination?.total > 0" class="flex justify-center mt-4 space-x-2">
          <button
              @click="fetchEstatisticas(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span class="px-3 py-1">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
          <button
              @click="fetchEstatisticas(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Helpers de notificação/confirm sem depender do bundle do sweetalert2
function notify (opts = {}) {
  try {
    if (typeof window !== 'undefined' && window.Swal && typeof window.Swal.fire === 'function') {
      return window.Swal.fire(opts);
    }
  } catch (e) {
    // evita bloco vazio para ESLint
    if (process.env.NODE_ENV !== 'production') console.debug('[notify] fallback:', e);
  }
  const title = opts.title || '';
  const text = opts.text || '';
  const msg = [title, text].filter(Boolean).join('\n');
  if (opts.icon === 'error') console.error('❌', title, text);
  else if (opts.icon === 'warning') console.warn('⚠️', title, text);
  else console.log('ℹ️', title, text);
  if (typeof window !== 'undefined' && window.alert) window.alert(msg || 'Ação executada.');
}

async function confirmDialog({
                               title = 'Confirmar',
                               text = 'Deseja continuar?',
                               confirmButtonText = 'OK',
                               cancelButtonText = 'Cancelar',
                               icon = 'question'
                             } = {}) {
  try {
    if (typeof window !== 'undefined' && window.Swal && typeof window.Swal.fire === 'function') {
      const ret = await window.Swal.fire({
        title, text, icon,
        showCancelButton: true,
        confirmButtonText, cancelButtonText
      });
      return !!ret.isConfirmed;
    }
  } catch (e) {
    // evita bloco vazio para ESLint
    if (process.env.NODE_ENV !== 'production') console.debug('[confirmDialog] fallback:', e);
  }
  return typeof window !== 'undefined' ? window.confirm(`${title}\n${text}`) : true;
}

export default {
  components: { BarChart },
  data() {
    return {
      selectedYear: null,
      anosDisponiveis: [],
      barLabels: [],
      barValues: [],
      agendamentosDetalhados: [],
      pagination: null,
      servicos: []
    };
  },
  mounted() {
    this.initAnosDisponiveis();
    this.selectedYear = this.anosDisponiveis[0];
    this.fetchServicos().then(() => this.fetchEstatisticas());
  },
  watch: {
    selectedYear() {
      this.fetchEstatisticas();
    }
  },
  methods: {
    initAnosDisponiveis() {
      const atual = new Date().getFullYear();
      for (let i = 0; i < 5; i++) this.anosDisponiveis.push(atual - i);
    },
    async fetchServicos() {
      const token = localStorage.getItem('auth_token');
      try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/agendar-corte/servicos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        this.servicos = data.servicos || [];
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
      }
    },
    async fetchEstatisticas(page = 1) {
      const token = localStorage.getItem('auth_token');
      try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/dashboard/estatisticas?ano=${this.selectedYear}&page=${page}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        this.barLabels = Array.isArray(data.agendamentosPorMes)
            ? data.agendamentosPorMes.map(i => meses[i.mes - 1])
            : [];
        this.barValues = Array.isArray(data.agendamentosPorMes)
            ? data.agendamentosPorMes.map(i => i.total)
            : [];
        this.agendamentosDetalhados = data.agendamentosDetalhados || [];
        this.pagination = data.pagination || { current_page: 1, last_page: 1, per_page: 10, total: 0 };
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    },
    async excluirAgendamento(id) {
      const ok = await confirmDialog({
        title: 'Tem certeza?',
        text: 'Você deseja excluir este agendamento?',
        icon: 'warning',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
      });
      if (!ok) return;

      const token = localStorage.getItem('auth_token');
      try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/agendar-corte/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          notify({ icon: 'success', title: 'Excluído!', text: data.message || 'Agendamento excluído.' });
          this.fetchEstatisticas(this.pagination?.current_page || 1);
        } else {
          notify({ icon: 'error', title: 'Erro', text: data.error || 'Erro ao excluir' });
        }
      } catch (error) {
        notify({ icon: 'error', title: 'Erro', text: 'Erro ao conectar ao servidor' });
      }
    },
    formatDate(date) {
      return dayjs.utc(date).format('DD/MM/YYYY');
    },
    getServicoNome(servicoId) {
      const servico = this.servicos.find(s => s.id === servicoId);
      return servico ? servico.servico : 'Não informado';
    }
  }
};
</script>
