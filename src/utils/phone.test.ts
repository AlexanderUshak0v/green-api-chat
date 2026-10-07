import { describe, expect, it } from 'vitest'
import { normalizePhone } from './phone'

describe('normalizePhone', () => {
  it.each([
    ['+7 (912) 443-40-49', '79124434049'],
    ['89124434049', '79124434049'],
    ['9124434049', '79124434049'],
    ['+44 20 7946 0958', '442079460958'],
  ])('%s → %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it.each(['', '123', 'не номер'])('возвращает null для "%s"', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})
