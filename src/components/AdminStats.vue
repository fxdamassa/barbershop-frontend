<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Todos os Agendamentos</h2>
    <table class="w-full table-auto">
      <thead class="bg-gray-200">
      <tr>
        <th class="px-4 py-2">Usuário</th>
        <th class="px-4 py-2">Data</th>
        <th class="px-4 py-2">Horário</th>
        <th class="px-4 py-2">Serviço</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in agendamentos" :key="index">
        <td class="border px-4 py-2">{{ item.usuario }}</td>
        <td class="border px-4 py-2">{{ formatDate(item.data_agendamento) }}</td>
        <td class="border px-4 py-2">{{ item.hora_agendamento }}</td>
        <td class="border px-4 py-2">{{ item.servico }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminStats',
  data() {
    return {
      agendamentos: [],
    };
  },
  async mounted() {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/agendamentos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      this.agendamentos = data || [];
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  },
  methods: {
    formatDate(dataString) {
      const date = new Date(dataString);
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
  }
};
</script>
