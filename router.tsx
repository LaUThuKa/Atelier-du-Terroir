import React from "react";
import { createBrowserRouter, createHashRouter } from "react-router-dom";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ThemeAll from "./pages/ThemeAll";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/catalog", element: <Catalog /> },
  { path: "/themes/:themeId", element: <ThemeAll /> },

  // 兼容某些預覽容器會以 /index.html 打開
  { path: "/index.html", element: <Home /> },

  // 最後保底：不要導向，直接渲染 Home（避免跳出 sandbox）
  { path: "*", element: <Home /> },
];

// 判斷是否在「預覽容器 / 非標準入口」
function shouldUseHashRouter() {
  if (typeof window === "undefined") return false;

  const p = window.location.pathname || "";
  const base = document.baseURI || "";

  // 常見預覽容器：/index.html、或 baseURI 帶有 .html、或 path 有副檔名
  const looksLikeStaticEntry =
    p.endsWith(".html") ||
    base.includes(".html") ||
    /\.[a-zA-Z0-9]+$/.test(p);

  // 安全讀取 BASE_URL
  const baseUrl = (import.meta as any).env?.BASE_URL || "/";

  // 若被掛在奇怪子路徑
  const looksLikeSandboxSubpath = !p.startsWith(baseUrl);

  return looksLikeStaticEntry || looksLikeSandboxSubpath;
}

export const router = shouldUseHashRouter()
  ? createHashRouter(routes)
  : createBrowserRouter(routes, {
      // 正式環境（GitHub Pages /Atelier-du-Terroir/）會用到，增加安全選取
      basename: (import.meta as any).env?.BASE_URL || "/",
    });
