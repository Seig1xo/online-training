import { LitElement, html, css } from "lit";

export class TimeRemaining extends LitElement {
    constructor() {
        super();
        this.time = "";
    }

    static get tag() {
        return "time-remaining";
    }

    static get properties() {
        return {
            time: { type: String },
        };
    }

    static get styles() {
        return css`
          :host {
            display: inline-block;
          }
          .timer {
            font-family: Roboto, Noto, sans-serif;
            font-size: 16px;
            font-weight: 400;
            text-decoration: none;
          }
        `;
    }

    render() {
        return html`
            <div class="timer">${this.time} minutes remaining</div>
        `;
    }
}

customElements.define(TimeRemaining.tag, TimeRemaining);