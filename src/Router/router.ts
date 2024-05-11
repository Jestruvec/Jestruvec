import { createMemoryHistory, createRouter } from "vue-router";

import { HomeView, AboutView, ContactView, ProjectsView } from "./Views";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/contact", component: ContactView },
  { path: "/projects", component: ProjectsView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
