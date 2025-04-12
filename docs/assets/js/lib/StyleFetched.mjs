/* eslint-disable @typescript-eslint/explicit-member-accessibility */

export class StyleFetched {
  constructor(styleUrl) {
    this.styleUrl = styleUrl;
  }

  install() {
    window
      .fetch(this.styleUrl)
      .then((r) => r.text())
      .then((styleContent) => {
        const styleEl = window.document.createElement("style");
        styleEl.textContent = styleContent;
        window.document.head.appendChild(styleEl);
        window.document.body.classList.remove("body-loading");
      });
  }
}
