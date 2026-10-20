import { markdown } from "@codemirror/lang-markdown";
import { keymap } from "@codemirror/view";
import { alert } from "@mdit/plugin-alert";
import { footnote } from "@mdit/plugin-footnote";
import { katex } from "@mdit/plugin-katex-slim";
import { basicSetup, EditorView } from "codemirror";
import mermaid from "mermaid";
import MarkdownIt from "markdown-it";

import "@mdit/plugin-alert/style";
import "katex/dist/katex.min.css";
import "./style.css";

const md = new MarkdownIt({ html: true, linkify: true }).use(katex).use(alert).use(footnote);

const defaultLinkOpen =
  md.renderer.rules.link_open ??
  ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options));

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  tokens[index].attrSet("target", "_blank");
  tokens[index].attrSet("rel", "noreferrer noopener");
  return defaultLinkOpen(tokens, index, options, env, self);
};

mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default" });

const filterInput = document.querySelector<HTMLInputElement>("#filter")!;
const fileList = document.querySelector<HTMLUListElement>("#file-list")!;
const currentFileLabel = document.querySelector<HTMLElement>("#current-file")!;
const statusLabel = document.querySelector<HTMLElement>("#status")!;
const saveButton = document.querySelector<HTMLButtonElement>("#save")!;
const preview = document.querySelector<HTMLElement>("#preview")!;

let files: string[] = [];
let currentPath: string | null = null;
let savedContent = "";
let dirty = false;
let renderTimer = 0;
let renderToken = 0;

const setStatus = (text: string, isError = false): void => {
  statusLabel.textContent = text;
  statusLabel.classList.toggle("error", isError);
};

const readError = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? `请求失败 (${response.status})`;
  } catch {
    return `请求失败 (${response.status})`;
  }
};

const setDirty = (next: boolean): void => {
  if (dirty === next) return;
  dirty = next;
  document.title = `${next ? "● " : ""}${currentPath ?? "文章编辑器"} · dzhes's Blog`;
  renderFileList();
};

const renderFileList = (): void => {
  const keyword = filterInput.value.trim().toLowerCase();
  const visible = files.filter((file) => file.toLowerCase().includes(keyword));

  fileList.replaceChildren();

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = files.length > 0 ? "没有匹配的文章" : "src/posts 下没有 .md 文件";
    fileList.append(empty);
    return;
  }

  for (const file of visible) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const dot = document.createElement("span");
    const label = document.createElement("span");

    button.type = "button";
    button.className = "file-item";
    button.classList.toggle("active", file === currentPath);
    dot.className = "dirty-dot";
    dot.textContent = file === currentPath && dirty ? "●" : "";
    label.className = "file-path";
    label.textContent = file;

    button.append(dot, label);
    button.addEventListener("click", () => {
      void openFile(file);
    });
    item.append(button);
    fileList.append(item);
  }
};

const stripFrontmatter = (source: string): string =>
  source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");

async function renderPreview(): Promise<void> {
  const token = ++renderToken;

  preview.innerHTML = md.render(stripFrontmatter(view.state.doc.toString()));

  const blocks: HTMLElement[] = [];
  preview.querySelectorAll("pre > code.language-mermaid").forEach((code) => {
    const block = document.createElement("div");
    block.className = "mermaid";
    block.textContent = code.textContent ?? "";
    code.parentElement?.replaceWith(block);
    blocks.push(block);
  });

  for (const [index, block] of blocks.entries()) {
    try {
      const { svg } = await mermaid.render(
        `mermaid-preview-${token}-${index}`,
        block.textContent ?? "",
      );
      if (token !== renderToken) return;
      block.innerHTML = svg;
    } catch (error) {
      if (token !== renderToken) return;
      block.classList.add("mermaid-error");
      block.textContent = `Mermaid 渲染失败：${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

const scheduleRender = (): void => {
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(() => {
    void renderPreview();
  }, 180);
};

const view = new EditorView({
  parent: document.querySelector<HTMLElement>("#editor")!,
  doc: "",
  extensions: [
    keymap.of([
      {
        key: "Mod-s",
        preventDefault: true,
        run: () => {
          void saveFile();
          return true;
        },
      },
    ]),
    basicSetup,
    markdown(),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (!update.docChanged) return;
      setDirty(view.state.doc.toString() !== savedContent);
      scheduleRender();
    }),
    EditorView.theme({
      "&": { height: "100%", fontSize: "14px" },
      ".cm-scroller": { fontFamily: "var(--mono)", lineHeight: "1.7" },
    }),
  ],
});

async function openFile(path: string): Promise<void> {
  if (path === currentPath) return;
  if (dirty && !window.confirm("当前文章尚未保存，仍要切换吗？")) return;

  setStatus("读取中…");

  try {
    const response = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new Error(await readError(response));

    const content = await response.text();
    currentPath = path;
    savedContent = content;
    currentFileLabel.textContent = path;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: content } });
    setDirty(false);
    saveButton.disabled = false;
    renderFileList();
    view.focus();
    setStatus("已加载");
    await renderPreview();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
}

async function saveFile(): Promise<void> {
  if (!currentPath) return;

  setStatus("保存中…");

  try {
    const content = view.state.doc.toString();
    const response = await fetch(`/api/file?path=${encodeURIComponent(currentPath)}`, {
      method: "PUT",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: content,
    });
    if (!response.ok) throw new Error(await readError(response));

    savedContent = content;
    setDirty(false);
    setStatus(`已保存 ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
}

async function loadFiles(): Promise<void> {
  setStatus("载入文章列表…");

  try {
    const response = await fetch("/api/files");
    if (!response.ok) throw new Error(await readError(response));

    files = (await response.json()) as string[];
    renderFileList();

    if (files.length > 0) {
      await openFile(files[0]);
    } else {
      setStatus("src/posts 下没有 .md 文件");
    }
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
}

saveButton.addEventListener("click", () => {
  void saveFile();
});
filterInput.addEventListener("input", renderFileList);
window.addEventListener("beforeunload", (event) => {
  if (!dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

void loadFiles();
