class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipIcon;
    this._tooltipVisible = false;
    this._tooltipText = 'Some dummy tooltip text.';
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        div {
          background-color: black;
          color: white;
          position: absolute;
          top: 2rem;
          left: 0.75rem;
          z-index: 10;
          padding: 0.15rem;
          border-radius: 3px;
          box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26);
        }

        .highlight {
          background-color: red;
        }

        ::slotted(.highlight) {
          border-bottom: 1px dotted red;
        }

        .icon {
          background-color: gray;
          color: white;
          padding: 0.25rem 0.5rem;
          text-align: center;
          border-radius: 50%
        }

        :host(.important) {
          background-color: var(--color-primary, #ccc);
        }

        :host-context() {
        
        }
      </style>
      <slot>Some Default</slot>
      <span class="icon"> (????)</span>`;
  }

  connectedCallback() { 
    if (this.hasAttribute('text')) {
      this._tooltipText = this.getAttribute('text');    
    }
    const tooltipIcon = this.shadowRoot.querySelector('span');
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    this.style.position = 'relative';
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'text') {
      this._tooltipText = newValue;;
    }
  }

  static get observedAttributes() {
    return ['text']
  }

  disconnectedCallback() {
    this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
    this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);    
  }

  _render() {
    let tooltipContainer = this.shadowRoot.querySelector('div');
    if (this._tooltipVisible) {
      tooltipContainer = document.createElement('div');
      tooltipContainer.textContent = this._tooltipText;  
      this.shadowRoot.appendChild(tooltipContainer);      
    } else {
      if (tooltipContainer) {
        this.shadowRoot.removeChild(tooltipContainer);
      }        
    }
  }

  _showTooltip() { 
    this._tooltipVisible = true;
    this._render();
  }

  _hideTooltip() {
    this._tooltipVisible = false;
    this._render();    
   }

}

customElements.define('uc-tooltip', Tooltip);