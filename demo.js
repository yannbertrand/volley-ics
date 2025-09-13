import getSaison from './ffvbbeach.org/client.js'
import ics, { startServer } from './ics.js'
import 'dotenv/config'

const ce1 = await getSaison('2025/2026', 'PTPL44', 'CE1')
const la1 = await getSaison('2025/2026', 'PTPL44', 'LA1')

const USFEN = 'USFEN'
const usfenMatches = [...ce1, ...la1].filter((match) =>
  [match.equipeA.nom, match.equipeB.nom].includes(USFEN)
)

const firstMatch = usfenMatches.at(0)

const ical = ics([firstMatch])
console.log(ical.toString())

startServer(ical)
