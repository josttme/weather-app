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
      existsCountry: { type: Boolean }
    }
  }
  constructor() {
    super()
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
        z-index: 20;
      }
    `
  ]
  addWeatherCard(e) {
    let citiesResult = e.detail.cities
    if (citiesResult === undefined) {
      this.citiesResult = {}
    }
    if (!citiesResult) return
    this.citiesResult = citiesResult
    //console.log(this.citiesResult)
  }
  countrySelected(latitude, longitude, city, country) {
    let selectedCountries = {}
    let id = city + country
    id = id.replace(/ /g, '')
    let getCountry = selectedCountriesList()
    const getCountryArray = Object.values(getCountry)
    let existsCountry = getCountryArray.some((e) => e.id === id)
    if (existsCountry) {
      this.citiesResult = {}
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
      this.citiesResult = {}
    }
  }
  render() {
    return html`
      <div>
        <search-input @search=${this.addWeatherCard}></search-input>
        <ul>
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
