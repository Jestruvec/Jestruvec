export class ProjectCard extends HTMLElement {
  connectedCallback() {
    const titleI18nKey = this.getAttribute("title-i18n-key") || "";
    const descriptionI18nKey = this.getAttribute("description-i18n-key") || "";
    const imgI18nAltKey = this.getAttribute("img-i18n-alt-key") || "";
    const techI18nKey = this.getAttribute("technologies-i18n-key") || "";
    const imgUrl = this.getAttribute("img-url") || "";
    const imgAlt = this.getAttribute("img-alt") || "";
    const liveUrl = this.getAttribute("live-url") || "#";

    this.innerHTML = `
      <a
        href="${liveUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="block overflow-hidden rounded-lg transition bg-white h-full"
        aria-label="Proyecto"
      >
        <figure class="h-full">
          <img
            src="${imgUrl}"
            alt="${imgAlt}"
            data-i18n="${imgI18nAltKey}"
            class="w-full h-64 object-cover"
          />
          <figcaption class="p-4 bg-gray-50 h-full">
            <h3 class="text-lg font-semibold text-gray-800" data-i18n="${titleI18nKey}"></h3>
            <p class="text-sm text-gray-600 mt-2" data-i18n="${descriptionI18nKey}"></p>
            <p class="text-xs text-gray-500 mt-2" data-i18n="${techI18nKey}"></p>
          </figcaption>
        </figure>
      </a>
    `;
  }
}

customElements.define("project-card", ProjectCard);
