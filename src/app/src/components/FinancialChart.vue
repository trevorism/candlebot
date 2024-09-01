<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {createXLabelLookup, drawAll, setupChart, setViewportOffsetAndScale, teardownChart} from '../lib/chartLib.js';

const props = defineProps({
  candlesticks: {
    type: Array
  }
});

const chartRef = ref(null);
const yAxisRef = ref(null);
const xAxisRef = ref(null);

const resetViewport = () => {
  setViewportOffsetAndScale(props.candlesticks);
  const context = chartRef.value.getContext("2d");
  const yAxisContext = yAxisRef.value.getContext("2d");
  const xAxisContext = xAxisRef.value.getContext("2d");

  const xLabelLookup = createXLabelLookup(props.candlesticks);
  drawAll(context, yAxisContext, xAxisContext, props.candlesticks, xLabelLookup);
};

onMounted(() => {
  setupChart(chartRef, yAxisRef, xAxisRef, props.candlesticks);
});

onBeforeUnmount(() => {
  teardownChart(chartRef, yAxisRef, xAxisRef);
});

watch(props.candlesticks, (newCandlesticks) => {
  if (newCandlesticks.length > 0) {
    resetViewport();
  }
});
</script>

<template>
  <canvas ref="yAxisRef" width="100" height="600" tabindex='0' style="position: absolute; top: 150px; left: 0"/>
  <canvas ref="xAxisRef" width="1200" height="80" tabindex='0' style="position: absolute; top: 750px; left: 50px"/>
  <canvas ref="chartRef" width="1200" height="600" tabindex='0' style="position: absolute; top: 150px; left: 50px"/>
  <button @click="resetViewport" style="position: absolute; top:770px; left:10px">Reset</button>
</template>

<style scoped></style>