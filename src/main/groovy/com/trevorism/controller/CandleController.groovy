package com.trevorism.controller

import com.trevorism.kraken.model.Candle
import com.trevorism.kraken.model.ValidCandleDurations
import com.trevorism.model.InflectionPoint
import com.trevorism.model.UICandle
import com.trevorism.model.UiData
import com.trevorism.service.CandleProvider
import com.trevorism.service.InflectionPointCalculator
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

    @Inject
    InflectionPointCalculator inflectionPointCalculator

    @Tag(name = "Candle Operations")
    @Operation(summary = "Returns 'pong' on success")
    @Get(value = "/{assetPair}/{durationString}", produces = MediaType.APPLICATION_JSON)
    UiData getChartData(String assetPair, String durationString) {
        Duration duration = mapDuration(durationString)
        List<Candle> candles = candleProvider.getCandles(assetPair, duration).sort { it.time}
        List<UICandle> uiCandles = collectUiCandles(candles)
        List<InflectionPoint> inflectionPoints = inflectionPointCalculator.getInflectionPoints(candles)
        return new UiData(candles: uiCandles, inflectionPoints: inflectionPoints)
    }

    private static List<UICandle> collectUiCandles(List<Candle> candles) {
        int index = 0
        candles.collect {
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

    private static Date convertIsoToDate(String isoTime) {
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
