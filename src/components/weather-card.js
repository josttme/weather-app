import { LitElement, html, unsafeCSS } from 'lit'
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
      <div class="card-container__currenttime-deletecard">
        <div class="card-container__currenttime-deletecard__location">
          <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 200 200">
            <path
              fill-rule="evenodd"
              d="M155.06 85.271c0 33.32792-38.88769 71.23137-51.41882 82.58054-2.20364 1.9955-5.47872 1.9955-7.68236 0C83.42782 156.50237 44.54 118.59892 44.54 85.271c0-30.51924 24.74076-55.26 55.26-55.26 30.51948 0 55.26 24.74076 55.26 55.26Zm-35.305 0c0 11.02069-8.93431 19.955-19.955 19.955s-19.955-8.93431-19.955-19.955c0-11.0208 8.93431-19.955 19.955-19.955s19.955 8.9342 19.955 19.955Z"
            />
          </svg>
          <h3>${this.city} (${this.country})</h3>
        </div>
        <button @click=${this.removeCard}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 15 15">
            <path
              fill="#d10101"
              d="m14.8 12 3.6-3.6c.8-.8.8-2 0-2.8-.8-.8-2-.8-2.8 0L12 9.2 8.4 5.6c-.8-.8-2-.8-2.8 0-.8.8-.8 2 0 2.8L9.2 12l-3.6 3.6c-.8.8-.8 2 0 2.8.4.4.9.6 1.4.6s1-.2 1.4-.6l3.6-3.6 3.6 3.6c.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.8L14.8 12z"
            />
          </svg>
        </button>
        <span class="card-container__current-time">${currentTime}</span>
      </div>
      <div class="card-container__icon-container">
        <img src="/weather-app/${icon}.svg" alt=${icon} />
      </div>

      <div class="card-container__detail">
        <span class="card-container__detail__current-temp">${this.currentTemp}°C</span>
        <div>
          <span>${this.maxTemp}°C</span>
          <span>/</span>
          <span>${this.minTemp}°C</span>
        </div>
      </div>
      <div class="card-container__detail__wind-humidity">
        <div>
          <svg width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path
              fill="#57a0ee"
              d="M49 38a17.5 17.5 0 0 1-35 0C14 22.7 28.22 8.48 31.5 8.48S49 22.7 49 38Z"
            />
          </svg>
          <span>${this.humidity}%</span>
        </div>
        <div>
          <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <g fill="#57a0ee">
              <path
                d="M20 13H5a1 1 0 0 1 0-2h15a2 2 0 1 0-2-2 1 1 0 0 1-2 0 4 4 0 1 1 4 4Zm-3 12a4 4 0 0 1-4-4 1 1 0 0 1 2 0 2 2 0 1 0 2-2H5a1 1 0 0 1 0-2h12a4 4 0 0 1 0 8Z"
              />
              <path
                d="M25 21a3 3 0 0 1-3-3 1 1 0 0 1 2 0 1 1 0 0 0 2 0 2 2 0 0 0-2-2H5a1 1 0 0 1 0-2h19a4 4 0 0 1 4 4 3 3 0 0 1-3 3Z"
              />
            </g>
          </svg>
          <span>${this.windSpeed} km/h</span>
        </div>
      </div>
      <span class="card-container__description">${description}</span>
    </div>`
  }
}
customElements.define('weather-card', WeatherCard)
