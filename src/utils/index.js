import { utcToZonedTime, format } from 'date-fns-tz'
import weatherCodes from './weatherCodesDescription.json'
const API_BASE = (lat, lon) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=auto`
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
    precipitation_sum: [precip]
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
    timezone
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

function getCurrentTimeHumidity(currentTime, hourlyTime, humidity) {
  const positionTime = hourlyTime.findIndex((time) => time === currentTime)
  return humidity[positionTime]
}

//Strorage
export function selectedCountriesList() {
  const item = JSON.parse(localStorage.getItem('selectedCountries'))
  let countries
  item ? (countries = item) : (countries = {})
  return countries
}

export function ListOfSelectedCountriesSaveToStorage(selectedCountry) {
  const selectedCountries = selectedCountriesList()
  if (!selectedCountries[selectedCountry.id]) {
    selectedCountries[selectedCountry.id] = {
      id: selectedCountry.id,
      country: selectedCountry.country,
      city: selectedCountry.city,
      latitude: selectedCountry.latitude,
      longitude: selectedCountry.longitude
    }
  }
  localStorage.setItem('selectedCountries', JSON.stringify(selectedCountries))
}

export function removeItemStorage(id) {
  const selectedCountries = selectedCountriesList()

  if (selectedCountries[id]) {
    selectedCountries[id] = undefined
  }
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
