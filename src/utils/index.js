import { utcToZonedTime, format } from 'date-fns-tz'
import weatherCodes from './weatherCodesDescription.json'
import { ICON_MAP } from '../utils/iconMap'
const API_BASE = (lat, lon) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=auto`
export async function getWeather(country) {
  const res = await fetch(API_BASE(country.latitude, country.longitude))
  const data = await res.json()
  return parseCurrentWeather(data, country)
}

export async function getCitiesFromApi(query) {
  if (query.length < 2) return
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`)
  const data = await res.json()
  return data.results
}
function parseCurrentWeather({ current_weather, daily, hourly, timezone }, selectedCountry) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
    time: currentTime
  } = current_weather
  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    precipitation_sum: [precip],
    sunrise: [sunrise],
    sunset: [sunset]
  } = daily
  const { time, relativehumidity_2m } = hourly
  const humidity = getCurrentTimeHumidity(currentTime, time, relativehumidity_2m)
  return {
    ...selectedCountry,
    currentTime,
    currentTemp: Math.round(currentTemp),
    maxTemp: Math.round(maxTemp),
    minTemp: Math.round(minTemp),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    humidity,
    iconCode,
    timezone,
    sunrise,
    sunset
  }
}

export function dateFormatter(time) {
  let date = new Date(time * 1000)
  let dateStr = date.toLocaleDateString([], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  return dateStr
}
export function isItDayOrNight(currentTime, sunrise, sunset, timezone) {
  const currentTimeZoned = utcToZonedTime(currentTime, timezone)
  const sunriseZoned = utcToZonedTime(sunrise, timezone)
  const sunsetZoned = utcToZonedTime(sunset, timezone)
  const isDayOrNight =
    currentTimeZoned.getTime() > sunriseZoned.getTime() &&
    currentTimeZoned.getTime() < sunsetZoned.getTime()
  return isDayOrNight
}
function getCurrentTimeHumidity(currentTime, hourlyTime, humidity) {
  const positionTime = hourlyTime.findIndex((time) => time === currentTime)
  return humidity[positionTime]
}

//Strorage
export function selectedCountriesList() {
  const item = JSON.parse(localStorage.getItem('selectedCountries'))
  let countries
  item ? (countries = item) : (countries = [])
  return countries
}

export function ListOfSelectedCountriesSaveToStorage(selectedCountry) {
  const selectedCountries = selectedCountriesList()
  if (selectedCountries.length === 0) {
    selectedCountries.push(selectedCountry)
  } else {
    let pushDone = false
    selectedCountries.forEach((element) => {
      if (!pushDone && element.id !== selectedCountry.id) {
        selectedCountries.push(selectedCountry)
        pushDone = true
      }
    })
  }
  localStorage.setItem('selectedCountries', JSON.stringify(selectedCountries))
}

export function removeItemStorage(id) {
  const selectedCountries = selectedCountriesList()
  selectedCountries.forEach((element) => {
    if (element.id === id) {
      selectedCountries.splice(selectedCountries.indexOf(element), 1)
    }
  })
  /*  if (selectedCountries[id]) {
    selectedCountries[id] = undefined
  } */
  localStorage.setItem('selectedCountries', JSON.stringify(selectedCountries))
}

// Formatter Current Time
export function currentTimeFormatter(currentTime, timeZone) {
  const date = new Date()
  const parseDate = (date, timeZone) => {
    const newDate = utcToZonedTime(date, timeZone)
    return format(newDate, 'HH:mm', { timeZone })
  }
  const message = parseDate(date, timeZone)
  const result = dateFormatter(currentTime)
  return `${result}, ${message}`
}
export function descriptionCode(code) {
  return weatherCodes.weatherCodes[code]
}

export function getIcon(iconCode, currentTime, sunrise, sunset, timeZone) {
  const icon = ICON_MAP.get(iconCode)
  if (icon !== 'day' && icon !== 'cloudy-cay') {
    return icon
  } else {
    const dayOrNight = isItDayOrNight(currentTime, sunrise, sunset, timeZone)
    if (dayOrNight) {
      return 'day'
    } else {
      return 'night'
    }
  }
}

/* {
  "weatherCodes": {
    "0": "Clear Sky",
    "1": "Mainly Clear",
    "2": "Partly Cloudy",
    "3": "Overcast",
    "45": "Foggy",
    "48": "Fog & Rime",
    "51": "Light Drizzle",
    "53": "Mod. Drizzle",
    "55": "Heavy Drizzle",
    "56": "Light Freeze Drizzle",
    "57": "Dense Freeze Drizzle",
    "61": "Light Rain",
    "63": "Mod. Rain",
    "65": "Heavy Rain",
    "66": "Light Freeze Rain",
    "67": "Heavy Freeze Rain",
    "71": "Light Snow",
    "73": "Mod. Snow",
    "75": "Heavy Snow",
    "77": "Snow Grains",
    "80": "Slight Rain Shower",
    "81": "Mod. Rain Shower",
    "82": "Violent Rain Shower",
    "85": "Slight Snow Shower",
    "86": "Heavy Snow Shower",
    "95": "Slight Thunderstorm",
    "96": "Slight Hail Storm",
    "99": "Heavy Hail Storm"
  }
}
{
  "weatherCodes": {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy",
    "3": "Overcast",
    "45": "Fog",
    "48": "Fog",
    "51": "Drizzle: Light",
    "53": "Drizzle: Moderate",
    "55": "Drizzle: Dense",
    "56": "Drizzle: Light",
    "57": "Drizzle: Dense",
    "61": "Rain: Slight",
    "63": "Rain: Moderate",
    "65": "Rain: Heavy",
    "66": "Rain: Light",
    "67": "Rain: Heavy",
    "71": "Snow fall: Slight",
    "73": "Snow fall: Moderate",
    "75": "Snow fall: Heavy",
    "77": "Snow grains",
    "80": "Rain showers: Slight",
    "81": "Rain showers: Moderate",
    "82": "Rain showers: Violent",
    "85": "Snow showers slight",
    "86": "Snow showers heavy",
    "95": "Thunderstorm: Slight or moderate",
    "96": "Thunderstorm with slight hail",
    "99": "Thunderstorm with heavy hail"
  }
},
{
  "weatherCodes": {
    "0": "Cielo limpio",
    "1": "Principalmente despejado",
    "2": "Parcialmente nublado",
    "3": "Nublado",
    "45": "Niebla",
    "48": "Niebla de escarcha depositada",
    "51": "Llovizna: Intensidad ligera",
    "53": "Llovizna: Intensidad moderada",
    "55": "Llovizna: Intensidad densa",
    "56": "Llovizna Engelante: Intensidad ligera",
    "57": "Llovizna Engelante: Intensidad densa",
    "61": "Lluvia: Intensidad leve",
    "63": "Lluvia: Intensidad moderada",
    "65": "Lluvia: Intensidad fuerte",
    "66": "Lluvia helada: Intensidad ligera",
    "67": "Lluvia helada: Intensidad fuerte",
    "71": "Caída de nieve: Intensidad ligera",
    "73": "Caída de nieve: Intensidad moderada",
    "75": "Caída de nieve: Intensidad fuerte",
    "77": "Granos de nieve",
    "80": "Lluvias: Leve",
    "81": "Lluvias: Moderada",
    "82": "Lluvias: Violenta",
    "85": "Chubascos de nieve leves",
    "86": "Chubascos de nieve fuertes",
    "95": "Tormenta: Ligera o moderada",
    "96": "Tormenta con granizo leve",
    "99": "Tormenta con granizo fuerte"
  }
}
 */
