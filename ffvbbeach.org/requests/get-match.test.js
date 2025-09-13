import { beforeEach, describe, expect, it } from 'vitest'
import getMockedFfvbbClient from '../mock.js'
import { getMatch } from './get-match.js'

describe.only('getSaisonMatches', () => {
  let matchAsptt1vsAsbr1
  beforeEach(async () => {
    client = await getMockedFfvbbClient()
    matchAsptt1vsAsbr1 = await getMatch(
      client,
      '2021/2022',
      'PTPL44',
      'LA1A021'
    )
  })

  it('should fetch ffvbbeach.org data', () => {
    expect(matchAsptt1vsAsbr1).toBeDefined()
    expect(matchAsptt1vsAsbr1).toMatchSnapshot()
  })
})
