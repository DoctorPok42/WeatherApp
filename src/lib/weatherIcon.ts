export const weatherIconId = (condition: string, isDay: boolean = true): string => {
  const c = (condition || "").toLowerCase()

  if (/thunder/.test(c)) return "ic-thunder"
  if (/(snow|blizzard|ice|sleet)/.test(c)) return "ic-snow"
  if (/(rain|drizzle|shower)/.test(c)) return "ic-rain"
  if (/(mist|fog|haze)/.test(c)) return "ic-cloud-fog"
  if (/partly/.test(c)) return isDay ? "ic-partly" : "ic-moon"
  if (/(cloud|overcast)/.test(c)) return "ic-cloud"

  return isDay ? "ic-sun" : "ic-moon"
}

export const weatherIconHref = (condition: string, isDay: boolean = true): string =>
  `/picto.svg#${weatherIconId(condition, isDay)}`
