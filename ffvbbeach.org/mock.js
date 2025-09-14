import { readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { MockAgent } from 'undici'
import { fileURLToPath } from 'url'
import getRequestBody from './requests/body.builder.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

let CA1_2021_2022, LA1_2021_2022, CE1_2025_2026, LE1_2025_2026, LA1A021
export async function getFfvbbFixtures() {
  if (CA1_2021_2022 === undefined) {
    CA1_2021_2022 = await loadCA1Fixtures()
  }
  if (LA1_2021_2022 === undefined) {
    LA1_2021_2022 = await loadLA1Fixtures()
  }
  if (CE1_2025_2026 === undefined) {
    CE1_2025_2026 = await loadCE1Fixtures()
  }
  if (LE1_2025_2026 === undefined) {
    LE1_2025_2026 = await loadLE1Fixtures()
  }
  if (LA1A021 === undefined) {
    LA1A021 = await loadLA1A021Fixtures()
  }

  return { CA1_2021_2022, LA1_2021_2022, CE1_2025_2026, LE1_2025_2026, LA1A021 }
}

async function loadCA1Fixtures() {
  const CA1Path = resolve(__dirname, 'fixtures', '2021-2022_PTPL44_CA1.csv')
  return (await readFile(CA1Path)).toString()
}

async function loadLA1Fixtures() {
  const LA1Path = resolve(__dirname, 'fixtures', '2021-2022_PTPL44_LA1.csv')
  return (await readFile(LA1Path)).toString()
}

async function loadCE1Fixtures() {
  const CE1Path = resolve(__dirname, 'fixtures', '2025-2026_PTPL44_CE1.csv')
  return (await readFile(CE1Path)).toString()
}

async function loadLE1Fixtures() {
  const LE1Path = resolve(__dirname, 'fixtures', '2025-2026_PTPL44_LE1.csv')
  return (await readFile(LE1Path)).toString()
}

async function loadLA1A021Fixtures() {
  const LA1A021Path = resolve(__dirname, 'fixtures', 'doc.pdf')
  return await readFile(LA1A021Path)
}

export default async function getMockedFfvbbClient() {
  const agent = new MockAgent()
  agent.disableNetConnect()

  const {
    CA1_2021_2022,
    LA1_2021_2022,
    CE1_2025_2026,
    LE1_2025_2026,
    LA1A021,
  } = await getFfvbbFixtures()

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
    .reply(200, CA1_2021_2022)

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
    .reply(200, LA1_2021_2022)

  mockedFfvbbClient
    .intercept({
      method: 'POST',
      path: '/ffvbapp/resu/vbspo_calendrier_export.php',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: getRequestBody({
        typ_edition: 'E',
        type: 'RES',
        cal_saison: '2025/2026',
        cal_codent: 'PTPL44',
        cal_codpoule: 'CE1',
      }),
    })
    .reply(200, CE1_2025_2026)

  mockedFfvbbClient
    .intercept({
      method: 'POST',
      path: '/ffvbapp/resu/vbspo_calendrier_export.php',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: getRequestBody({
        typ_edition: 'E',
        type: 'RES',
        cal_saison: '2025/2026',
        cal_codent: 'PTPL44',
        cal_codpoule: 'LE1',
      }),
    })
    .reply(200, LE1_2025_2026)

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
