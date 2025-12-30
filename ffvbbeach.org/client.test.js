import { describe, expect, it } from 'vitest'
import getSaison from './client.js'

describe('mockedFfvbbClient', () => {
  describe('getSaison', () => {
    it('should return matches list', async () => {
      const saison = '2025/2026'
      const codent = 'PTPL44'
      const poule = 'E1'
      const matches = await getSaison(saison, codent, poule)

      expect(matches).toHaveLength(45)
      expect(matches).toMatchSnapshot()
    })
  })
})
