import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./course-topics.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.source = new URL('../assets/training-data.json', import.meta.url).href;
    this.listings = [];
    this.activeIndex = 0;
    this.activeContent = "";
  }
  async connectedCallback() {
    super.connectedCallback();
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
      activeContent: { type: String },
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
      .wrapper {
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }
      .sidebar {
        text-align: left;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        width: 360px;
        position: relative;
      }
      .page {
        font-size: 1.1em;
        border: 1px solid black;
        width: 100%;
        margin-bottom: 10px;
        position: relative;
      }
      .buttonContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 19px;
        width: 81vw;
      }
      sl-button.back {
        color: #1a73e8;
        border-radius: 4px;
        box-shadow: 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2);
      }
      sl-button.next {
        background-color: #1a73e8;
        color: white;
        border-radius: 4px;
        box-shadow: 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2);
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">

        <div class="sidebar">
        ${this.listings.map((course, index) => html`
          <course-topics title="${course.title}" id="${course.id}" activeIndex="${this.activeIndex}" @click="${() => this.chooseCourse(index)}"></course-topics>
        `,)}
        </div>

        <div class="page">
          ${this.activeContent ? unsafeHTML(this.activeContent) : html``}
        </div>

        <div class="buttonContainer">
          <sl-button class="back" ?disabled="${this.activeIndex <= 0}" @click=${() => this.backPage()}>Back</sl-button>
          <sl-button class="next" ?disabled="${this.activeIndex >= this.listings.length - 1}" @click=${() => this.nextPage()}>Next</sl-button>
        </div>
        
      </div>
    `;
  }

  async chooseCourse(index) {
    this.activeIndex = index; 
    var contentPath = "/assets/" + this.listings[index].location;
    var response = await fetch(contentPath);
    this.activeContent = await response.text();
    this.requestUpdate();
  }

  async backPage() {
    if (this.activeIndex !== null && this.activeIndex > 0) {
      this.chooseCourse(this.activeIndex - 1);
    }
  }

  async nextPage() {
    if (this.activeIndex !== null && this.activeIndex < this.listings.length - 1) {
      this.chooseCourse(this.activeIndex + 1); 
    }
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
