package com.trevorism.service

import com.trevorism.kraken.model.Candle
import org.junit.jupiter.api.Test

class FileOrKrakenCandleProviderTest {

    @Test
    void testGetCandles() {
        List<Candle> candleList = new FileOrKrakenCandleProvider().getCandles("BTCUSD")
        assert candleList.size() == 720
    }
}
