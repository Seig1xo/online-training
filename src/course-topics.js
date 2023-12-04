// import stuff
import { LitElement, html, css } from 'lit';

export class CourseTopics extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.id = '';
    this.activeIndex = 0;
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'course-topics';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      id: { type: String },
      activeIndex: { type: Number },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .wrapper {
        display: flex;
        padding: 16px;
        background-color: #eeeeee;
        min-height: 52px;
        font-weight: bold;
        line-height: 20px;
        box-sizing: content-box;
        position: relative;
        border: 1px solid gray;
        border-radius: 5px;
        margin: 4px 17px;
      }
      .wrapper:active {
        background-color: cyan;
      }
      .course {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        margin-left: 10px;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;
        color: white;
        height: 25px;
        width: 25px;
        background-color: darkgray;
        border-radius: 50%;
      }
      .title {
        font-size: 14px;
        align-items: center;
        margin: auto -2px;
        font-weight: normal;
      }
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has("activeIndex") && this.activeIndex !== null) {
      const course = this.shadowRoot.querySelector(".course");
      const id = this.shadowRoot.querySelector("#title");

      if (parseInt(this.id) - 1 === this.activeIndex) {
        id.style.fontWeight = "bold";
      } else {
        id.style.fontWeight = "normal";
      }

      if (parseInt(this.id) - 1 <= this.activeIndex) {
        course.style.backgroundColor = "cyan";
        id.style.color = "black";
      } else {
        course.style.backgroundColor = "darkgray";
        id.style.color = "";
      }
    }
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
        <span class="course">${this.id}</span>
        <span class="title">${this.title}</span>
        <slot></slot>
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(CourseTopics.tag, CourseTopics);
