import getSaison from './ffvbbeach.org/client.js'
import ics, { startServer } from './ics.js'

const saison = '2021/2022'
const codent = 'PTPL44'
const poule = 'A1'

const p1matches = await getSaison(saison, codent, `C${poule}`)
const p2matches = await getSaison(saison, codent, `L${poule}`)

const club = 'ASPTT 1'
const clubMatches = [...p1matches, ...p2matches].filter((match) =>
  [match.equipeA.nom, match.equipeB.nom].includes(club)
)

const firstMatch = clubMatches.at(0)

const ical = ics([firstMatch])
console.log(ical.toString())

startServer(ical)
