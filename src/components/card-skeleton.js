import { LitElement, html, css } from 'lit'

export class CardSkeleton extends LitElement {
  static styles = [
    css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :host {
        width: 100%;
        min-width: 200px;
        min-height: 250px;
        max-width: 500px;
        max-height: 270px;
        justify-items: center;
        height: 100%;
        display: block;
        box-sizing: border-box;
        box-sizing: border-box;
        box-sizing: border-box;
        border-radius: 8px;
        background: rgb(0, 6, 31);
        background: linear-gradient(
          137deg,
          rgba(0, 6, 31, 1) 0%,
          rgba(0, 20, 96, 1) 50%,
          rgba(0, 27, 122, 1) 100%
        );
      }
      .skeleton-content {
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 55%;
        padding: 1rem;
        place-items: center;
      }
      .location,
      .weather-icon,
      .date,
      .temp,
      .maxmin-temp,
      .humdwind,
      .description {
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.6);
      }
      .location,
      .date,
      .maxmin-temp,
      .humdwind,
      .description {
        height: 1rem;
      }
      .location,
      .maxmin-temp,
      .date,
      .temp,
      .humdwind,
      .description {
        margin-bottom: 0.2rem;
      }

      .location {
        width: 15rem;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.6);
        grid-column: span 2 / span 2;
        justify-self: start;
      }
      .weather-icon {
        grid-row: 2 / 6;
        width: 5rem;
        height: 5rem;
        border-radius: 20%;
      }
      .date {
        width: 11rem;
      }
      .temp {
        width: 8rem;
        height: 3.5rem;
      }
      .maxmin-temp {
        width: 6rem;
      }
      .humdwind {
        grid-column: span 1 / -1;
        width: 10rem;
      }
      .description {
        width: 8rem;
        justify-self: start;
      }

      .skeleton {
        background: linear-gradient(
          70deg,
          rgba(255, 255, 255, 0.5) 15%,
          rgba(255, 255, 255, 0.4) 60%,
          rgba(255, 255, 255, 0.5) 90%
        );
        background-size: 500%;
        animation: skeleton-fade 1s infinite;
      }

      @keyframes skeleton-fade {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }
    `
  ]

  render() {
    return html`
      <div class="skeleton-content">
        <div class="skeleton location"></div>
        <div class="skeleton weather-icon"></div>
        <div class="skeleton date"></div>
        <div class="skeleton temp"></div>
        <div class="skeleton maxmin-temp"></div>
        <div class="skeleton humdwind"></div>
        <div class="skeleton description"></div>
      </div>
    `
  }
}
customElements.define('card-skeleton', CardSkeleton)
