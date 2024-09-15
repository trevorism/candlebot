package com.trevorism.service

import com.trevorism.kraken.model.Candle
import com.trevorism.model.InflectionPoint

interface InflectionPointCalculator {

    List<InflectionPoint> getInflectionPoints(List<Candle> candles)
}