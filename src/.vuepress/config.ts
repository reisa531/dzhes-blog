import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  // 预构建 mermaid，否则 dev 下其 dayjs 依赖会以 CJS 原样加载而报错
  bundler: viteBundler({
    viteOptions: {
      optimizeDeps: {
        include: ["mermaid"],
      },
    },
  }),

  lang: "zh-CN",
  title: "dzhes's Blog",
  description: "dzhes 的个人博客：技术笔记与生活记录。",

  theme,

  // PWA 插件接管资源缓存，关闭预获取避免重复请求
  shouldPrefetch: false,
});
