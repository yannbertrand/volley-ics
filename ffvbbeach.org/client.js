import { Client } from 'undici'
import getMockedFfvbbClient from './mock.js'
import { getSaisonMatches } from './requests/get-saison-matches.js'

if (process.env.USE_NETWORK !== 'true') {
  console.log('Will not use network for ffvbbeach.org requests')
}

export default async function getSaison(saison, ent, poule = null) {
  const client = await getFfvbbClient()
  const saisonMatches = await getSaisonMatches(client, saison, ent, poule)
  return saisonMatches.map((match) => ({
    ...match,
    url: `https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=${saison}&codent=${ent}${poule != null ? `&poule=${poule}` : ''}`,
  }))
}

async function getFfvbbClient() {
  if (process.env.USE_NETWORK === 'true') {
    return getNetworkFfvbbClient()
  } else {
    return await getMockedFfvbbClient()
  }
}

function getNetworkFfvbbClient() {
  return new Client('https://www.ffvbbeach.org', {
    connect: { rejectUnauthorized: false },
  })
}
