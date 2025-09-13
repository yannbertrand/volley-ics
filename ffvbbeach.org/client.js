import { Client } from 'undici'
import getMockedFfvbbClient from './mock.js'
import { getSaisonMatches } from './requests/get-saison-matches.js'

if (process.env.USE_NETWORK !== 'true') {
  console.log('Will not use network for ffvbbeach.org requests')
}

export default async function getSaison(saison, ent, poule) {
  const client = await getFfvbbClient()
  const saisonMatches = getSaisonMatches(client, saison, ent, poule)
  return saisonMatches

  //   const enrichedSaisonMatches = Promise.all(saisonMatches.map(getEnrichedMatch))
  //   return enrichedSaisonMatches
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
