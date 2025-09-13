/**
 * Get an instant datetime from a date & time
 * @param {string} date (format: 2022-01-19)
 * @param {string} time (format: 20:30)
 * @returns Date
 */
export function getInstant(date, time) {
  const [year, month, day] = date.split('-')
  const [hour, minute] = time.split(':')

  return new Date(year, month - 1, day, hour, minute)

  //   const timeZonedDateTime = Temporal.ZonedDateTime.from({
  //     timeZone: 'Europe/',
  //     year,
  //     month,
  //     day,
  //     hour,
  //     minute,
  //   })

  //   return new Date(timeZonedDateTime.toInstant().toString())
}

export function add3Hours(oldDate) {
  const newDate = new Date(oldDate)
  newDate.setHours(newDate.getHours() + 3)
  return newDate
}
