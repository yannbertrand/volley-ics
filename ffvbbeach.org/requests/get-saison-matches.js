import Papa from 'papaparse'
import getRequestBody from '../body.builder.js'

export async function getSaisonMatches(client, saison, ent, poule) {
  let response
  try {
    response = await client.request({
      path: '/ffvbapp/resu/vbspo_calendrier_export.php',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: getRequestBody({
        typ_edition: 'E',
        type: 'RES',
        cal_saison: saison,
        cal_codent: ent,
        cal_codpoule: poule,
      }),
    })
  } catch (exception) {
    handleFfvbbRequestError(exception)
  }

  const csvContent = await response.body.text()
  const rawContent = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) =>
      header.startsWith('Entit') ? 'Entite' : header,
  }).data

  const mapEquipeA = new Map()
  mapEquipeA.set('id', 'EQA_no')
  mapEquipeA.set('nom', 'EQA_nom')

  const mapEquipeB = new Map()
  mapEquipeB.set('id', 'EQB_no')
  mapEquipeB.set('nom', 'EQB_nom')

  const mapArbitres = new Set()
  mapArbitres.add('Arb1')
  mapArbitres.add('Arb2')

  const mapMatch = new Map()
  mapMatch.set('entite', 'Entite')
  mapMatch.set('journee', 'Jo')
  mapMatch.set('matchId', 'Match')
  mapMatch.set('date', 'Date')
  mapMatch.set('heure', 'Heure')
  mapMatch.set('equipeA', mapEquipeA)
  mapMatch.set('equipeB', mapEquipeB)
  mapMatch.set('set', 'Set')
  mapMatch.set('score', 'Score')
  mapMatch.set('total', 'Total')
  mapMatch.set('salle', 'Salle')
  mapMatch.set('arbitres', mapArbitres)

  return mapData(rawContent, mapMatch)
}

function handleFfvbbRequestError(exception) {
  switch (exception.errno) {
    case -3008:
      throw new Error(
        'www.ffvbbeach.org was not found, are you connected to the internet?\nOr do you need to work with mocked data using `USE_NETWORK=false`?'
      )
    default:
      console.error(exception)
      throw new Error(
        'An unkown error occured while requesting www.ffvbbeach.org'
      )
  }
}

function mapData(data, mapValues) {
  return data.map((item) => {
    const mappedData = {}

    for (const [toKey, fromKey] of mapValues) {
      if (fromKey instanceof Map) {
        const subData = {}
        for (const [subKey, realFromKey] of fromKey) {
          subData[subKey] = item[realFromKey]
        }
        mappedData[toKey] = subData
        continue
      }

      if (fromKey instanceof Set) {
        const subData = []
        for (const realFromKey of fromKey) {
          subData.push(item[realFromKey])
        }
        mappedData[toKey] = subData
        continue
      }

      if (toKey === 'salle') {
        mappedData['salle'] = getSalleAdress(item[fromKey].trim())
      } else {
        mappedData[toKey] = item[fromKey].trim()
      }
    }

    return mappedData
  })
}

function getSalleAdress(salle) {
  return (
    {
      'SALLE LONGCHAMP': 'Salle Longchamp, 42 Rue Chanteclerc, 44300 Nantes',
      'SALLE DU CHEVALIER':
        'Salle du Chevalier, 44450 Saint-Julien-de-Concelles',
      'SALLE GARDIN': 'Salle Jean-Pierre Gardin, 44860 Pont St. Martin',
      'SALLE RAPHAEL LEBEL':
        'Gymnase Raphaël Lebel, 16 Bd Auguste Peneau, 44300 Nantes',
      'LA SENSIVE':
        'Gymnase De La Sensive, Rue de Bordeaux, 44800 Saint-Herblain',
      'SALLE DE LA GAGNERIE':
        'Salle de la gagnerie, 17 Rue de la Gagnerie, 44340 Bouguenais',
      'SALLE GASTON TURPIN':
        'Gymnase Gaston Turpin, 33 Rue Gaston Turpin, 44000 Nantes',
      'GYMNASE L. ET M. LIBERGE':
        'Gymnase Liberge, 11 Rue de la Galarnière, 44400 Rezé',
      'SALLE DE LA PAPINIERE':
        'Salle de la Papinière, 18 Rue de la Papinière, 44240 Sucé-sur-Erdre',
    }[salle] || salle
  )
}
