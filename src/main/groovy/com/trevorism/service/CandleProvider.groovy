package com.trevorism.service

import com.trevorism.kraken.model.Candle

import java.time.Duration

interface CandleProvider {

    List<Candle> getCandles(String assetPair, Duration duration)
}