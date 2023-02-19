import { LitElement, html, unsafeCSS } from 'lit'
import {
  locationIconSvg,
  deleteIconSvg,
  humidityIconSvg,
  windSpeedIconSvg,
  moveIconSvg
} from '../assets/iconSvg'
import weatherCard from '../styles/components/weatherCard.scss?inline'
import { currentTimeFormatter, descriptionCode, isItDayOrNight } from '../utils/index'
import { getIcon } from '../utils/index'

export class WeatherCard extends LitElement {
  static get properties() {
    return {
      city: { type: String, attribute: true },
      country: { type: String, attribute: true },
      timeZone: { type: String, attribute: true },
      currentTime: { type: Number, attribute: true },
      maxTemp: { type: Number, attribute: true },
      minTemp: { type: Number, attribute: true },
      iconCode: { type: Number, attribute: true },
      precip: { type: Number, attribute: true },
      windSpeed: { type: Number, attribute: true },
      humidity: { type: Number, attribute: true },
      currentTemp: { type: Number, attribute: true },
      id: { type: String, attribute: true },
      sunrise: { type: Number },
      sunset: { type: Number }
    }
  }
  static styles = [unsafeCSS(weatherCard)]

  removeCard() {
    let detail = this.id
    let options = {
      detail: detail,
      bubble: true,
      composed: true
    }
    this.dispatchEvent(new CustomEvent('removeCard', options))
  }
  trueDragable(e) {
    const dragButton = e.target
    let detail = dragButton
    let options = {
      detail: detail,
      bubble: true,
      composed: true
    }
    this.dispatchEvent(new CustomEvent('trueDragable', options))
  }
  falseDragable(e) {
    const dragButton = e.target
    let detail = dragButton
    let options = {
      detail: detail,
      bubble: true,
      composed: true
    }
    this.dispatchEvent(new CustomEvent('falseDragable', options))
  }
  touchStart(e) {
    const dragButton = e.target
    let detail = dragButton
    let options = {
      detail: detail,
      bubble: true,
      composed: true
    }
    this.dispatchEvent(new CustomEvent('touchStart', options))
  }

  render() {
    const description = descriptionCode(this.iconCode)

    const icon = getIcon(
      this.iconCode,
      this.currentTime,
      this.sunrise,
      this.sunset,
      this.timeZone
    )
    const currentTime = currentTimeFormatter(this.currentTime, this.timeZone)
    return html` <div class="card-container">
      <span class="card-container__location">
        ${locationIconSvg} ${this.city} (${this.country})
      </span>
      <button class="card-container__remove-card" @click=${this.removeCard}>
        ${deleteIconSvg}
      </button>
      <span class="card-container__currenttime">${currentTime}</span>

      <div class="card-container__icon-container">
        <img src="/weather-app/${icon}.svg" alt=${icon} />
      </div>

      <div class="card-container__detail">
        <span class="card-container__detail__current-temp">${this.currentTemp}°C</span>
        <span>${this.maxTemp}°C / ${this.minTemp}°C</span>
      </div>

      <div class="card-container__detail__wind-humidity">
        <span> ${humidityIconSvg} ${this.humidity}% </span>
        <span> ${windSpeedIconSvg} ${this.windSpeed} km/h </span>
      </div>

      <span class="card-container__description">${description}</span>

      <button
        class="drag-button"
        @mouseout=${this.falseDragable}
        @mousemove=${this.trueDragable}
        @touchstart=${this.touchStart}
      >
        ${moveIconSvg}
      </button>
    </div>`
  }
}
customElements.define('weather-card', WeatherCard)
