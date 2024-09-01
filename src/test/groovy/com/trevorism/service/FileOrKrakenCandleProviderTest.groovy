package com.trevorism.service

import com.trevorism.kraken.model.Candle
import org.junit.jupiter.api.Test

import java.time.Duration

class FileOrKrakenCandleProviderTest {

    @Test
    void testGetCandles() {
        FileOrKrakenCandleProvider candleProvider = new FileOrKrakenCandleProvider()
        List<Candle> candleList = candleProvider.getCandlesFromFile("BTCUSD", Duration.ofDays(1))
        assert candleList.size() == 720
    }
}
