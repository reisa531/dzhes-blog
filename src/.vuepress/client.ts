import { inject, pageview } from "@vercel/analytics";
import { defineClientConfig } from "vuepress/client";

export default defineClientConfig({
  enhance({ router }) {
    if (typeof window === "undefined") return;

    // 不能用 @vercel/analytics/vue：它要求 vue-router v4，而 VuePress 用的是 v5，
    // Vercel 全新安装时解析不到依赖会构建失败。这里直接注入脚本，跟随 VuePress 路由上报。
    inject({ framework: "vue", disableAutoTrack: true });
    router.afterEach((to) => {
      pageview({ path: to.path, route: to.path });
    });
  },
});
