import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
    {
      text: "朋友们",
      icon: "user-group",
      link: "/friends.html",
    },
    {
      text: "失落媒体",
      icon: "ghost",
      link: "/lost-media.html",
    },
    {
      text: "时间轴",
      icon: "clock",
      link: "/timeline/",
    },
    "intro",
  ],
});
