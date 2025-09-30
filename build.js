import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import ics from './calendar/ics.js'
import getSaison from './ffvbbeach.org/client.js'

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

console.log(`Build started - ${codent} ${saison}`)

let nbOfMatchesFound = 0
for (const poule of poules) {
  matches[poule].push(...(await getSaison(saison, codent, poule)))
  nbOfMatchesFound += matches[poule].length
  console.log(`${matches[poule].length} matches found in poule ${poule}`)
}

console.log(`${nbOfMatchesFound} matches found`)

let nbOfClubsFound = 0
const clubMatches = {}
for (const poule of poules) {
  if (clubMatches[poule] === undefined) {
    clubMatches[poule] = {}
  }

  for (const match of matches[poule]) {
    if (clubMatches[poule][match.equipeA.nom] === undefined) {
      clubMatches[poule][match.equipeA.nom] = []
      nbOfClubsFound++
    }
    if (clubMatches[poule][match.equipeB.nom] === undefined) {
      clubMatches[poule][match.equipeB.nom] = []
      nbOfClubsFound++
    }
    clubMatches[poule][match.equipeA.nom].push(match)
    clubMatches[poule][match.equipeB.nom].push(match)
  }
}

for (const poule of poules) {
  clubMatches[poule] = Object.keys(clubMatches[poule])
    .sort()
    .reduce((obj, equipe) => {
      obj[equipe] = clubMatches[poule][equipe]
      return obj
    }, {})
}

console.log(`${nbOfClubsFound} clubs found`)

let htmlFile = `<h1>Agenda volley - ${codent} ${saison}</h1>`

for (const poule of poules) {
  htmlFile += `<h2>${poule}</h2>`
  htmlFile += `<ul>`
  for (const club of Object.keys(clubMatches[poule])) {
    const ical = ics(clubMatches[poule][club]).toString()

    if (!existsSync('dist')) {
      await mkdir('dist')
    }
    const fileName = getFileName(club, codent, saison)
    await writeFile(`dist/${fileName}`, ical)

    htmlFile += `<li><a href="${fileName}">${fileName}</a></li>`
    console.log(`Wrote "${fileName}"`)
  }
  htmlFile += `</ul>`
}

htmlFile += `<a href="https://www.netlify.com"><img src="/netlify.svg" alt="Deploys by Netlify" width="114" height="51"></a>`

await writeFile(`dist/index.html`, htmlFile)
console.log(`Wrote "index.html"`)

console.log(`Build done - ${codent} ${saison}`)

function getFileName(club, codent, saison) {
  return `${club.replaceAll(' ', '-')}-${codent}-${saison.replace(
    '/',
    '-',
  )}.ics`
}
