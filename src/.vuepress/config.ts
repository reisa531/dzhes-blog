import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "dzhes's Blog",
  description: "dzhes 的个人博客：技术笔记与生活记录。",

  theme,

  // PWA 插件接管资源缓存，关闭预获取避免重复请求
  shouldPrefetch: false,
});
