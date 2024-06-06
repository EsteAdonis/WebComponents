class Tooltip extends HTMLElement {
  constructor() {
    super();
    console.log('Greetings Julio Esteban');
  }
}

customElements.define('uc-tooltip', Tooltip);