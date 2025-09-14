import { describe, expect, it } from 'vitest'
import { add3Hours, getInstant } from './date.utils.js'

describe('getInstant', () => {
  it('should return proper Date', () => {
    const result = getInstant('2025-09-22', '19:30')

    expect(result).toEqual(new Date(2025, 8, 22, 19, 30))
  })
})

describe('add3Hours', () => {
  it('should add 3 hours to Date', () => {
    const date = new Date(2025, 8, 22, 19, 30)

    const datePlus3Hours = add3Hours(date)

    expect(datePlus3Hours).toEqual(new Date(2025, 8, 22, 22, 30))
  })
})
