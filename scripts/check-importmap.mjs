#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX = path.join(ROOT, "index.html");

function fail(msg) {
  console.error(`[lint:importmap] FAIL: ${msg}`);
  process.exit(1);
}
function ok(msg) {
  console.log(`[lint:importmap] OK: ${msg}`);
}

if (!fs.existsSync(INDEX)) fail(`Missing index.html at ${INDEX}`);
const html = fs.readFileSync(INDEX, "utf8");

// Grab first <script type="importmap">...</script>
const m = html.match(/<script\s+type=["']importmap["']\s*>([\s\S]*?)<\/script>/i);
if (!m) fail(`No <script type="importmap"> found in index.html`);

let importmap;
try {
  importmap = JSON.parse(m[1]);
} catch (e) {
  fail(`Importmap JSON parse error: ${(e && e.message) || e}`);
}

const imports = importmap?.imports;
if (!imports || typeof imports !== "object") fail(`Importmap missing "imports"`);

function mustHave(key) {
  if (!(key in imports)) fail(`Missing importmap key: "${key}"`);
  const v = String(imports[key] ?? "");
  if (!v) fail(`Empty importmap value for "${key}"`);
  return v;
}

function isEsm(url) {
  return url.startsWith("https://esm.sh/");
}

function forbidDrift(url, key) {
  if (url.includes("@^")) fail(`Forbidden version drift "@^" in "${key}": ${url}`);
  if (url.includes("@latest")) fail(`Forbidden version drift "@latest" in "${key}": ${url}`);

  // Require explicit "@version" for esm.sh packages
  if (/^https:\/\/esm\.sh\/[^@/?]+([/?]|$)/.test(url) && !/^https:\/\/esm\.sh\/[^@/?]+@/.test(url)) {
    fail(`Missing explicit "@version" in "${key}": ${url}`);
  }
}

function getPinnedVersion(url) {
  const mm = url.match(/@([^/?]+)/);
  return mm ? mm[1] : "";
}

function mustInclude(url, needle, key) {
  if (!url.includes(needle)) fail(`"${key}" must include "${needle}" but got: ${url}`);
}

// A) Forbid drift on all esm.sh urls
for (const [k, v0] of Object.entries(imports)) {
  const v = String(v0 ?? "");
  if (isEsm(v)) forbidDrift(v, k);
}

// C) React required & pinned
const react = mustHave("react");
const reactDom = mustHave("react-dom");
const reactDomClient = mustHave("react-dom/client");
forbidDrift(react, "react");
forbidDrift(reactDom, "react-dom");
forbidDrift(reactDomClient, "react-dom/client");

const vReact = getPinnedVersion(react);
const vReactDom = getPinnedVersion(reactDom);
if (!vReact) fail(`Cannot parse react version from: ${react}`);
if (!vReactDom) fail(`Cannot parse react-dom version from: ${reactDom}`);

// B) Router family required & same version
const rrd = mustHave("react-router-dom");
const rr = mustHave("react-router");
const remixRouter = mustHave("@remix-run/router");

const vRrd = getPinnedVersion(rrd);
const vRr = getPinnedVersion(rr);
if (!vRrd) fail(`Cannot parse react-router-dom version from: ${rrd}`);
if (!vRr) fail(`Cannot parse react-router version from: ${rr}`);

if (vRrd !== vRr) {
  fail(`react-router-dom@${vRrd} must match react-router@${vRr}`);
}

// D) Externalize (critical)
mustInclude(rrd, "external=react,react-dom", "react-router-dom");
mustInclude(rr, "external=react,react-dom", "react-router");
mustInclude(remixRouter, "external=react,react-dom", "@remix-run/router");

// Optional: lucide-react externalize (recommended)
if ("lucide-react" in imports) {
  const luc = String(imports["lucide-react"]);
  forbidDrift(luc, "lucide-react");
  mustInclude(luc, "external=react,react-dom", "lucide-react");
}

ok(`importmap hard lock passed (react ${vReact}, react-dom ${vReactDom}, router ${vRrd})`);
process.exit(0);
