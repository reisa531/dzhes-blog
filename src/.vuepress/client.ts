import { computeRoute, inject, pageview } from "@vercel/analytics";
import { onMounted, watch } from "vue";
import { defineClientConfig, useRoute } from "vuepress/client";

export default defineClientConfig({
  setup() {
    const route = useRoute();

    onMounted(() => {
      // 使用 VuePress 的路由实例，避免 Analytics Vue 组件依赖不同版本的 vue-router。
      inject({ disableAutoTrack: true });
      watch(
        route,
        () => {
          pageview({
            route: computeRoute(route.path, route.params),
            path: route.path,
          });
        },
        { immediate: true },
      );
    });
  },
});
