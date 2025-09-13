import getSaison from './ffvbbeach.org/client.mjs'
import ics, { startServer } from './ics.mjs'
import 'dotenv/config'

const ca1 = await getSaison('2021/2022', 'PTPL44', 'CA1')
const la1 = await getSaison('2021/2022', 'PTPL44', 'LA1')

const ASPTT1 = 'ASPTT 1'
const asptt1 = [...ca1, ...la1].filter((match) =>
  [match.equipeA.nom, match.equipeB.nom].includes(ASPTT1)
)

const lastMatch = asptt1.at(-1)

console.log(lastMatch)

const ical = ics([lastMatch])
console.log(ical.toString())

startServer(ical)
