import { describe, expect, it } from 'vitest'
import getRequestBody from './body.builder.js'
import getMockedFfvbbClient, { getFfvbbFixtures } from './mock.js'

describe('ffvbbeach.org', () => {
  describe('mock', () => {
    it('should give access to fixtures', async () => {
      const ffvbbFixtures = await getFfvbbFixtures()

      expect(ffvbbFixtures).toHaveProperty('CA1')
      expect(ffvbbFixtures).toHaveProperty('LA1')
      expect(ffvbbFixtures).toHaveProperty('LA1A021')
      expect(ffvbbFixtures.CA1).toMatchSnapshot()
      expect(ffvbbFixtures.LA1).toMatchSnapshot()
      expect(ffvbbFixtures.LA1A021.toString()).toMatchSnapshot()
    })

    describe('mockedFfvbbClient', () => {
      it('should return matches list fixtures data', async () => {
        mockedFfvbbClient = await getMockedFfvbbClient()
        csvResponse = await mockedFfvbbClient.request({
          path: '/ffvbapp/resu/vbspo_calendrier_export.php',
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: getRequestBody({
            typ_edition: 'E',
            type: 'RES',
            cal_saison: '2021/2022',
            cal_codent: 'PTPL44',
            cal_codpoule: 'CA1',
          }),
        })

        const { CA1 } = await getFfvbbFixtures()
        expect(await csvResponse.body.text()).toEqual(CA1)
      })

      it('should return single match fixture data', async () => {
        mockedFfvbbClient = await getMockedFfvbbClient()
        csvResponse = await mockedFfvbbClient.request({
          path: '/ffvbapp/adressier/fiche_match_ffvb.php',
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: getRequestBody({
            wss_saison: '2021/2022',
            codent: 'PTPL44',
            codmatch: 'LA1A021',
          }),
        })

        const { LA1A021 } = await getFfvbbFixtures()
        expect(await csvResponse.body.text()).toEqual(LA1A021.toString())
      })
    })
  })
})
