<template>
  <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import {Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default {
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    },
    labels: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    const createChart = () => {
      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(canvas.value, {
        type: 'bar',
        data: {
          labels: props.labels,
          datasets: [
            {
              label: 'Agendamentos',
              data: props.values,
              backgroundColor: '#3b82f6'
            }
          ]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {display: true},
            tooltip: {enabled: true}
          },
          scales: {
            y: {beginAtZero: true}
          }
        }
      });
    };

    onMounted(() => {
      createChart();
    });

    // Atualiza o gráfico quando os props mudarem
    watch([() => props.labels, () => props.values], () => {
      createChart();
    });

    return {canvas};
  }
};
</script>
