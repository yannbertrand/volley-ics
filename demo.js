import ics, { startServer } from './calendar/ics.js'
import getSaison from './ffvbbeach.org/client.js'

const saison = '2025/2026'
const codent = 'PTPL44'
const poule = 'E1'

const matches = await getSaison(saison, codent, poule)

const club = 'USFEN'
const clubMatches = matches.filter((match) =>
  [match.equipeA.nom, match.equipeB.nom].includes(club)
)

const firstMatch = clubMatches.at(0)

const ical = ics([firstMatch])
console.log(ical.toString())

startServer(ical)
