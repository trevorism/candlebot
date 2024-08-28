package com.trevorism.service

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.trevorism.kraken.KrakenClient
import com.trevorism.kraken.impl.DefaultKrakenClient
import com.trevorism.kraken.model.Candle
import com.trevorism.kraken.model.ValidCandleDurations

@jakarta.inject.Singleton
class FileOrKrakenCandleProvider implements CandleProvider {

    private KrakenClient krakenClient = new DefaultKrakenClient()
    private Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").create()

    @Override
    List<Candle> getCandles(String assetPair) {
        if (assetPair.toUpperCase() == "BTCUSD") {
            String arrayString = FileOrKrakenCandleProvider.class.getClassLoader().getResourceAsStream("btcusd-day").text
            return gson.fromJson(arrayString, List)
        }
        return krakenClient.getCandles(assetPair, ValidCandleDurations.DAY)
    }
}
