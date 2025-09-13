import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import getSaison from './ffvbbeach.org/client.js'
import ics from './ics.js'

const saison = '2025/2026'
const codent = 'PTPL44'
const poule = 'E1'

const p1matches = await getSaison(saison, codent, `C${poule}`)
const p2matches = await getSaison(saison, codent, `L${poule}`)

const club = 'USFEN'
const clubMatches = [...p1matches, ...p2matches].filter((match) =>
  [match.equipeA.nom, match.equipeB.nom].includes(club)
)

console.log(`${clubMatches.length} matches found`)

const ical = ics(clubMatches).toString()

if (!existsSync('dist')) {
  await mkdir('dist')
}
await writeFile(`dist/${club}-${codent}-${saison.replace('/', '-')}.ics`, ical)
