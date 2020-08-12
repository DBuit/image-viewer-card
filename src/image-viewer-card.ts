import { LitElement, html, css, svg } from 'lit-element';

class ImageViewerCard extends LitElement {
  config: any;
  hass: any;
  shadowRoot: any;

  static get properties() {
    return {
      hass: {},
      config: {},
      active: {}
    };
  }
  
  constructor() {
    super();
  }
  
  render() {
    var entity = this.config.entity;
   
    return html`
      <h1>Image viewer</h1>
    `;
    
  }
  
  updated() { }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
  
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
    `;
  }
}

customElements.define('image-viewer-card', ImageViewerCard);