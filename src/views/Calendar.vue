<template>
  <div class="calendar">
    <h1>Bem-vindo ao Calendário!</h1>
  </div>
</template>

<script>
export default {
  name: 'CalendarView',
  mounted() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.$router.push({ name: 'GoogleLogin' });
    }
  },
};
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
