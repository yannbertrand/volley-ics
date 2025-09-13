import { beforeEach, describe, expect, it } from 'vitest'
import ics from './ics.js'

describe('ics', () => {
  let matches, firstMatch, response
  beforeEach(() => {
    matches = [
      {
        arbitres: ['', ''],
        date: '2021-12-15',
        entite: 'PTPL44',
        equipeA: {
          id: '0448335',
          nom: 'ST HERBLAIN VB 2',
        },
        equipeB: {
          id: '0440018',
          nom: 'LEO VOLLEY DETENTE 1',
        },
        heure: '20:00',
        journee: '09',
        matchId: 'CA1A045',
        salle: 'LA SENSIVE',
        score: '22-25,17-25,25-17,22-25',
        set: '1/3',
        total: '86-92',
      },
      {
        arbitres: ['', ''],
        date: '2022-04-04',
        entite: 'PTPL44',
        equipeA: {
          id: '0442446',
          nom: 'ASPTT 2',
        },
        equipeB: {
          id: '0440018',
          nom: 'CASSAV',
        },
        heure: '20:30',
        journee: '09',
        matchId: 'LA1A045',
        salle: 'SALLE LONGCHAMP',
        score: '',
        set: '',
        total: '',
      },
    ]
    firstMatch = matches.at(0)
    response = ics(matches, (date, hour) => {
      return new Date(date + ' ' + hour)
    }).toString()
  })

  it('should use "${equipeA.nom} vs. ${equipeB.nom}" as title', () => {
    const equipeA = firstMatch.equipeA
    const equipeB = firstMatch.equipeB
    const expectedTitle = `${equipeA.nom} vs. ${equipeB.nom}`
    expect(response).toContain(expectedTitle)
  })

  it('should fill the match location', () => {
    expect(response).toContain(firstMatch.salle)
  })
})
