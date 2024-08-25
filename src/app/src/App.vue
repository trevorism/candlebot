<script setup>
import MenuBar from '@trevorism/ui-header-bar'
import FinancialChart from "./components/FinancialChart.vue";

const candlesticks = [
  { open: 1, high: 4, low: 0, close: 2, x: 8 },
  { open: 2, high: 5, low: 1, close: 4, x: 9 },
  { open: 4, high: 6, low: 0, close: 1, x: 10 },
  { open: 1, high: 6, low: 1, close: 3, x: 11 },
  { open: 3, high: 16, low: 3, close: 13, x: 12 },
  { open: 13, high: 14, low: 10, close: 11, x: 13 }
];
</script>

<template>
  <menu-bar></menu-bar>
  <financial-chart :candlesticks="candlesticks"></financial-chart>
</template>

<style scoped></style>