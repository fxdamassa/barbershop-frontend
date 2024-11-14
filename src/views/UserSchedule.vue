<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Agendar Corte</h1>
    <form @submit.prevent="createEvent">
      <div class="mb-4">
        <label class="block text-sm font-medium">Título</label>
        <input v-model="event.title" type="text" class="border rounded w-full px-3 py-2" required />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Data e Hora de Início</label>
        <input v-model="event.start" type="datetime-local" class="border rounded w-full px-3 py-2" required />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Data e Hora de Término</label>
        <input v-model="event.end" type="datetime-local" class="border rounded w-full px-3 py-2" required />
      </div>

      <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
      >
        Agendar
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserSchedule',
  data() {
    return {
      event: {
        title: '',
        start: '',
        end: '',
      },
    };
  },
  methods: {
    async createEvent() {
      try {
        // Verifica se o token está disponível
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Token não encontrado. Por favor, faça login.');
        }

        const response = await axios.post(
            'http://127.0.0.1:8000/api/calendar/create',
            {
              summary: this.event.title,
              start: { dateTime: this.event.start, timeZone: 'America/Sao_Paulo' },
              end: { dateTime: this.event.end, timeZone: 'America/Sao_Paulo' },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Enviar token no cabeçalho
              },
            }
        );

        console.log('Evento criado:', response.data);
        alert('Evento criado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar evento:', error);
        alert('Erro ao criar evento: ' + error.message);
      }
    },
  },
};
</script>
