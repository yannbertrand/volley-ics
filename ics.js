import http from 'http'
import ical from 'ical-generator'
import { add3Hours, getInstant } from './date.utils.js'

/**
 *
 * @param {Object[]} matches
 * @returns
 */
export default function (matches) {
  const calendar = ical({
    name: 'FFVB44',
    method: 'PUBLISH',
    timezone: 'Europe/Paris',
  })

  for (const match of matches) {
    const start = getInstant(match.date, match.heure)
    const end = add3Hours(start)

    const event = calendar.createEvent({
      start,
      end,
      summary: `${match.equipeA.nom} vs. ${match.equipeB.nom}`,
      location: match.salle,
      organiser: { name: 'volley-ics', email: 'comite44volley@protonmail.com' },
      status: 'CONFIRMED',
      timezone: 'Europe/Paris',
    })

    // const attendee = event.createAttendee()
    // attendee.name('Yann')
    // attendee.email('volley@y.bertrand.bzh')
    // attendee.rsvp(true)
    // attendee.status('NEEDS-ACTION')
  }

  return calendar
}

/**
 * @param {Object} calendar
 */
export function startServer(calendar) {
  http
    .createServer((req, res) => calendar.serve(res))
    .listen(3000, '127.0.0.1', () => {
      console.log('Server running at http://127.0.0.1:3000/')
    })
}
