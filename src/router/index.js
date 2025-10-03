import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../views/LandingPage.vue";
import FilmoviPage from "../views/FilmoviPage.vue";

const routes = [
  { path: "/", name: "Landing", component: LandingPage },
  { path: "/filmovi", name: "Filmovi", component: FilmoviPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
