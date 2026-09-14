import { writeFile } from 'fs/promises'
import { buildSaison } from './build-compet.js'

const saison = '2026/2027'

console.log(`Build started - ${saison}`)

let htmlFile = `<h1>Agenda volley ${saison}</h1>`
htmlFile += '<ol>'
htmlFile += `<li><a href="./PTBR35-2026-2027.html">Championnats départementaux 35 Ille-et-Vilaine</a></li>`
htmlFile += `<li><a href="./PTPL44-2026-2027.html">Championnats départementaux 44 Loire Atlantique</a></li>`
htmlFile += '</ol>'
htmlFile += `<a href="https://www.netlify.com"><img src="/netlify.svg" alt="Deploys by Netlify" width="114" height="51"></a>`

await writeFile(`dist/index.html`, htmlFile)
console.log(`Wrote "index.html"`)

await buildSaison(saison, 'PTBR35')
await buildSaison(saison, 'PTPL44')

console.log(`Build done - ${saison}`)
