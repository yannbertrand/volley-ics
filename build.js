import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import getSaison from './ffvbbeach.org/client.js'
import ics from './ics.js'

const saison = '2025/2026'
const codent = 'PTPL44'
const matches = {
  A1: [],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
  C2: [],
  D1: [],
  D2: [],
  E1: [],
  E2: [],
  F1: [],
  F2: [],
  G1: [],
  Y1: [],
  Y2: [],
}
const poules = Object.keys(matches)

let nbOfMatchesFound = 0
for (const poule of poules) {
  matches[poule].push(...(await getSaison(saison, codent, poule)))
  nbOfMatchesFound += matches[poule].length
  console.log(`${matches[poule].length} matches found in ${poule} poule`)
}

console.log(`${nbOfMatchesFound} matches found`)

const clubMatches = {}
for (const poule of poules) {
  if (clubMatches[poule] === undefined) {
    clubMatches[poule] = {}
  }

  for (const match of matches[poule]) {
    if (clubMatches[poule][match.equipeA.nom] === undefined) {
      clubMatches[poule][match.equipeA.nom] = []
    }
    if (clubMatches[poule][match.equipeB.nom] === undefined) {
      clubMatches[poule][match.equipeB.nom] = []
    }
    clubMatches[poule][match.equipeA.nom].push(match)
    clubMatches[poule][match.equipeB.nom].push(match)
  }
}

for (const poule of poules) {
  for (const club of Object.keys(clubMatches[poule])) {
    console.log(club)
    const ical = ics(clubMatches[poule][club]).toString()

    if (!existsSync('dist')) {
      await mkdir('dist')
    }
    await writeFile(
      `dist/${club.replace(' ', '-')}-${codent}-${saison.replace(
        '/',
        '-'
      )}.ics`,
      ical
    )
  }
}
