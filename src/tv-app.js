// import stuff
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
    this.currentPage = null;
    this.contents = [];
    this.activeContent = "";
    this.pageId = "";
    this.onCourseClick = this.onCourseClick.bind(this);
  }
  connectedCallback() {
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
      currentPage: { type: Object },
      contents: { type: Array },
      activeContent: { type: String },
      pageId: { type: String },
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
        gap: 90px;
      }
      .sidebar {
        text-align: left;
        padding: 10px;
        margin-right: 1px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        width: 400px;
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
      button {
        font-size: 14px;
        line-height: 24px;
        padding-bottom: 6px;
        padding-left: 24px;
        padding-right: 24px;
        padding-top: 6px;
        background: #fff;
        color: #1a73e8;
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
          <course-topics title="${course.title}" id="${course.id}" activeIndex="${this.activeIndex}" @click="${() => this.onCourseClick(index)}"></course-topics>
        `,)}
        </div>

        <div class="page">
          ${this.activeContent ? unsafeHTML(this.activeContent) : html``}
        </div>

        <div class="buttonContainer">
          <button @click=${() => this.backPage()}>Back</button>
          <button @click=${() => this.nextPage()}>Next</button>
        </div>
        
      </div>
    `;
  }

  async onCourseClick(index) {
    this.activeIndex = index; 
    const item = this.listings[index].location; 
    const contentPath = "/assets/" + item;
    const response = await fetch(contentPath);
    this.activeContent = await response.text();
   
  }

  async backPage() {
    if (this.activeIndex !== null) {
      const prevIndex = this.activeIndex - 1;
      const course = this.listings[prevIndex].location;
      const contentPath = "/assets/" + course;
      const response = await fetch(contentPath);
      this.activeContent = await response.text();
      this.activeIndex = prevIndex; 
    }
  }

  async nextPage() {
    if (this.activeIndex !== null) {
      const nextIndex = this.activeIndex + 1;
      const course = this.listings[nextIndex].location;
      const contentPath = "/assets/" + course;
      const response = await fetch(contentPath);
      this.activeContent = await response.text();
      this.activeIndex = nextIndex; 
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
