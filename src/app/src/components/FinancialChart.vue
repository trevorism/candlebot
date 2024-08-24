<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {setupChart, teardownChart} from '../lib/chartLib.js';

const chartRef = ref(null);

onMounted(() => {
  setupChart(chartRef);
});

onBeforeUnmount(() => {
  teardownChart(chartRef);
});


</script>

<template>
  <canvas ref="chartRef" width="1200" height="700" tabindex='0' style="border: 1px solid black;"/>
</template>

<style scoped>
</style>