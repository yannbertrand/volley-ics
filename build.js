import { writeFile } from 'fs/promises'
import { buildSaison } from './build-compet.js'

const saison = '2025/2026'

console.log(`Build started - ${saison}`)

let htmlFile = `<h1>Agenda volley ${saison}</h1>`
htmlFile += `<a href="./PTPL44-2025-2026.html">Championnats départementaux 44 Loire Atlantique</a>`
htmlFile += `<a href="https://www.netlify.com"><img src="/netlify.svg" alt="Deploys by Netlify" width="114" height="51"></a>`

await writeFile(`dist/index.html`, htmlFile)
console.log(`Wrote "index.html"`)

buildSaison(saison)

console.log(`Build done - ${saison}`)
