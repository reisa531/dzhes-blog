import { Analytics } from "@vercel/analytics/vue";
import { defineClientConfig } from "vuepress/client";

export default defineClientConfig({
  // Vercel Web Analytics
  // 挂到应用根节点（组件本身 render 返回 null）。它内部用 vue-router 的 route 变化来上报
  // pageview，所以 SPA 内的跳转也会被统计，比只放一个 <script> 标签更准。
  rootComponents: [Analytics],
});
