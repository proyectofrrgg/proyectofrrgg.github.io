class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2022
        Granados García Rodolfo Ramón IC43M.
      </p>`;
  }
}

customElements.define(
  "mi-footer", MiFooter);
