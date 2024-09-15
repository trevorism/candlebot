<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {drawAll, setupChart, setDefaultOffsetAndScale, teardownChart} from '../lib/chartLib.js';

const props = defineProps({
  uiData: {
    type: Object
  }
});

const chartRef = ref(null);
const yAxisRef = ref(null);
const xAxisRef = ref(null);

const refreshCandles = () => {
  setDefaultOffsetAndScale(props.uiData);
  const context = chartRef.value.getContext("2d");
  const yAxisContext = yAxisRef.value.getContext("2d");
  const xAxisContext = xAxisRef.value.getContext("2d");
  drawAll(context, yAxisContext, xAxisContext, props.uiData);
};

onMounted(() => {
  setupChart(chartRef, yAxisRef, xAxisRef, props.uiData);
});

onBeforeUnmount(() => {
  teardownChart(chartRef, yAxisRef, xAxisRef);
});

watch(props.uiData, (newVal, oldVal) => {
  refreshCandles();
});


</script>

<template>
  <canvas ref="yAxisRef" width="100" height="600" tabindex='0' style="position: absolute; top: 150px; left: 0"/>
  <canvas ref="xAxisRef" width="1200" height="80" tabindex='0' style="position: absolute; top: 750px; left: 50px"/>
  <canvas ref="chartRef" width="1200" height="600" tabindex='0' style="position: absolute; top: 150px; left: 50px"/>
  <button @click="refreshCandles" style="position: absolute; top:770px; left:10px">Reset</button>
</template>

<style scoped></style>