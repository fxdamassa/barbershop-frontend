<template>
  <div class="p-6 space-y-4">
    <h2 class="text-2xl font-bold">Agendamentos</h2>

    <div class="flex gap-2 items-end">
      <input v-model="q" placeholder="Buscar por usuário/serviço" class="border p-2 rounded" />
      <input v-model="dia" type="date" class="border p-2 rounded" />
      <button @click="fetchItens" class="bg-blue-600 text-white px-4 py-2 rounded">Filtrar</button>
      <button @click="exportar" class="border px-4 py-2 rounded">Exportar CSV</button>
    </div>

    <table class="w-full table-auto">
      <thead class="bg-gray-200">
      <tr>
        <th class="px-4 py-2 text-left">Usuário</th>
        <th class="px-4 py-2 text-left">Data</th>
        <th class="px-4 py-2 text-left">Hora</th>
        <th class="px-4 py-2 text-left">Serviço</th>
        <th class="px-4 py-2"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="a in itens.data" :key="a.id" class="border-b">
        <td class="px-4 py-2">
          {{ a.usuario && a.usuario.name ? a.usuario.name : (a.usuario || '-') }}
        </td>
        <td class="px-4 py-2">{{ a.data_agendamento }}</td>
        <td class="px-4 py-2">{{ a.hora_agendamento }}</td>
        <td class="px-4 py-2">
          {{ a.servico && a.servico.servico ? a.servico.servico : (a.servico || '-') }}
        </td>
        <td class="px-4 py-2 text-right">
          <button @click="cancelar(a.id)" class="px-3 py-1 bg-red-600 text-white rounded">
            Cancelar
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="itens && (itens.last_page || 1) > 1" class="flex items-center gap-2">
      <button
          :disabled="!itens.prev_page_url"
          @click="goto(itens.current_page - 1)"
          class="px-3 py-1 border rounded"
      >
        Anterior
      </button>
      <span>Página {{ itens.current_page || 1 }} de {{ itens.last_page || 1 }}</span>
      <button
          :disabled="!itens.next_page_url"
          @click="goto(itens.current_page + 1)"
          class="px-3 py-1 border rounded"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script>
import api from '../axios';

export default {
  name: 'AdminAgendamentos',
  data() {
    return {
      q: '',
      dia: '',
      page: 1,
      itens: {
        data: [],
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null
      }
    };
  },
  mounted() {
    this.fetchItens();
  },
  methods: {
    async fetchItens() {
      const params = { q: this.q, page: this.page };
      if (this.dia) params.data = this.dia;

      const res = await api.get('/admin/agendamentos', { params });
      this.itens = res.data;
    },
    goto(p) {
      if (!p || p < 1 || (this.itens.last_page && p > this.itens.last_page)) return;
      this.page = p;
      this.fetchItens();
    },
    async cancelar(id) {
      await api.delete(`/admin/agendamentos/${id}`);
      this.fetchItens();
    },
    exportar() {
      const rows = (this.itens.data || []).map(a => [
        a && a.usuario && a.usuario.name ? a.usuario.name : (a.usuario || ''),
        a && a.data_agendamento ? a.data_agendamento : '',
        a && a.hora_agendamento ? a.hora_agendamento : '',
        a && a.servico && a.servico.servico ? a.servico.servico : (a.servico || '')
      ]);
      const csv = ['Usuario;Data;Hora;Servico', ...rows.map(r => r.join(';'))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'agendamentos.csv'; a.click();
      URL.revokeObjectURL(url);
    }
  }
};
</script>
