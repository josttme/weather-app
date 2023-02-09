import { LitElement, html, css } from 'lit'

export class ListCountriesSearch extends LitElement {
  static get properties() {
    return {
      place: { Type: String, attibute: true },
      name: { Type: String, attibute: true },
      countryCode: { Type: String, attibute: true },
      latitude: { Type: Number, attibute: true },
      longitude: { Type: Number, attibute: true }
    }
  }

  static styles = [
    css`
      * {
        box-sizing: border-box;
      }
      :host {
        display: block;
      }
      li {
        width: 100%;
        background-color: rgb(6, 69, 156);
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.2rem;
        padding: 10px 0;
      }
      a {
        display: grid;
        grid-template-columns: 15% 1fr 45%;
        align-items: center;
        padding-left: 10px;
      }
      small {
        font-size: 1rem;
        justify-self: start;
        color: rgba(255, 255, 255, 0.6);
      }

      img {
        justify-items: center;
        display: inline-block;
        height: 30px;
        width: 40px;
        border-radius: 8px;
      }
    `
  ]

  render() {
    this.countryCode = this.countryCode.toLowerCase()
    return html`
      <li>
        <a>
          <img src="https://flagcdn.com/${this.countryCode}.svg" />
          ${this.name}
          <small>${this.place}</small>
        </a>
      </li>
    `
  }
}
customElements.define('list-countries-search', ListCountriesSearch)
