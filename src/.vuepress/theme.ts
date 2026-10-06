import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://www.dzhes.xyz",

  author: {
    name: "dzhes",
    url: "https://www.dzhes.xyz",
  },

  logo: "/logo.svg",

  repo: "reisa531/dzhes-blog",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "这里鲜有人迹。",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "记录技术，也记录生活。",
    intro: "/intro.html",
    // 社交链接：只保留有真实地址的条目，未填写的保持注释，避免出现死链。
    medias: {
      BiliBili: "https://space.bilibili.com/145337143",
      Email: "mailto:jiangdzh2026@shanghaitech.edu.cn",
      GitHub: "https://github.com/reisa531",
      Lark: "https://www.feishu.cn/invitation/page/add_contact/?token=ebbiee15-7bb3-4385-b515-3e607752318a",
      QQ: "https://wpa.qq.com/msgrd?v=3&uin=3420129704&site=qq&menu=yes",
      Steam: "https://steamcommunity.com/profiles/1176562230",
      Twitter: "https://x.com/dzhesNYA",
      Zhihu: "https://www.zhihu.com/people/jiang-shang-yu-zhe-62-50",

      // 微信二维码：把图片放到 src/.vuepress/public/ 后取消注释
      // Wechat: "/wechat.png",
    },
  },

  // 加密配置（演示页已删除，如需加密文章按同样格式追加）
  // encrypt: {
  //   config: {},
  // },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        // oxlint-disable-next-line typescript/consistent-return
        replacer: ({ tag }) => {
          if (tag === "em") {
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
          }
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,

    // 取消注释它们如果你需要 TeX 支持
    // math: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 @mathjax/src
    //   type: "mathjax",
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,

    // 启用之前需安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    components: {
      components: ["Badge", "VPCard"],
    },

    icon: {
      prefix: "fa6-solid:",
    },

    // 站内搜索（@vuepress/plugin-search）
    // slimsearch 在 vuepress 2.0.0-rc.31 + Node < 22.18 下会因 @vuepress/search-helper
    // 引入 .css 而报 ERR_UNKNOWN_FILE_EXTENSION，故此处用 search
    search: true,

    // PWA（依赖 @vuepress/plugin-pwa）
    pwa: {
      favicon: "/favicon.ico",
      // 与 styles/config.scss 里的 $theme-color 保持一致
      themeColor: "#096dd9",
      cacheHTML: true,
      cacheImage: true,
      appendBase: true,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      msTile: {
        image: "/assets/icon/ms-icon-144.png",
        color: "#ffffff",
      },
      manifest: {
        name: "dzhes's Blog",
        short_name: "dzhes",
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-mask-192.png",
            sizes: "192x192",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "首页",
            url: "/",
            icons: [
              {
                src: "/assets/icon/guide-maskable.png",
                sizes: "192x192",
                purpose: "maskable",
                type: "image/png",
              },
            ],
          },
        ],
      },
    },
  },
});
