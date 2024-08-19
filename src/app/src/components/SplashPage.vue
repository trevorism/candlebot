<script setup>
import { onMounted, ref } from "vue";

const canvasRef = ref(null);
const isPanning = ref(false);
let rectX = 50, rectY = 50;
let rectWidth = 100, rectHeight = 100;
let velocityX = 1, velocityY = 1;
let startX, startY, offsetX = 0, offsetY = 0;

const drawAll = (context, x, y) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  drawCircle(context, x, y);
  drawRect(context, rectX, rectY);
};

const drawCircle = (context, x, y) => {
  context.fillStyle = "blue";
  context.beginPath();
  context.arc(x, y, 200, 0, 2 * Math.PI);
  context.fill();
};

const drawRect = (context, x, y) => {
  context.fillStyle = "red";
  context.fillRect(x, y, rectWidth, rectHeight);
};

const startPan = (event) => {
  isPanning.value = true;
  startX = event.clientX - offsetX;
  startY = event.clientY - offsetY;
};

const pan = (event) => {
  if (!isPanning.value) return;
  offsetX = event.clientX - startX;
  offsetY = event.clientY - startY;
  const context = canvasRef.value.getContext("2d");
  drawAll(context, 500 + offsetX, 400 + offsetY);
};

const endPan = () => {
  isPanning.value = false;
};

const updatePosition = () => {
  rectX += velocityX;
  rectY += velocityY;

  if (rectX + rectWidth > canvasRef.value.width || rectX < 0) {
    velocityX = -velocityX;
  }
  if (rectY + rectHeight > canvasRef.value.height || rectY < 0) {
    velocityY = -velocityY;
  }
};

const animate = () => {
  const context = canvasRef.value.getContext("2d");
  updatePosition();
  drawAll(context, 500 + offsetX, 400 + offsetY);
  requestAnimationFrame(animate);
};

onMounted(() => {
  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");
  drawAll(context, 500, 400);
  animate();
});
</script>

<template>
  <div class="board">
    <canvas ref="canvasRef" width="800" height="700" tabindex='0'
            style="border: 3px solid black;" @mousedown="startPan" @mousemove="pan" @mouseup="endPan" @mouseleave="endPan"
    ></canvas>
  </div>
</template>

<style scoped></style>