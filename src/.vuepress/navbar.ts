import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { text: "技术", icon: "code", link: "/category/技术/" },
  { text: "随笔", icon: "feather-pointed", link: "/category/随笔/" },
  { text: "朋友们", icon: "user-group", link: "/friends.html" },
  { text: "时间轴", icon: "clock", link: "/timeline/" },
  { text: "DN42", icon: "fluent-mdl2:internet-sharing", link: "/dn42.html" },
  { text: "失落媒体", icon: "ghost", link: "/lost-media.html" },
  { text: "关于", icon: "circle-info", link: "/intro.html" },
]);
