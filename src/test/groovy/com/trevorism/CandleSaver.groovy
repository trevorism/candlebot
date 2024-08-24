package com.trevorism

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.trevorism.http.JsonHttpClient
import com.trevorism.https.AppClientSecureHttpClient
import com.trevorism.https.SecureHttpClient
import com.trevorism.kraken.KrakenClient
import com.trevorism.kraken.impl.DefaultKrakenClient
import com.trevorism.kraken.model.Candle
import com.trevorism.kraken.model.ValidCandleDurations
import org.junit.jupiter.api.Test

class CandleSaver {

    private static final String DATASET_NAME = "crypto"
    private static final String GCP_DEFAULT_PROJECT = "trevorism-data"

    //@Test
    void saveCandles() {
        KrakenClient krakenClient = new DefaultKrakenClient()
        List<Candle> candles = krakenClient.getCandles("BTCUSD", ValidCandleDurations.DAY)

        List<Map<String, Object>> rows = []

        candles.each { candle ->
            def row = [
                    id                        : UUID.randomUUID().toString(),
                    duration                  : candle.duration.toString(),
                    time                      : candle.time,
                    open                      : candle.open,
                    high                      : candle.high,
                    low                       : candle.low,
                    close                     : candle.close,
                    volumeWeightedAveragePrice: candle.volumeWeightedAveragePrice,
                    volume                    : candle.volume,
                    count                     : candle.count
            ]
            rows.add(row)
        }

        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").create()
        SecureHttpClient jsonHttpClient = new AppClientSecureHttpClient()
        println jsonHttpClient.put("https://memory.data.trevorism.com/object/btcusd-day", gson.toJson(rows))

    }
}
