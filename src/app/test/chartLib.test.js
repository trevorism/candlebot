import { describe, it, expect } from 'vitest'
import { createXLabelLookup } from '../src/lib/chartLib.js'

describe('createXLabelLookup', () => {
  it('maps each candle x to its label', () => {
    const candles = [
      { x: 0, label: 'A' },
      { x: 1, label: 'B' },
      { x: 2, label: 'C' }
    ]
    expect(createXLabelLookup(candles)).toEqual({ 0: 'A', 1: 'B', 2: 'C' })
  })

  it('skips candles without a label', () => {
    const candles = [
      { x: 0, label: 'A' },
      { x: 1 },
      { x: 2, label: 'C' }
    ]
    expect(createXLabelLookup(candles)).toEqual({ 0: 'A', 2: 'C' })
  })

  it('formats numeric epoch-millis labels as yyyy-mm-dd', () => {
    const epochMillis = Date.UTC(2025, 0, 15) // 2025-01-15
    const candles = [{ x: 0, label: String(epochMillis) }]
    expect(createXLabelLookup(candles)).toEqual({ 0: '2025-01-15' })
  })

  it('leaves non-numeric labels untouched', () => {
    const candles = [{ x: 5, label: 'BTCUSD' }]
    expect(createXLabelLookup(candles)).toEqual({ 5: 'BTCUSD' })
  })

  it('returns an empty lookup for no candles', () => {
    expect(createXLabelLookup([])).toEqual({})
  })
})
