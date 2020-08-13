import { LitElement, html, css, svg } from 'lit-element';
import moment from 'moment/min/moment-with-locales';

class ImageViewerCard extends LitElement {
  config: any;
  hass: any;
  shadowRoot: any;
  loopCount: number = 0;

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
    var stateObj = this.hass.states[entity];
    var dateFormat = "dateFormat" in this.config ? this.config.dateFormat : "DD MMMM YYYY hh:mm";

    if(!("file_list" in stateObj.attributes)) {
      throw new Error("You need to define an entity");
    }

    let images: any[] = [];
    for(let file_path of stateObj.attributes.file_list) {
      var lastIndex = file_path.lastIndexOf('-');
      var lastIndexExtension = file_path.lastIndexOf('.');
      var timestamp = file_path.substring(lastIndex+1, lastIndexExtension);

      if(this.config.path && "replace" in this.config.path) {
        var replaceWith = "replaceWith" in this.config.path ? this.config.path.replaceWith : "";
        file_path = file_path.replace(this.config.path.replace, replaceWith);
      }

      images.push({
        path: file_path,
        timestamp: timestamp,
        date: moment(timestamp * 1000).format(dateFormat)
      });

    }
    images = images.sort(function(a, b){return b['timestamp'] - a['timestamp']});
    this.loopCount = 0;
   
    return html`
      <div class="container">
        <div class="sidebar">
          <ul>
            ${images.map((image) => {
              this.loopCount++;
              return html`<li class="${this.loopCount == 1 ? 'active' : ''}" @click="${e => this._click(e)}" data-path="${image.path}" data-date="${image.date}"><div class="tile"><img src="${image.path}" /><p class="date">${image.date}</p></div></li>`
            })}
          </ul>
        </div>
        <div class="main">
            <img class="mainImage" src="" />
            <p class="mainDate"></p>
        </div>
      </div>
      
    `;
    
  }

  firstUpdated() {
    var url = new URL(location.href);;
    var displayImage = url.searchParams.get("display_image");
    if(displayImage) {
      var elementWithImage = this.shadowRoot.querySelector('[data-path*="'+displayImage+'"]');
      console.log(elementWithImage);
      if(elementWithImage) {
        this._show(elementWithImage, elementWithImage.dataset.path,elementWithImage.dataset.date);
      }
    } else {
      var li = this.shadowRoot.querySelector('.sidebar ul li:first-child');
      this._show(li, li.dataset.path,li.dataset.date);
    }
  }

  updated() { }

  _click(e) {
    if(e.target.dataset && e.target.dataset.path && e.target.dataset.date) {
      this._show(e.target, e.target.dataset.path, e.target.dataset.date);
    }
    
  }

  _show(element, path, date) {
    var li = this.shadowRoot.querySelectorAll('li');
    for (var i = 0; i < li.length; i++) {
      li[i].classList.remove('active');
    }
    element.classList.add('active');
    this.shadowRoot.querySelector('.mainImage').src = path;
    this.shadowRoot.querySelector('.mainDate').textContent = date;
  }

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
        height: calc(100vh - 48px);
        width:100%;
        overflow:hidden;
      }
      .container {
        display: flex;
        height: 100%;
        width:100%;
        overflow:hidden;
        flex-direction:row;
      }
      .sidebar {
        width:30%;
        height:100%;
        overflow-y:scroll;
        box-sizing: border-box;
      }
      .sidebar ul {
        padding:0;
        margin:0;
        list-style: none;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
      }
      .sidebar ul li {
        display: flex;
        flex: 0 50%;
        padding: 10px;
        box-sizing: border-box;
      }
      .sidebar ul li * {
        pointer-events: none;
      }
      .sidebar ul li .tile {
        padding:10px;
        background:#6a6c6f;
        border-radius:4px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px 0px;
      }
      .sidebar ul li.active .tile {
        background:#FFF;
      }
      .sidebar ul li .tile img {
        max-width: 100%;
        opacity:0.4;
      }
      .sidebar ul li.active .tile img {
        opacity:1;
      }
      .sidebar ul li .tile .date {
        margin:5px 0 0 0;
        color: rgba(0, 0, 0, 0.4);
        font-size: 9px;
        font-weight: 500;
      }
      .sidebar ul li.active .tile .date {
        color: #000;
      }
      .main {
        width:70%;
        height:100%;
        box-sizing: border-box;
        padding:15px;
      }
      .mainImage {
         max-width:100%;
      }
      .mainDate {
        margin:5px 0 0 0;
        color: #FFF;
      }
      
    `;
  }
}

customElements.define('image-viewer-card', ImageViewerCard);