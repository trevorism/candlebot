package com.trevorism.controller

import com.trevorism.kraken.model.Candle
import com.trevorism.model.UICandle
import com.trevorism.service.CandleProvider
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.inject.Inject

import java.text.SimpleDateFormat

@Controller("/api/candle")
class CandleController {

    private static final String ISO_8601_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'"

    @Inject
    CandleProvider candleProvider

    @Tag(name = "Candle Operations")
    @Operation(summary = "Returns 'pong' on success")
    @Get(value = "/{assetPair}", produces = MediaType.APPLICATION_JSON)
    List<UICandle> getCandles(String assetPair) {
        int index = 0
        List<Candle> candles = candleProvider.getCandles(assetPair).sort {
            it.time
        }
        return candles.collect {
            Date labelDate = null
            if (it.time instanceof String) {
                labelDate = convertIsoToDate(it.time)
            } else {
                labelDate = it.time
            }

            new UICandle([
                    open : it.open,
                    high : it.high,
                    low  : it.low,
                    close: it.close,
                    x    : index++,
                    label: labelDate
            ])
        }
    }

    static Date convertIsoToDate(String isoTime) {
        SimpleDateFormat sdf = new SimpleDateFormat(ISO_8601_FORMAT)
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"))
        return sdf.parse(isoTime)
    }
}
