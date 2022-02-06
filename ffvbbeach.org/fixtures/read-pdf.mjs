import PDFParser from 'pdf2json'
import fs from 'fs/promises'

const pdfParser = new PDFParser()

const pdfBuffer = await fs.readFile('ffvbbeach.org/fixtures/match.pdf')
console.log(pdfBuffer)

pdfParser.on('readable', (meta) => console.log('PDF Metadata', meta))
pdfParser.on('data', (page) => {
  console.log(page ? 'One page paged' : 'All pages parsed', page)
  if (page === null) return
  console.log(
    page.Texts.map((t) => t.R.map((R) => decodeURIComponent(R.T))).flat()
  )
})
pdfParser.on('error', (err) => console.error('Parser Error', err))

pdfParser.parseBuffer(pdfBuffer)
// pdfParser.loadPDF('ffvbbeach.org/fixtures/match.pdf')
