<template>
  <div
      v-if="visible"
      :class="[
      'fixed bottom-5 right-5 max-w-sm px-4 py-3 rounded shadow-lg transition-opacity duration-300',
      typeClasses
    ]"
      role="alert"
  >
    <strong class="font-bold">{{ title }}</strong>
    <span class="block sm:inline">{{ message }}</span>
    <button
        @click="closeAlert"
        class="absolute top-0 right-0 mt-2 mr-2 text-lg leading-none"
    >
      &times;
    </button>
  </div>
</template>

<script>
export default {
  name: "AlertMessage",
  props: {
    type: {
      type: String,
      default: "info",
    },
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    typeClasses() {
      switch (this.type) {
        case "success":
          return "bg-green-100 border-green-400 text-green-700";
        case "error":
          return "bg-red-100 border-red-400 text-red-700";
        case "warning":
          return "bg-yellow-100 border-yellow-400 text-yellow-700";
        case "info":
          return "bg-blue-100 border-blue-400 text-blue-700";
        default:
          return "bg-gray-100 border-gray-400 text-gray-700";
      }
    },
  },
  methods: {
    closeAlert() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
button {
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>
