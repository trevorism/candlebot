<script setup>
import {onBeforeUnmount, onMounted, ref, toRefs, watch} from "vue";
import {setupChart, teardownChart, setViewportOffsetAndScale, drawAll, createXLabelLookup} from '../lib/chartLib.js';

const props = defineProps({
  candlesticks: {
    type: Array

  }
});

const chartRef = ref(null);

const resetViewport = () => {
  setViewportOffsetAndScale(props.candlesticks);
  const context = chartRef.value.getContext("2d");
  const xLabelLookup = createXLabelLookup(props.candlesticks);
  drawAll(context, props.candlesticks, xLabelLookup);
};

onMounted(() => {
  setupChart(chartRef, props.candlesticks);
});

onBeforeUnmount(() => {
  teardownChart(chartRef);
});

watch(props.candlesticks, (newCandlesticks) => {
  if (newCandlesticks.length > 0) {
    resetViewport();
  }
});
</script>

<template>
  <canvas ref="chartRef" width="1250" height="680" tabindex='0' style="border: 1px solid black;"/>
  <button @click="resetViewport" style="position: absolute; top:670px; left:10px">Reset</button>
</template>

<style scoped></style>