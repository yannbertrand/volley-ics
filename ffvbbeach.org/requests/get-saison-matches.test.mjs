import { describe, beforeEach, it, expect } from 'vitest'
import getMockedFfvbbClient from '../mock.mjs'
import { getSaisonMatches } from './get-saison-matches.mjs'

describe('getSaisonMatches', () => {
  let ca1
  beforeEach(async () => {
    client = await getMockedFfvbbClient()
    ca1 = await getSaisonMatches(client, '2021/2022', 'PTPL44', 'CA1')
  })

  it('should fetch ffvbbeach.org data', () => {
    expect(ca1).toBeDefined()
    expect(ca1).toHaveLength(45)
    expect(ca1).toMatchSnapshot()
  })
})
