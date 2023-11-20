// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.source = new URL('../assets/training-data.json', import.meta.url).href;
    this.listings = Array(3).fill('');
    this.activeIndex = 0;
    this.currentPage = null;
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      source: { type: String },
      listings: { type: Array },
      activeIndex: { type: Number },
      currentPage: { type: Object },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .container {
        display: flex;
        justify-content: space-between;
      }
      .sidebar {
        text-align: left;
        padding: 10px;
        margin-right: 1px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: auto;
        margin-bottom: 10px;
        border: 1px solid black;
      }
      .page {
        font-size: 1.3em;
        border: 1px solid black;
        width: 100%;
        margin-bottom: 10px;
        position: relative;
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
        <div class="sidebar"></div>
        <div class="page"></div>
        <button>Back</button>
        <button>Next</button>
      </div>
    `;
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
