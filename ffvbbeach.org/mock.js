import { readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { MockAgent } from 'undici'
import { fileURLToPath } from 'url'
import getRequestBody from './body.builder.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

let CA1, LA1, LA1A021
export async function getFfvbbFixtures() {
  if (CA1 === undefined) {
    CA1 = await loadCA1Fixtures()
  }
  if (LA1 === undefined) {
    LA1 = await loadLA1Fixtures()
  }
  if (LA1A021 === undefined) {
    LA1A021 = await loadLA1A021Fixtures()
  }

  return { CA1, LA1, LA1A021 }
}

async function loadCA1Fixtures() {
  const CA1Path = resolve(__dirname, 'fixtures', '2021-2022_PTPL44_CA1.csv')
  return (await readFile(CA1Path)).toString()
}

async function loadLA1Fixtures() {
  const LA1Path = resolve(__dirname, 'fixtures', '2021-2022_PTPL44_LA1.csv')
  return (await readFile(LA1Path)).toString()
}

async function loadLA1A021Fixtures() {
  const LA1A021Path = resolve(__dirname, 'fixtures', 'doc.pdf')
  return (await readFile(LA1A021Path)).toString()
}

export default async function getMockedFfvbbClient() {
  const agent = new MockAgent()
  agent.disableNetConnect()

  const { CA1, LA1, LA1A021 } = await getFfvbbFixtures()

  const mockedFfvbbClient = agent.get('https://www.ffvbbeach.org')

  mockedFfvbbClient
    .intercept({
      method: 'POST',
      path: '/ffvbapp/resu/vbspo_calendrier_export.php',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: getRequestBody({
        typ_edition: 'E',
        type: 'RES',
        cal_saison: '2021/2022',
        cal_codent: 'PTPL44',
        cal_codpoule: 'CA1',
      }),
    })
    .reply(200, CA1)

  mockedFfvbbClient
    .intercept({
      method: 'POST',
      path: '/ffvbapp/resu/vbspo_calendrier_export.php',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: getRequestBody({
        typ_edition: 'E',
        type: 'RES',
        cal_saison: '2021/2022',
        cal_codent: 'PTPL44',
        cal_codpoule: 'LA1',
      }),
    })
    .reply(200, LA1)

  mockedFfvbbClient
    .intercept({
      method: 'POST',
      path: '/ffvbapp/adressier/fiche_match_ffvb.php',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: getRequestBody({
        wss_saison: '2021/2022',
        codent: 'PTPL44',
        codmatch: 'LA1A021',
      }),
    })
    .reply(200, LA1A021)

  return mockedFfvbbClient
}
