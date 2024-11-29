<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Agendar Corte</h1>
    <div class="calendar-container">
      <!-- Calendário para seleção de data -->
      <vc-calendar
          v-model="selectedDate"
          is-expanded
          color="blue"
          locale="pt-BR"
          :attributes="calendarAttributes"
          @dayclick="onDayClick"
      ></vc-calendar>

      <!-- Seleção de horário limitado -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-2">Horário</label>
        <select v-model="selectedTime" class="border rounded w-full px-3 py-2" required>
          <option disabled value="">Selecione o horário</option>
          <option v-for="hour in availableTimes" :key="hour" :value="hour">
            {{ hour }}
          </option>
        </select>
      </div>

      <!-- Mostra data e horário selecionados -->
      <div class="mt-4">
        <h2 class="text-lg font-semibold mb-2">Data e Horário Selecionados</h2>
        <p>
          <span v-if="formattedDate">{{ formattedDate }}</span>
          <span v-if="selectedTime">às {{ selectedTime }}</span>
        </p>
      </div>

      <!-- Botão de ação -->
      <button
          @click="scheduleEvent"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
      >
        Agendar Evento
      </button>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'UserSchedule',
  data() {
    return {
      selectedDate: null, // Data selecionada
      selectedTime: '', // Horário selecionado
      calendarAttributes: [
        {
          key: 'disable-sundays',
          highlight: true,
          dates: (date) => date.getDay() === 0, // Bloqueia domingos
          popover: {
            label: 'Domingos não estão disponíveis.',
          },
        },
      ],
      availableTimes: this.generateTimeSlots('07:00', '18:00', 30), // Horários disponíveis
    };
  },
  computed: {
    formattedDate() {
      if (this.selectedDate) {
        return format(new Date(this.selectedDate), 'dd/MM/yyyy');
      }
      return null;
    },
  },
  methods: {
    generateTimeSlots(start, end, interval) {
      const times = [];
      let currentTime = new Date(`1970-01-01T${start}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);

      while (currentTime <= endTime) {
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        times.push(`${hours}:${minutes}`);
        currentTime.setMinutes(currentTime.getMinutes() + interval);
      }

      return times;
    },
    onDayClick(day) {
      // Extraia a data do objeto `day` recebido
      const clickedDate = new Date(day.date);

      if (clickedDate.getDay() === 0) {
        alert('Domingos não estão disponíveis para agendamento.');
        return;
      }

      this.selectedDate = clickedDate; // Atualiza a data selecionada
    },
    scheduleEvent() {
      if (!this.selectedDate || !this.selectedTime) {
        alert('Por favor, selecione uma data e um horário.');
        return;
      }

      const currentDate = new Date();
      const selectedDate = new Date(this.selectedDate);
      const selectedDateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
      const closingTime = new Date(`${currentDate.toDateString()}T18:00`);

      // Validação: data anterior ao dia atual
      if (selectedDate < new Date(currentDate.toDateString())) {
        alert('Data menor que a data atual. Por favor, selecione uma data válida.');
        return;
      }

      // Validação: mesmo dia, mas horário no passado
      if (selectedDate.toDateString() === currentDate.toDateString()) {
        if (selectedDateTime < currentDate) {
          alert('Horário menor que o horário atual. Por favor, selecione um horário válido.');
          return;
        }
        if (selectedDateTime > closingTime) {
          alert('Fora do horário de funcionamento.');
          return;
        }
      }

      alert(`Evento agendado para ${this.formattedDate} às ${this.selectedTime}`);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>
