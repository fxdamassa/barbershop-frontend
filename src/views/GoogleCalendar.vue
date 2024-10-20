<template>
  <div class="calendar">
    <h1>Eventos do Google Calendar</h1>
    <button @click="fetchEvents">Carregar Eventos</button>

    <ul v-if="events.length">
      <li v-for="event in events" :key="event.id">
        {{ event.summary }} - {{ event.start.dateTime }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
    };
  },
  methods: {
    async fetchEvents() {
      try {
        const token = localStorage.getItem('auth_token'); // Recupera o token salvo
        const response = await axios.get('http://127.0.0.1:8000/api/calendar/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.events = response.data;
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    },
  },
};
</script>
