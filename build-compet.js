import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import ics from './calendar/ics.js'
import getSaison from './ffvbbeach.org/client.js'

export async function buildSaison(saison, codent = 'PTPL44') {
  const matches = []
  const poules = [
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'C2',
    'D1',
    'D2',
    'E1',
    'E2',
    'F1',
    'F2',
    'G1',
    'Y1',
    'Y2',
  ]

  console.log(`Build started - ${codent} ${saison}`)

  for (const poule of poules) {
    const newMatches = await getSaison(saison, codent, poule)
    matches.push(...newMatches)
    console.log(`${newMatches.length} matches found in poule ${poule}`)
  }

  console.log(`${matches.length} matches found`)

  let nbOfClubsFound = 0
  let clubMatches = {}
  for (const match of matches) {
    if (clubMatches[match.equipeA.nom] === undefined) {
      clubMatches[match.equipeA.nom] = []
      nbOfClubsFound++
    }
    if (clubMatches[match.equipeB.nom] === undefined) {
      clubMatches[match.equipeB.nom] = []
      nbOfClubsFound++
    }
    clubMatches[match.equipeA.nom].push(match)
    clubMatches[match.equipeB.nom].push(match)
  }

  clubMatches = Object.keys(clubMatches)
    .sort()
    .reduce((obj, equipe) => {
      obj[equipe] = clubMatches[equipe]
      return obj
    }, {})

  console.log(`${nbOfClubsFound} clubs found`)

  let htmlFile = `<h1>Agenda volley - ${codent} ${saison}</h1>`

  for (const club of Object.keys(clubMatches)) {
    const ical = ics(clubMatches[club]).toString()

    if (!existsSync('dist')) {
      await mkdir('dist')
    }
    const fileName = getFileName(club, codent, saison)
    await writeFile(`dist/${fileName}`, ical)

    htmlFile += `<li><a href="${fileName}">${fileName}</a></li>`
    console.log(`Wrote "${fileName}"`)
  }
  htmlFile += `</ul>`

  htmlFile += `<a href="https://www.netlify.com"><img src="/netlify.svg" alt="Deploys by Netlify" width="114" height="51"></a>`

  await writeFile(`dist/${codent}-${saison.replace('/', '-')}.html`, htmlFile)
  console.log(`Wrote "${codent}-${saison.replace('/', '-')}.html"`)

  console.log(`Build done - ${codent} ${saison}`)
}

function getFileName(club, codent, saison) {
  return `${club.replaceAll(' ', '-')}-${codent}-${saison.replace(
    '/',
    '-',
  )}.ics`
}
