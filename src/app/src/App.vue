<script setup>
import MenuBar from '@trevorism/ui-header-bar'
import FinancialChart from "./components/FinancialChart.vue";
import axios from 'axios';
import { ref, reactive } from "vue";
import { VaCheckbox } from 'vuestic-ui';

const uiData = reactive({ candles: [], inflectionPoints: [], showInflectionPoints: false });

const assets = ["BTCUSD", "ETHUSD", "LTCUSD", "XRPUSD", "ADAUSD", "SOLUSD", "AVAXUSD", "LINKUSD", "BCHUSD", "DOTUSD"];
const selectedAsset = ref(assets[0]);

const timeFrames = ["1m", "5m", "15m", "1h", "1d", "1w"];
const selectedTimeFrame = ref(timeFrames[4]);

axios.get("api/candle/btcusd/1d").then((response) => {
  uiData.candles.splice(0);
  uiData.inflectionPoints.splice(0);
  uiData.candles.push(...response.data.candles);
  uiData.inflectionPoints.push(...response.data.inflectionPoints);
});

const updateInput = () => {
  uiData.candles.splice(0);
  uiData.inflectionPoints.splice(0);
  axios.get(`api/candle/${selectedAsset.value}/${selectedTimeFrame.value}`).then((response) => {
    uiData.candles.push(...response.data.candles);
    uiData.inflectionPoints.push(...response.data.inflectionPoints);
  });
};

</script>

<template>
  <menu-bar></menu-bar>

  <div class="assetPicker">
    Asset:
    <va-select class="w-3/12 ml-4 mr-4" :options="assets" v-model="selectedAsset" @update:modelValue="updateInput"></va-select>
    Candle Duration:
    <va-select class="ml-4 w-1/8 mr-4" :options="timeFrames" v-model="selectedTimeFrame" @update:modelValue="updateInput"></va-select>
    Current Price: {{uiData.candles.length > 0 ? uiData.candles[uiData.candles.length - 1].close : "Loading..."}}
    <va-checkbox class="inline-checkbox" v-model="uiData.showInflectionPoints" label="Show Inflection Points" />
  </div>

  <financial-chart :uiData="uiData"></financial-chart>
</template>

<style scoped>
.assetPicker {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 1000px;
}

.inline-checkbox{
  margin-left: 20px;
}

.va-checkbox {
  --va-checkbox-background: lightgray;
}
</style>