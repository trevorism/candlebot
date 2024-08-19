<script setup>
import {onMounted, ref} from "vue";

const chartRef = ref(null);

onMounted(() => {
  const context = chartRef.value.getContext("2d");
  drawAxisOnChart(context);
  drawCandlestick(context, 1, 4, 0, 2, 1);
  drawCandlestick(context, 2, 5, 1, 4, 2);
  drawCandlestick(context, 4, 6, 0, 1, 3);
  drawCandlestick(context, 1, 6, 1, 3, 4);
});

const drawAxisOnChart = (context) => {
  context.beginPath();
  context.moveTo(50, 50);
  context.lineTo(50, 650);
  context.lineTo(1150, 650);
  context.stroke();

  drawXAxisTicks(context);
  drawXAxisLabels(context);
  drawYAxisTicks(context);
  drawYAxisLabels(context);
}

const drawXAxisTicks = (context) => {
  context.beginPath();
  for (let i = 0; i < 30; i++) {
    context.moveTo(50 + i * 30, 650);
    context.lineTo(50 + i * 30, 645);
  }
  context.stroke();
}

const drawXAxisLabels = (context) => {
  context.font = "20px Arial";
  for (let i = 0; i < 30; i++) {
    context.fillText(i, 45 + i * 30, 670);
  }
}

const drawYAxisTicks = (context) => {
  context.beginPath();
  for (let i = 0; i < 6; i++) {
    context.moveTo(50, 650 - i * 100);
    context.lineTo(55, 650 - i * 100);
  }
  context.stroke();
}

const drawYAxisLabels = (context) => {
  context.font = "20px Arial";
  for (let i = 0; i < 6; i++) {
    context.fillText(i, 20, 655 - i * 100);
  }
}

const drawCandlestick = (context, open, high, low, close, x) => {
  let top = open;
  let bottom = close;

  if (open > close) {
    context.fillStyle = "red";
    context.strokeStyle = context.fillStyle;
  } else {
    context.fillStyle = "green";
    context.strokeStyle = context.fillStyle;
    top = close;
    bottom = open;
  }
  //compute the position and draw a rectangle for the open and close
  context.fillRect(50 + x * 30 - 14, 650 - open * 100, 28, open * 100 - close * 100);

  //draw the wicks
  context.beginPath();
  context.moveTo(50 + x * 30, 650 - high * 100);
  context.lineTo(50 + x * 30, 650 - top * 100);
  context.stroke();

  context.beginPath();
  context.moveTo(50 + x * 30, 650 - low * 100);
  context.lineTo(50 + x * 30, 650 - bottom * 100);
  context.stroke();

}

</script>

<template>
  <canvas ref="chartRef" width="1200" height="700" tabindex='0' style="border: 1px solid black;"/>
</template>

<style scoped>

</style>