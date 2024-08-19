package com.trevorism.controller

import com.trevorism.kraken.KrakenClient
import com.trevorism.kraken.impl.DefaultKrakenClient
import com.trevorism.kraken.model.Candle
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/candle")
class CandleController {

    private KrakenClient krakenClient = new DefaultKrakenClient()

    @Tag(name = "Candle Operations")
    @Operation(summary = "Returns 'pong' on success")
    @Get(value = "/{assetPair}", produces = MediaType.TEXT_PLAIN)
    List<Candle> getCandles(String assetPair, String timeframe) {
        krakenClient.getCandles(assetPair)
    }
}
