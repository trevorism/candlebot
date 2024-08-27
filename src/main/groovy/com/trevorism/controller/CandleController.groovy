package com.trevorism.controller

import com.trevorism.kraken.KrakenClient
import com.trevorism.kraken.impl.DefaultKrakenClient
import com.trevorism.kraken.model.Candle
import com.trevorism.kraken.model.ValidCandleDurations
import com.trevorism.model.UICandle
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/candle")
class CandleController {

    private KrakenClient krakenClient = new DefaultKrakenClient()

    @Tag(name = "Candle Operations")
    @Operation(summary = "Returns 'pong' on success")
    @Get(value = "/{assetPair}", produces = MediaType.APPLICATION_JSON)
    List<UICandle> getCandles(String assetPair) {
        int index = 0
        KrakenClient krakenClient = new DefaultKrakenClient()
        List<Candle> candles = krakenClient.getCandles(assetPair, ValidCandleDurations.DAY).sort {
            it.time
        }
        return candles.collect{
            new UICandle([
                    open : it.open,
                    high : it.high,
                    low : it.low,
                    close : it.close,
                    x : ++index,
                    label : it.time
            ])
        }
    }
}
