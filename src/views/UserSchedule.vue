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
          @dayclick="onDayClick"
          :attributes="calendarAttributes"
      ></vc-calendar>

      <!-- Seleção de horário limitado -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Horário</label>
        <select
            v-model="selectedTime"
            class="border rounded w-full px-2 py-1 text-sm"
            required
        >
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
import Swal from "sweetalert2";

export default {
  name: "UserSchedule",
  data() {
    return {
      selectedDate: null,
      selectedTime: "",
      calendarAttributes: [
        {
          key: "disable-sundays",
          dates: { weekdays: [0] },
          popover: { label: "Domingos estão indisponíveis" },
          customData: { disabled: true },
        },
      ],
      availableTimes: this.generateTimeSlots("07:00", "18:00", 30),
    };
  },
  computed: {
    formattedDate() {
      if (this.selectedDate) {
        const date = new Date(this.selectedDate);
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
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
        const hours = currentTime.getHours().toString().padStart(2, "0");
        const minutes = currentTime.getMinutes().toString().padStart(2, "0");
        times.push(`${hours}:${minutes}`);
        currentTime.setMinutes(currentTime.getMinutes() + interval);
      }
      return times;
    },
    onDayClick(day) {
      if (day.date.getDay() === 0) {
        Swal.fire({
          icon: "error",
          title: "Domingo Indisponível",
          text: "Domingos não estão disponíveis para agendamento.",
        });
        return;
      }
      this.selectedDate = day.date;
    },
    scheduleEvent() {
      if (!this.selectedDate || !this.selectedTime) {
        Swal.fire({
          icon: "warning",
          title: "Dados Incompletos",
          text: "Por favor, selecione uma data e um horário.",
        });
        return;
      }

      const token = localStorage.getItem("auth_token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Erro de Autenticação",
          text: "Usuário não autenticado. Por favor, faça login novamente.",
        });
        return;
      }

      const formattedDate = new Date(this.selectedDate).toISOString().split("T")[0];

      fetch("http://127.0.0.1:8000/api/agendar-corte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data_agendamento: formattedDate,
          hora_agendamento: this.selectedTime,
        }),
      })
          .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
              Swal.fire({
                icon: "success",
                title: "Sucesso",
                text: data.message || "Agendamento salvo com sucesso!",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Erro",
                text: data.message || "Erro ao salvar o agendamento.",
              });
            }
          })
          .catch((error) => {
            console.error("Erro ao salvar o agendamento:", error);
            Swal.fire({
              icon: "error",
              title: "Erro",
              text: "A data de agendamento não pode ser inferior a data atual.",
            });
          });
    }

  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>
