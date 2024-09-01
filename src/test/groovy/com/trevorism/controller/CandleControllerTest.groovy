package com.trevorism.controller

import com.trevorism.kraken.model.ValidCandleDurations
import com.trevorism.service.FileOrKrakenCandleProvider
import org.junit.jupiter.api.Test

class CandleControllerTest {

    @Test
    void testGetCandles() {
        CandleController candleController = new CandleController()
        candleController.candleProvider = new FileOrKrakenCandleProvider()

        println candleController.getCandles("BTCUSD", "1d")

    }
}
