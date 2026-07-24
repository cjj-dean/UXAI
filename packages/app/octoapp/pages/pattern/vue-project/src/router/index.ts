import { createRouter, createWebHistory } from "vue-router";
import PreviewPage from "../views/PreviewPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Preview",
      component: PreviewPage,
    },
    {
      path: "/intent-test",
      name: "IntentTest",
      component: () => import("../views/IntentTestPage.vue"),
    },
    {
      path: "/explorer",
      name: "Explorer",
      component: () => import("../views/ExplorerPage.vue"),
    },
    {
      path: "/custom",
      name: "Custom",
      component: () => import("../views/CustomPage.vue"),
    },
  ],
});

export default router;