export class ProjectCard extends HTMLElement {
  connectedCallback() {
    const titleI18nKey = this.getAttribute("title-i18n-key") || "";
    const descriptionI18nKey = this.getAttribute("description-i18n-key") || "";
    const imgI18nAltKey = this.getAttribute("img-i18n-alt-key") || "";
    const techI18nKey = this.getAttribute("technologies-i18n-key") || "";
    const imgUrl = this.getAttribute("img-url") || "";
    const imgAlt = this.getAttribute("img-alt") || "";
    const repoUrl = this.getAttribute("repo-url") || "";
    const liveUrl = this.getAttribute("live-url") || "";

    this.innerHTML = `
  <article class="h-full flex flex-col gap-4">
    <header>
      <h1 class="text-xl font-semibold mb-4" data-i18n="${titleI18nKey}"></h1>
      <img
      src="${imgUrl}"
      alt="${imgAlt}"
      data-i18n="${imgI18nAltKey}"
      class="w-full max-w-xl"
      />
    </header>

    <section class="flex flex-col flex-grow justify-between gap-4">
      <p data-i18n="${descriptionI18nKey}"></p>
      <p class="text-sm font-medium" data-i18n="${techI18nKey}"></p>
    </section>

    <section class="flex flex-col">
      <a
        href="${repoUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="cursor-pointer hover:bg-[rgba(0,0,0,0.05)] focus:outline-none focus:ring rounded-lg py-1 px-2 ${
          !repoUrl && "hidden"
        }"
      >
        ${repoUrl}
      </a>
      <a
        href="${liveUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="cursor-pointer hover:bg-[rgba(0,0,0,0.05)] focus:outline-none focus:ring rounded-lg py-1 px-2"
      >
        ${liveUrl}
      </a>
    </section>
  </article>
`;
  }
}

customElements.define("project-card", ProjectCard);
