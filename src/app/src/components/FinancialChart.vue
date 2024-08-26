<script setup>
import { onBeforeUnmount, onMounted, ref, toRefs } from "vue";
import { setupChart, teardownChart, setViewportOffsetAndScale, drawAll } from '../lib/chartLib.js';

const props = defineProps({
  candlesticks: {
    type: Array,
    required: true
  }
});

const { candlesticks } = toRefs(props);
const chartRef = ref(null);

const resetViewport = () => {
  setViewportOffsetAndScale(candlesticks.value);
  const context = chartRef.value.getContext("2d");
  drawAll(context, candlesticks.value);
};

onMounted(() => {
  setupChart(chartRef, candlesticks.value);
});

onBeforeUnmount(() => {
  teardownChart(chartRef);
});
</script>

<template>
  <canvas ref="chartRef" width="1250" height="800" tabindex='0' style="border: 1px solid black;"/>
  <button @click="resetViewport" style="position: absolute; top:670px; left:10px">Reset</button>
</template>

<style scoped></style>