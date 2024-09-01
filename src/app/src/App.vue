<script setup>
import MenuBar from '@trevorism/ui-header-bar'
import FinancialChart from "./components/FinancialChart.vue";
import axios from 'axios';

import { ref, reactive } from "vue";
const candlesticks = reactive([]);

const assets = ["BTCUSD", "ETHUSD", "LTCUSD", "XRPUSD", "ADAUSD", "SOLUSD", "AVAXUSD", "LINKUSD", "BCHUSD", "DOTUSD"];
const selectedAsset = ref(assets[0]);

const timeFrames = ["1m", "5m", "15m", "1h", "1d", "1w"];
const selectedTimeFrame = ref(timeFrames[4]);

axios.get("api/candle/btcusd/1d").then((response) => {
  candlesticks.push(...response.data);
});

const updateInput = () => {
  candlesticks.splice(0);
  axios.get(`api/candle/${selectedAsset.value}/${selectedTimeFrame.value}`).then((response) => {
    candlesticks.push(...response.data);
  });
};

</script>

<template>
  <menu-bar></menu-bar>

  <div class="assetPicker">
    Asset:
    <va-select class="w-1/4 ml-4 mr-4" :options="assets" v-model="selectedAsset" @update:modelValue="updateInput"></va-select>
    Candle Duration:
    <va-select class="ml-4 w-1/4" :options="timeFrames" v-model="selectedTimeFrame" @update:modelValue="updateInput"></va-select>
  </div>

  <financial-chart :candlesticks="candlesticks"></financial-chart>
</template>

<style scoped>
  .assetPicker{
    position: absolute;
    top: 100px;
    left: 100px;
    width: 500px;
  }

</style>