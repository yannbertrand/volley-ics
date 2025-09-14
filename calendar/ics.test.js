import { beforeEach, describe, expect, it } from 'vitest'
import { getInstant } from './date.utils.js'
import ics from './ics.js'

describe('ics', () => {
  let matches, firstMatch
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
  })

  it('should use "${equipeA.nom} vs. ${equipeB.nom}" as title', () => {
    const expectedTitle = `${firstMatch.equipeA.nom} vs. ${firstMatch.equipeB.nom}`

    const response = ics(matches).toString()

    expect(response).toContain(expectedTitle)
  })

  it('should fill the match location', () => {
    const response = ics(matches).toString()

    expect(response).toContain(firstMatch.salle)
  })

  it('should fill the match start datetime', () => {
    const datetime = getIcsDateTime(firstMatch.date, firstMatch.heure)

    const response = ics(matches).toString()

    expect(response).toContain(`DTSTART;TZID=Europe/Paris:${datetime}`)
  })

  it('should fill the match end datetime', () => {
    const datetime = getIcsDateTime(firstMatch.date, firstMatch.heure, 3)

    const response = ics(matches).toString()

    expect(response).toContain(`DTEND;TZID=Europe/Paris:${datetime}`)
  })
})

function getIcsDateTime(date, heure, addHours = 0) {
  const instant = getInstant(date, heure)
  const year = instant.getFullYear()
  const month = `${instant.getMonth() + 1}`.padStart(2, '0')
  const day = `${instant.getDate()}`.padStart(2, '0')
  const hours = `${instant.getHours() + addHours}`.padStart(2, '0')
  const minutes = `${instant.getMinutes()}`.padStart(2, '0')

  return `${year}${month}${day}T${hours}${minutes}`
}
