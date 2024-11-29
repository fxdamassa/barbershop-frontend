<template>
  <div class="container mx-auto p-4">
    <AlertMessage
        v-if="showAlert"
        :type="alertType"
        :title="alertTitle"
        :message="alertMessage"
        @close="showAlert = false"
    />

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
        <label class="block text-sm font-medium mb-2">Horário</label>
        <select
            v-model="selectedTime"
            class="border rounded px-2 py-1 text-sm w-40"
            required
        >
          <option disabled value="">Selecione</option>
          <option v-for="hour in availableTimes" :key="hour" :value="hour">
            {{ hour }}
          </option>
        </select>
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
import AlertMessage from "@/components/AlertMessage.vue";
import { format } from "date-fns";

export default {
  name: "UserSchedule",
  components: { AlertMessage },
  data() {
    return {
      selectedDate: null,
      selectedTime: "",
      showAlert: false,
      alertType: "info",
      alertTitle: "",
      alertMessage: "",
      calendarAttributes: [
        {
          key: "disable-sundays",
          dates: { weekdays: [0] },
          popover: {
            label: "Domingos estão indisponíveis",
          },
        },
      ],
      availableTimes: this.generateTimeSlots("07:00", "18:00", 30),
    };
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
      if (day.isDisabled) {
        this.showCustomAlert("error", "Data Inválida", "Domingos não estão disponíveis para agendamento.");
        return;
      }
      this.selectedDate = day.date;
    },
    scheduleEvent() {
      if (!this.selectedDate || !this.selectedTime) {
        this.showCustomAlert("warning", "Dados Faltando", "Por favor, selecione uma data e um horário.");
        return;
      }

      const currentDate = new Date();
      const selectedDate = new Date(this.selectedDate);
      const selectedDateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
      const closingTime = new Date(`${currentDate.toDateString()}T18:00`);

      if (selectedDate < new Date(currentDate.toDateString())) {
        this.showCustomAlert("error", "Data Inválida", "Data menor que a data atual. Por favor, selecione uma data válida.");
        return;
      }

      if (selectedDate.toDateString() === currentDate.toDateString()) {
        if (selectedDateTime < currentDate) {
          this.showCustomAlert("warning", "Horário Inválido", "Horário menor que o horário atual. Por favor, selecione um horário válido.");
          return;
        }

        if (selectedDateTime > closingTime) {
          this.showCustomAlert("error", "Fora do Horário", "Fora do horário de funcionamento. Por favor, selecione um horário entre 07:00 e 18:00.");
          return;
        }
      }

      this.showCustomAlert("success", "Agendado", `Evento agendado para ${this.formattedDate} às ${this.selectedTime}`);
    },
    showCustomAlert(type, title, message) {
      this.alertType = type;
      this.alertTitle = title;
      this.alertMessage = message;
      this.showAlert = true;
    },
  },
};
</script>

