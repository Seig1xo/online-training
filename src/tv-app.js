import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@lrnwebcomponents/code-sample/code-sample.js'
import '@lrnwebcomponents/video-player/video-player.js';
import "./course-topics.js";
import "./time-remaining.js";

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
    await this.loadContent();
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
      .timer {
        position: fixed;
        top: 8px;
        right: 32px;
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
        width: auto;
        position: relative
      }
      .page {
        padding: 8px;
        font-size: 1.1em;
        border: 1px solid black;
        width: 78%;
        margin-bottom: 8px;
        position: relative;
      }
      .buttonContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 16px;
        width: 82%;
      }
      sl-button {
        border-radius: 4px;
        box-shadow: 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2);
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="timer">
        <time-remaining time="${this.time}"></time-remaining>
      </div>

      <div class="wrapper">
        <div class="sidebar">
        ${this.listings.map((course, index) => html`
          <course-topics title="${course.title}" id="${course.id}" activeIndex="${this.activeIndex}" @click="${() => this.chooseCourse(index)}"></course-topics>
        `,)}
        </div>

        <div class="page" .innerHTML="${this.activeContent}"></div>

        <div class="buttonContainer">
          <sl-button class="back" ?disabled="${this.activeIndex <= 0}" @click=${() => this.backPage()}>Back</sl-button>
          <sl-button variant="primary" class="next" ?disabled="${this.activeIndex >= this.listings.length - 1}" @click=${() => this.nextPage()}>Next</sl-button>
        </div>
      </div>
    `;
  }

  async chooseCourse(index) {
    this.activeIndex = index; 
    const contentPath = "/assets/" + this.listings[index].location;
    const response = await fetch(contentPath);
    this.activeContent = await response.text();
    this.time = this.listings[this.activeIndex].metadata.readtime;
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

  async loadContent() {
    try {
      const response = await fetch(this.source);
      if (!response.ok) {
        throw new Error('Network could not respond.');
      }
      const json = await response.json();
      if (json.status === 200 && json.data.items) {
        this.listings = json.data.items;
        this.chooseCourse(0); 
      }
    } catch (error) {
      console.error('Could not load content:', error);
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
