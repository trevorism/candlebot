<script setup>
import { onBeforeUnmount, onMounted, ref, toRefs } from "vue";
import { setupChart, teardownChart } from '../lib/chartLib.js';

const props = defineProps({
  candlesticks: {
    type: Array,
    required: true
  }
});

const { candlesticks } = toRefs(props);
const chartRef = ref(null);

onMounted(() => {
  setupChart(chartRef, candlesticks.value);
});

onBeforeUnmount(() => {
  teardownChart(chartRef);
});
</script>

<template>
  <canvas ref="chartRef" width="1250" height="800" tabindex='0' style="border: 1px solid black;"/>
</template>

<style scoped></style>