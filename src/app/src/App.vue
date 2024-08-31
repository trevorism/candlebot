<script setup>
import MenuBar from '@trevorism/ui-header-bar'
import FinancialChart from "./components/FinancialChart.vue";
import axios from 'axios';

import { reactive } from "vue";
const candlesticks = reactive([]);

const newCandlesticks = [
  { open: 10, high: 40, low: 0, close: 200, x: 18, label: "2022-09-18T20:00:00Z" },
  { open: 200, high: 205, low: 10, close: 40, x: 29, label: "2022-09-29T20:00:00Z" },
  { open: 40, high: 60, low: 0, close: 10, x: 30, label: "2022-09-30T20:00:00Z" },
  { open: 10, high: 60, low: 10, close: 30, x: 41, label: "2022-10-11T20:00:00Z" },
  { open: 30, high: 160, low: 30, close: 130, x: 52, label: "2022-10-22T20:00:00Z" },
  { open: 130, high: 140, low: 100, close: 110, x: 63, label: "2022-11-02T20:00:00Z" }
];

const newerCandlesticks = [
  { open: 20290, high: 20576, low: 19555, close: 19812, x: 14, label: "2021-10-01" },
  { open: 19814, high: 20473, low: 19814., close: 20052, x: 15, label: "2021-10-02" },
  { open: 20049, high: 20195, low: 19560, close: 20127, x: 16, label: "2021-10-03" },
  { open: 20127, high: 20434, low: 19764, close: 19954, x: 17, label: "2021-10-04" },
  { open: 19954, high: 20047, low: 19655, close: 19834, x: 18, label: "2021-10-05" },
  { open: 19833, high: 20010, low: 19601, close: 19995, x: 19, label: "2021-10-06" }
];

function mockServerResponse() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: newerCandlesticks });
    }, 100);
  });
}

//mockServerResponse().then((response) => {
//  candlesticks.push(...response.data);
//});

axios.get("api/candle/btcusd").then((response) => {
  candlesticks.push(...response.data);
});

</script>

<template>
  <menu-bar></menu-bar>
  <financial-chart :candlesticks="candlesticks"></financial-chart>
</template>

<style scoped></style>