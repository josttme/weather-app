import { LitElement, html, css } from 'lit'
import { selectedCountriesList } from '../utils/index'
import './search-input'
import './notification-component'
import './list-countries-search'

export class SearchComponent extends LitElement {
  static get properties() {
    return {
      citiesResult: { type: Object },
      selectedCountries: { type: Array },
      existsCountry: { type: Boolean },
      isFocused: { type: Boolean }
    }
  }
  constructor() {
    super()
    this.isFocused = true
    this.citiesResult = {}
    this.selectedCountries = {}
    this.existsCountry = false
  }
  static styles = [
    css`
      :host {
        display: block;
      }
      div {
        position: relative;
      }
      ul {
        position: absolute;
        width: 90%;
        max-width: 500px;
        padding: 0;
        left: 50%;
        transform: translateX(-50%);
        margin: 0 auto;
        list-style: none;
        border-radius: 8px;
        overflow: hidden;
        background-color: rgb(6, 69, 156);
        z-index: 100;
      }
      .hidden {
        display: none;
      }
      .show {
        display: initial;
        z-index: 110;
      }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vh;
        height: 100vh;
        z-index: 100;
      }
    `
  ]
  addWeatherCard(e) {
    let citiesResult = e.detail.cities
    if (!citiesResult) return
    this.citiesResult = citiesResult
    //console.log(this.citiesResult)
    this.isFocused = true
  }
  countrySelected(latitude, longitude, city, country) {
    let selectedCountries = {}
    let id = city + country
    id = id.replace(/ /g, '')
    let getCountry = selectedCountriesList()
    const getCountryArray = Object.values(getCountry)
    let existsCountry = getCountryArray.some((e) => e.id === id)
    if (existsCountry) {
      this.existsCountry = true
    } else {
      selectedCountries.country = country
      selectedCountries.city = city
      selectedCountries.latitude = latitude
      selectedCountries.longitude = longitude
      selectedCountries.id = id
      //get Data current weather
      let detail = { selectedCountries }
      let options = {
        detail: detail,
        bubble: true,
        composed: true
      }
      this.dispatchEvent(new CustomEvent('cities', options))
    }
    this.isFocused = true
  }
  onInput() {
    this.isFocused = false
  }
  hiddenListCountries() {
    this.isFocused = true
  }
  render() {
    return html`
      <div>
        <search-input
          @search=${this.addWeatherCard}
          @onInput=${this.onInput}
          @onBlur=${this.onBlur}
        ></search-input>
        <div
          @click=${this.hiddenListCountries}
          class=${this.isFocused ? 'hidden' : 'overlay'}
        ></div>
        <ul class=${this.isFocused ? 'hidden' : 'show'}>
          ${Object.keys(this.citiesResult).length > 2
            ? this.citiesResult.map((city) => {
                return html` <list-countries-search
                  name=${city.name}
                  place=${city.admin1}
                  latitude=${city.latitude}
                  longitude=${city.longitude}
                  countryCode=${city.country_code}
                  @click=${() =>
                    this.countrySelected(
                      city.latitude,
                      city.longitude,
                      city.name,
                      city.country
                    )}
                ></list-countries-search>`
              })
            : ' '}
        </ul>
      </div>
    `
  }
}
customElements.define('search-component', SearchComponent)
