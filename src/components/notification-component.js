import { LitElement, html, css } from 'lit'

export class NotificationComponent extends LitElement {
  static get properties() {
    return {
      isExistsCountry: { type: Boolean, attribute: true }
    }
  }
  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ]

  render() {
    return html`
      <div>${this.isExistsCountry ? html` <span>the location already exists</span> ` : ''}</div>
    `
  }
}
customElements.define('notification-component', NotificationComponent)
