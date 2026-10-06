---
title: 这个博客是怎么搭起来的
icon: code
date: 2026-10-06
category:
  - 技术
tag:
  - VuePress
  - 建站
  - 前端
sticky: true
---

# 这个博客是怎么搭起来的

趁热把建站过程记下来，省得以后忘了当初为什么这么配。

## 技术栈

- **VuePress 2**（`2.0.0-rc.31`）+ `@vuepress/bundler-vite`
- **vuepress-theme-hope**（`2.0.0-rc.110`），博客相关的首页、文章列表、分类、标签、时间轴都由它提供
- TypeScript + ESM（`package.json` 里 `"type": "module"`），样式用 `sass-embedded`
- 部署在 Vercel，域名 `www.dzhes.xyz`

## 三层配置链

```text
src/.vuepress/config.ts   站点级：base / lang / title / description
  └── theme.ts            主题级：hostname / author / logo / repo / blog / plugins
        ├── navbar.ts     导航栏（手写数组）
        └── sidebar.ts    侧边栏（按目录结构自动生成）
```

样式是另一条链，由 sass-palette 自动注入：

```text
styles/config.scss    全局变量：$theme-color、断点、代码块配色
styles/palette.scss   调色板：$vp-c-*、$vp-font、$content-width
styles/index.scss     任意自定义 CSS
```

## 踩到的坑

**ESM 下相对导入必须带 `.js` 后缀。** `import theme from "./theme.js"` 才对，写成 `.ts` 或省略后缀都会直接构建失败 —— 配置文件本身是 TS，但运行时是按 ESM 解析的。

**导航栏是手写的，侧边栏是自动的。** `sidebar.ts` 里用了 `children: "structure"`，新建 `posts/xxx/` 目录后侧边栏会自动出现；但 `navbar.ts` 不会，新增栏目必须手改。

**分类和标签来自 frontmatter，不来自目录名。** 目录名只决定 URL 和侧边栏结构，`category` / `tag` 得写在文章头部。

**`base` 决定部署成败。** 部署到子路径（如 `username.github.io/repo`）时必须是 `"/repo/"`，否则整站资源 404。绑在根域名上保持 `"/"`。

**主题的可选插件要手动装。** 搜索、RSS、PWA、评论都是可选依赖，不安装的话功能静默关闭 —— 连搜索框都不会出现。

## 做了什么改动

- 清掉模板自带的作者、仓库、`hostname` 和 34 个 `example.com` 占位社交链接
- 删除 `src/demo/` 演示页与示例文章，避免它们被搜索引擎收录
- 启用站内搜索（`@vuepress/plugin-slimsearch`）与 PWA（`@vuepress/plugin-pwa`）
- 导航栏改为：技术 / 随笔 / 朋友们 / 时间轴 / 失落媒体 / 关于

## 写文章

新建 `src/posts/tech/xxx.md`，头部照抄这个：

```yaml
---
title: 文章标题
icon: pen-to-square
date: 2026-10-06
category:
  - 技术
tag:
  - 标签
---
```

`category` 支持数组，一篇文章可以属于多个分类；`sticky: true` 置顶，`star: true` 加星标，`cover` 指定列表卡片图。
