import { Client } from 'undici'
import getMockedFfvbbClient from './mock.js'
import { getSaisonMatches } from './requests/get-saison-matches.js'

if (process.env.USE_NETWORK !== 'true') {
  console.log('Will not use network for ffvbbeach.org requests')
}

export default async function getSaison(saison, ent, poule) {
  const client = await getFfvbbClient()
  const saisonMatches = (
    await Promise.all([
      //   getSaisonMatches(client, saison, ent, `C${poule}`),
      getSaisonMatches(client, saison, ent, `L${poule}`),
    ])
  ).flat()
  return saisonMatches
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
