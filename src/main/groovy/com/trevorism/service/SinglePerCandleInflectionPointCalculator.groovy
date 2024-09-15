package com.trevorism.service

import com.trevorism.kraken.model.Candle
import com.trevorism.model.InflectionPoint

@jakarta.inject.Singleton
class SinglePerCandleInflectionPointCalculator implements InflectionPointCalculator{

    @Override
    List<InflectionPoint> getInflectionPoints(List<Candle> candles) {
        List<InflectionPoint> inflectionPoints = []
        if(!candles){
            return inflectionPoints
        }
        boolean isCurrentlyIncreasing = candles[0].close > candles[0].open

        for(int i = 0; i < candles.size(); i++){
            Candle candle = candles.get(i)
            boolean green = candle.close > candle.open

            if(isCurrentlyIncreasing != green){
                if(green){
                    inflectionPoints.add(new InflectionPoint(value: candle.low, label: candle.time, x: i))
                }
                else{
                    inflectionPoints.add(new InflectionPoint(value: candle.high, label: candle.time, x: i))
                }

            }
            isCurrentlyIncreasing = green
        }
        return inflectionPoints
    }
}
