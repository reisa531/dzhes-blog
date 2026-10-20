import { readdir, readFile, writeFile } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { isAbsolute, relative, resolve } from "node:path";

import { defineConfig, type Plugin } from "vite";

const editorRoot = import.meta.dirname;
const postsRoot = resolve(editorRoot, "../../src/posts");

const readBody = async (request: IncomingMessage): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

const send = (response: ServerResponse, status: number, body: unknown): void => {
  response.statusCode = status;
  response.setHeader(
    "Content-Type",
    typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
  );
  response.end(typeof body === "string" ? body : JSON.stringify(body));
};

const resolvePostPath = (input: string): string => {
  const absolute = resolve(postsRoot, input);
  const pathWithinPosts = relative(postsRoot, absolute);
  if (
    !pathWithinPosts ||
    pathWithinPosts.startsWith("..") ||
    isAbsolute(pathWithinPosts) ||
    !absolute.toLowerCase().endsWith(".md")
  ) {
    throw new Error("非法的文章路径");
  }
  return absolute;
};

const listMarkdownFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolute = resolve(directory, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(absolute);
      return entry.name.toLowerCase().endsWith(".md")
        ? [relative(postsRoot, absolute).split("\\").join("/")]
        : [];
    }),
  );
  return nested.flat();
};

const postsApi = (): Plugin => ({
  name: "posts-api",
  configureServer(server) {
    server.middlewares.use("/api", (request, response) => {
      void (async () => {
        const url = new URL(request.url ?? "/", "http://localhost");

        try {
          if (request.method === "GET" && url.pathname === "/files") {
            send(response, 200, (await listMarkdownFiles(postsRoot)).sort());
            return;
          }

          const path = url.searchParams.get("path");
          if (!path) {
            send(response, 400, { error: "缺少 path 参数" });
            return;
          }

          const file = resolvePostPath(path);

          if (request.method === "GET") {
            send(response, 200, await readFile(file, "utf8"));
            return;
          }

          if (request.method === "PUT") {
            await writeFile(file, await readBody(request), "utf8");
            send(response, 200, { ok: true });
            return;
          }

          send(response, 405, { error: "不支持的方法" });
        } catch (error) {
          const code = (error as NodeJS.ErrnoException).code === "ENOENT" ? 404 : 400;
          send(response, code, { error: error instanceof Error ? error.message : String(error) });
        }
      })();
    });
  },
});

export default defineConfig({
  root: editorRoot,
  plugins: [postsApi()],
  server: {
    port: 5180,
  },
});
