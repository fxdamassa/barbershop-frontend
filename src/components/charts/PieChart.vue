<template>
  <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default {
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    labels: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      required: true
    },
    colors: {
      type: Array,
      default: () => ['#10b981', '#3b82f6', '#f87171']
    }
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    const createChart = () => {
      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(canvas.value, {
        type: 'doughnut',
        data: {
          labels: props.labels,
          datasets: [
            {
              label: 'Cortes',
              data: props.values,
              backgroundColor: props.colors
            }
          ]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {display: true},
            tooltip: {enabled: true}
          }
        }
      });
    };

    onMounted(() => {
      createChart();
    });

    watch([() => props.labels, () => props.values], () => {
      createChart();
    });

    return {canvas};
  }
};
</script>
