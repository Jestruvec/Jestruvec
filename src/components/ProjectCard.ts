export class ProjectCard extends HTMLElement {
  connectedCallback() {
    const titleI18nKey = this.getAttribute("title-i18n-key") || "";
    const descriptionI18nKey = this.getAttribute("description-i18n-key") || "";
    const imgI18nAltKey = this.getAttribute("img-i18n-alt-key") || "";
    const techI18nKey = this.getAttribute("technologies-i18n-key") || "";
    const imgUrl = this.getAttribute("img-url") || "";
    const imgAlt = this.getAttribute("img-alt") || "";
    const repoUrl = this.getAttribute("repo-url") || "#";
    const liveUrl = this.getAttribute("live-url") || "#";

    this.innerHTML = `
  <article class="flex flex-col gap-4">
    <header>
      <h3 class="text-xl font-semibold mb-4" data-i18n="${titleI18nKey}"></h3>
      <img
      src="${imgUrl}"
      alt="${imgAlt}"
      data-i18n="${imgI18nAltKey}"
      />
    </header>

    <p data-i18n="${descriptionI18nKey}"></p>

    <footer class="flex flex-col gap-4 mt-2">
      <span class="text-sm font-medium" data-i18n="${techI18nKey}"></span>
      
      <div class="flex items-center justify-center gap-2">
        <lord-icon trigger="hover" src="icons/code.json" colors="outline:#121331,primary:#ffffff" style="width:25px;height:25px"></lord-icon>

        <a
          href="${repoUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-gray-300 hover:underline"
        >
          ${repoUrl}
        </a>
      </div>

      <a
        href="${liveUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-gray-300 hover:underline"
      >
        ${liveUrl}
      </a>
    </footer>
  </article>
`;
  }
}

customElements.define("project-card", ProjectCard);
