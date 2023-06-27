export function getWeekDays() {
  const formatted = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatted.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      return weekDay
        .substring(0, 1)
        .toLocaleUpperCase()
        .concat(weekDay.substring(1))
    })
}
