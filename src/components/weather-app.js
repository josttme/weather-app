import { LitElement, html, css } from 'lit'
import { removeItemStorage } from '../utils/index'

import './search-component'
import './weather-card'
import {
  getWeather,
  ListOfSelectedCountriesSaveToStorage,
  selectedCountriesList
} from '../utils/index'
import {
  dragAndDrop,
  trueDragable,
  falseDragable,
  touchStart,
  isMobile
} from '../utils/dragAndDrop'

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
        overflow: hidden;
      }
      .weather-cards-container {
        position: relative;
        width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
      }
      .button-container {
        width: 100%;
        display: grid;
        place-content: center;
      }
      button {
        font-family: 'Nunito';
        margin: 2rem 0 0.5rem;
        width: 100px;
        height: 40px;
        border-radius: 8px;
        border: none;
        font-size: 1.1rem;
        background: #085ec3;
        color: rgba(255, 255, 255, 0.8);
        font-weight: bold;
      }
      .dragging {
        position: relative;
        z-index: 100;
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
  async firstUpdated() {
    this.selectedCountries = []
    await this.getSelecetedCountries()
    await dragAndDrop(this.weatherCardsContainer)
  }

  async selectedCountriesFromApi(e) {
    let selectedCountry = e.detail.selectedCountries
    let selectedCountries = await getWeather(selectedCountry)

    this.selectedCountries = [...this.selectedCountries, selectedCountries]
    ListOfSelectedCountriesSaveToStorage(selectedCountry)
  }

  async getSelecetedCountries() {
    const getSelectedCountriesArray = selectedCountriesList()
    let promises = getSelectedCountriesArray.map(async (country) => {
      let countriesStorages = await getWeather(country)
      return { ...country, ...countriesStorages }
    })
    let results = await Promise.all(promises)
    this.selectedCountries = results
  }
  get weatherCardsContainer() {
    return this.renderRoot?.querySelector('.weather-cards-container') ?? null
  }

  removeCard(e) {
    let id = e.detail
    const shadow = this.renderRoot
    const cardContainer = shadow?.querySelector(`#${id}`) ?? null
    if (isMobile()) {
      this.weatherCardsContainer.removeChild(cardContainer.parentElement)
    } else {
      this.weatherCardsContainer.removeChild(cardContainer)
    }
    removeItemStorage(id)
  }

  // uso de la función para imprimir un mensaje diferente según el tipo de dispositivo

  trueDragable() {
    trueDragable(this.weatherCardsContainer)
  }
  falseDragable() {
    falseDragable(this.weatherCardsContainer)
  }
  touchStart(e) {
    const dragging = e.target
    touchStart(dragging, this.weatherCardsContainer)
  }
  refresh() {
    this.firstUpdated()
  }

  render() {
    let weatherCard = this.selectedCountries.map((country) => {
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
          sunrise=${country.sunrise}
          sunset=${country.sunset}
          @removeCard=${this.removeCard}
          @trueDragable=${this.trueDragable}
          @falseDragable=${this.falseDragable}
          @touchStart=${this.touchStart}
        ></weather-card>
      `
    })
    return html`
      <main>
        <search-component @cities=${this.selectedCountriesFromApi}></search-component>
        <div class="button-container">
          <button type="button" @click=${this.refresh}>Refresh</button>
        </div>
        <div class="weather-cards-container">
          ${isMobile()
            ? weatherCard.map((card) => html`<div class="drag-container">${card}</div>`)
            : weatherCard}
        </div>
      </main>
    `
  }
  countChildComponents() {
    const childs = this.weatherCardsContainer.childNodes
    const elementChilds = [...childs]
    console.log(elementChilds.filter((node) => node.nodeType === 1))
  }
}
customElements.define('weather-app', WeatherApp)
