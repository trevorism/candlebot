<script setup>
import MenuBar from '@trevorism/ui-header-bar'
import FinancialChart from "./components/FinancialChart.vue";


const candlesticks = [
  { open: 1, high: 4, low: 0, close: 2, x: 1, xLabel: "2022-08-30T20:00:00Z" },
  { open: 2, high: 5, low: 1, close: 4, x: 2, xLabel: "2022-08-31T20:00:00Z" },
  { open: 4, high: 6, low: 0, close: 1, x: 3, xLabel: "2022-09-01T20:00:00Z" },
  { open: 1, high: 6, low: 1, close: 3, x: 4, xLabel: "2022-09-02T20:00:00Z" },
  { open: 3, high: 16, low: 3, close: 13, x: 5, xLabel: "2022-09-03T20:00:00Z" },
  { open: 13, high: 14, low: 10, close: 11, x: 6, xLabel: "2022-09-04T20:00:00Z" }
];

const newCandlesticks = [
  { open: 10, high: 40, low: 0, close: 200, x: 18, xLabel: "2022-09-18T20:00:00Z" },
  { open: 200, high: 205, low: 10, close: 40, x: 29, xLabel: "2022-09-29T20:00:00Z" },
  { open: 40, high: 60, low: 0, close: 10, x: 30, xLabel: "2022-09-30T20:00:00Z" },
  { open: 10, high: 60, low: 10, close: 30, x: 41, xLabel: "2022-10-11T20:00:00Z" },
  { open: 30, high: 160, low: 30, close: 130, x: 52, xLabel: "2022-10-22T20:00:00Z" },
  { open: 130, high: 140, low: 100, close: 110, x: 63, xLabel: "2022-11-02T20:00:00Z" }
];

const newerCandlesticks = [
  { open: 20290, high: 20576, low: 19555, close: 19812, x: 14 },
  { open: 19814, high: 20473, low: 19814., close: 20052, x: 15 },
  { open: 20049, high: 20195, low: 19560, close: 20127, x: 16 },
  { open: 20127, high: 20434, low: 19764, close: 19954, x: 17 },
  { open: 19954, high: 20047, low: 19655, close: 19834, x: 18 },
  { open: 19833, high: 20010, low: 19601, close: 19995, x: 19 }
];

</script>

<template>
  <menu-bar></menu-bar>
  <financial-chart :candlesticks="newCandlesticks"></financial-chart>
</template>

<style scoped></style>