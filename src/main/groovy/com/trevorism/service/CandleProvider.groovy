package com.trevorism.service

import com.trevorism.kraken.model.Candle

interface CandleProvider {

    List<Candle> getCandles(String assetPair)
}