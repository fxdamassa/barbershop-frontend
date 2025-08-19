<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Todos os Agendamentos</h2>

    <table class="w-full table-auto">
      <thead class="bg-gray-200">
      <tr>
        <th class="px-4 py-2 text-left">Usuário</th>
        <th class="px-4 py-2 text-left">Data</th>
        <th class="px-4 py-2 text-left">Horário</th>
        <th class="px-4 py-2 text-left">Serviço</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in linhas" :key="item && item.id ? item.id : index" class="border-b">
        <td class="border px-4 py-2">{{ usuarioNome(item) }}</td>
        <td class="border px-4 py-2">{{ formatDate(item && item.data_agendamento) }}</td>
        <td class="border px-4 py-2">{{ (item && item.hora_agendamento) || '-' }}</td>
        <td class="border px-4 py-2">{{ servicoNome(item) }}</td>
      </tr>
      <tr v-if="!linhas.length">
        <td colspan="4" class="text-center text-gray-500 py-4">Sem dados</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../axios';

export default {
  name: 'AdminStats',
  data() {
    return {
      agendamentos: [], // sempre manter como array aqui
    };
  },
  computed: {
    // Garante que o template nunca receba null/undefined
    linhas() {
      return (this.agendamentos || []).filter(Boolean);
    }
  },
  async mounted() {
    try {
      const res = await api.get('/admin/agendamentos', { params: { per_page: 20 } });
      const payload = res.data || [];
      // Se vier paginado => use payload.data; se vier array simples => use payload
      this.agendamentos = Array.isArray(payload) ? payload
          : (Array.isArray(payload.data) ? payload.data : []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      this.agendamentos = [];
    }
  },
  methods: {
    usuarioNome(item) {
      if (!item) return '-';
      const u = item.usuario;
      if (u && typeof u === 'object' && u.name) return u.name;
      if (typeof u === 'string' && u) return u;
      return '-';
    },
    servicoNome(item) {
      if (!item) return '-';
      const s = item.servico;
      if (s && typeof s === 'object' && s.servico) return s.servico;
      if (typeof s === 'string' && s) return s;
      return '-';
    },
    formatDate(dataString) {
      if (!dataString) return '-';
      const date = new Date(dataString);
      if (isNaN(date.getTime())) return dataString; // se já vier formatada, mostra como está
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
  }
};
</script>
