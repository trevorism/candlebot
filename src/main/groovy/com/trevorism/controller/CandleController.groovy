package com.trevorism.controller

import com.trevorism.kraken.model.Candle
import com.trevorism.kraken.model.ValidCandleDurations
import com.trevorism.model.UICandle
import com.trevorism.service.CandleProvider
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.inject.Inject

import java.text.SimpleDateFormat
import java.time.Duration

@Controller("/api/candle")
class CandleController {

    private static final String ISO_8601_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'"

    @Inject
    CandleProvider candleProvider

    @Tag(name = "Candle Operations")
    @Operation(summary = "Returns 'pong' on success")
    @Get(value = "/{assetPair}/{durationString}", produces = MediaType.APPLICATION_JSON)
    List<UICandle> getCandles(String assetPair, String durationString) {
        int index = 0
        Duration duration = mapDuration(durationString)
        List<Candle> candles = candleProvider.getCandles(assetPair, duration).sort {
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

    private static Duration mapDuration(String durationString) {
        switch (durationString) {
            case "1m":
                return ValidCandleDurations.MINUTE
            case "5m":
                return ValidCandleDurations.FIVE_MINUTES
            case "15m":
                return ValidCandleDurations.FIFTEEN_MINUTES
            case "1h":
                return ValidCandleDurations.HOUR
            case "1d":
                return ValidCandleDurations.DAY
            case "1w":
                return ValidCandleDurations.WEEK
            default:
                return ValidCandleDurations.DAY
        }
    }
}
