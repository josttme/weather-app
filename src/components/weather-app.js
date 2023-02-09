import { LitElement, html, css } from 'lit'
import { removeItemStorage } from '../utils/index'

import './search-component'
import './weather-card'
import {
  getWeather,
  ListOfSelectedCountriesSaveToStorage,
  selectedCountriesList
} from '../utils/index'

export class WeatherApp extends LitElement {
  static get properties() {
    return {
      selectedCountries: { type: Array }
    }
  }
  static styles = [
    css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :host {
        display: block;
      }
      .weather-cards-container {
        width: 100%;
        margin: 0 auto;
        margin-top: 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
      }
      @media (min-width: 358px) {
        .weather-cards-container {
          gap: 1rem;
          padding: 1rem;
        }
      }
      @media (min-width: 1200px) {
        .weather-cards-container {
          max-width: 1200px;
        }
      }
    `
  ]
  constructor() {
    super()
    this.selectedCountries = []
  }
  firstUpdated() {
    this.getSelecetedCountries()
  }
  async selectedCountriesFromApi(e) {
    let selectedCountry = e.detail.selectedCountries
    let selectedCountries = await getWeather(selectedCountry)

    this.selectedCountries = [...this.selectedCountries, selectedCountries]
    ListOfSelectedCountriesSaveToStorage(selectedCountry)
  }

  async getSelecetedCountries() {
    const getSelectedCountriesArray = Object.values(selectedCountriesList())
    getSelectedCountriesArray.forEach(async (country) => {
      let countriesStorages = await getWeather(country)
      this.selectedCountries = [...this.selectedCountries, countriesStorages]
    })
  }
  removeCard(e) {
    let id = e.detail
    const shadow = this.renderRoot
    const weatherCardsContainer = shadow?.querySelector('.weather-cards-container') ?? null
    const cardContainer = shadow?.querySelector(`#${id}`) ?? null
    weatherCardsContainer.removeChild(cardContainer)
    removeItemStorage(id)
  }
  render() {
    return html`
      <main>
        <search-component @cities=${this.selectedCountriesFromApi}></search-component>
        <div class="weather-cards-container">
          ${this.selectedCountries.map((country) => {
            return html`
              <weather-card
                id=${country.id}
                city=${country.city}
                country=${country.country}
                currentTime=${country.currentTime}
                currentTemp=${country.currentTemp}
                maxTemp=${country.maxTemp}
                minTemp=${country.minTemp}
                iconCode=${country.iconCode}
                precip=${country.precip}
                windSpeed=${country.windSpeed}
                humidity=${country.humidity}
                timeZone=${country.timezone}
                @removeCard=${this.removeCard}
              ></weather-card>
            `
          })}
        </div>
      </main>
    `
  }
}
customElements.define('weather-app', WeatherApp)
