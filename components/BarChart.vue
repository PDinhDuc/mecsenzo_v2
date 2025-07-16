<template>
  <Bar
    ref="bar"
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, registerables } from 'chart.js'
import { ref } from 'vue'

ChartJS.register(...registerables)

const props = defineProps({
  chartId: {
    type: String,
    default: 'bar-chart',
  },
  datasetIdKey: {
    type: String,
    default: 'label',
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
  cssClasses: {
    type: String,
    default: '',
  },
  styles: {
    type: Object,
    default: () => ({}),
  },
  plugins: {
    type: Array,
    default: () => [],
  },
  chartData: {
    type: Object,
    default: () => ({}),
  },
  chartOptions: {
    type: Object,
    default: () => ({}),
  },
})

// Optional: You can use the `bar` ref if you want to access the chart instance
const bar = ref(null)
</script>

<style scoped>
.chart {
  height: 400px;
  width: 100%;
}
</style>
