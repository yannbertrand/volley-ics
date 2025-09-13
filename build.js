import { mkdir, writeFile } from 'fs/promises'
import getSaison from './ffvbbeach.org/client.js'
import ics from './ics.js'
import 'dotenv/config'
import { existsSync } from 'fs'

const saison = '2025/2026'
const codent = 'PTPL44'

const ce1 = await getSaison(saison, codent, 'CE1')
const la1 = await getSaison(saison, codent, 'LA1')

const club = 'USFEN'
const clubMatches = [...ce1, ...la1].filter((match) =>
  [match.equipeA.nom, match.equipeB.nom].includes(club)
)

console.log(`${clubMatches.length} matches found`)

const ical = ics(clubMatches).toString()

if (!existsSync('dist')) {
  await mkdir('dist')
}
await writeFile(`dist/44-${club}.ics`, ical)
