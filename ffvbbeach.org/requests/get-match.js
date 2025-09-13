import PDFParser from 'pdf2json'
import getRequestBody from '../body.builder.js'

export async function getMatch(client, saison, ent, matchId) {
  let bufferResult
  try {
    bufferResult = await new Promise(async (resolve, reject) => {
      let buff = new Buffer.alloc(0)
      const { body } = await client.request({
        path: '/ffvbapp/adressier/fiche_match_ffvb.php',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: getRequestBody({
          wss_saison: saison,
          codent: ent,
          codmatch: matchId,
        }),
      })
      body.on('error', (error) => {
        reject(error)
      })
      body.on('data', (chunk) => {
        buff = Buffer.concat([buff, chunk])
      })
      body.on('end', () => {
        resolve(buff)
      })
    })
  } catch (exception) {
    // ToDo
    console.error(exception)
    throw new Error(
      'An unkown error occured while requesting www.ffvbbeach.org'
    )
  }

  const pages = await new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()
    const tmpPages = []
    pdfParser.on('readable', (meta) => console.log('PDF Metadata', meta))
    pdfParser.on('data', (page) => {
      if (page === null) {
        return resolve(tmpPages)
      }

      tmpPages.push(
        page.Texts.flatMap((t) => t.R.map((R) => decodeURIComponent(R.T)))
      )
      console.log(page)
    })
    pdfParser.on('error', (error) => reject(error))

    pdfParser.parseBuffer(bufferResult)
  })

  return pages[0]
}
