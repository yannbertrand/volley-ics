import { describe, expect, it } from 'vitest'
import getMockedFfvbbClient from '../mock.js'
import { getMatch } from './get-match.js'

describe('getMatch', () => {
  it('should fetch ffvbbeach.org data', async () => {
    const client = await getMockedFfvbbClient()
    const matchAsptt1vsAsbr1 = await getMatch(
      client,
      '2021/2022',
      'PTPL44',
      'LA1A021',
    )
    expect(matchAsptt1vsAsbr1).toBeDefined()
    expect(matchAsptt1vsAsbr1).toMatchSnapshot()
  })
})
