import { describe, expect, it } from 'vitest'
import getMockedFfvbbClient from '../mock.js'
import { getSaisonMatches } from './get-saison-matches.js'

describe('getSaisonMatches', () => {
  it('should fetch ffvbbeach.org data', async () => {
    const client = await getMockedFfvbbClient()
    const matches = await getSaisonMatches(client, '2021/2022', 'PTPL44', 'CA1')

    expect(matches).toBeDefined()
    expect(matches).toHaveLength(45)
    expect(matches).toMatchSnapshot()
  })
})
