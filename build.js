import { mkdir, writeFile } from 'fs/promises'
import getSaison from './ffvbbeach.org/client.js'
import ics from './ics.js'
import 'dotenv/config'
import { existsSync } from 'fs'

const ca1 = await getSaison('2021/2022', 'PTPL44', 'CA1')
const la1 = await getSaison('2021/2022', 'PTPL44', 'LA1')

const ASPTT1 = 'ASPTT 1'
const asptt1 = [...ca1, ...la1].filter((match) =>
  [match.equipeA.nom, match.equipeB.nom].includes(ASPTT1)
)

console.log(`${asptt1.length} matches found`)

const ical = ics(asptt1).toString()

if (!existsSync('dist')) {
  await mkdir('dist')
}
await writeFile('dist/44-asptt1.ics', ical)
