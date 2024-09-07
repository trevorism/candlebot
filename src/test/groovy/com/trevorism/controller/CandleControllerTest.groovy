package com.trevorism.controller

import com.trevorism.kraken.model.Candle
import com.trevorism.model.UICandle
import com.trevorism.service.CandleProvider
import org.junit.jupiter.api.Test

import java.time.Duration
import java.time.Instant
import java.time.temporal.ChronoUnit

class CandleControllerTest {

    @Test
    void testGetCandles() {
        CandleController candleController = new CandleController()
        candleController.candleProvider = new CandleProvider() {
            @Override
            List<Candle> getCandles(String assetPair, Duration duration) {
                return [
                        new Candle(open: 1, high: 2, low: 3, close: 4, time: Date.from(Instant.now())),
                        new Candle(open: 2, high: 3, low: 4, close: 5, time: Date.from(Instant.now().minus(1, ChronoUnit.DAYS))),
                        new Candle(open: 3, high: 4, low: 5, close: 6, time: Date.from(Instant.now().minus(2, ChronoUnit.DAYS)))
                ]
            }
        }

        List<UICandle> uiCandles = candleController.getCandles("BTCUSD", "1d")

        assert uiCandles
        assert uiCandles.size() == 3

        assert uiCandles[0].open == 3
        assert uiCandles[1].open == 2
        assert uiCandles[2].open == 1

        assert uiCandles[0].close == 6
        assert uiCandles[1].close == 5
        assert uiCandles[2].close == 4

    }

    @Test
    void testConvertIsoToDate() {
        Date date = CandleController.convertIsoToDate("2021-09-01T00:00:00Z")
        assert date
    }

    @Test
    void testMapDuration() {
        assert CandleController.mapDuration("1d") == Duration.ofDays(1)
        assert CandleController.mapDuration("1m") == Duration.ofMinutes(1)
        assert CandleController.mapDuration("1w") == Duration.ofDays(7)
    }
}
