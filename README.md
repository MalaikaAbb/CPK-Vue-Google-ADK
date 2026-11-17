# CopilotKit Vue + Google ADK Test Suite

A navigable, working test harness for CopilotKit's **Vue** frontend against a **Google ADK (Python)** agent. Each Vue doc page is a route that runs that page's own code.

| | |
|---|---|
| **Doc sync date** | Machine-maintained: `doc-snapshot/manifest.json` → `syncedAt` (baseline taken 2026-11-13, 22 pages; the nine Generative UI › Components pages added 2026-11-17, 31 in all). |
| **CopilotKit packages** | `@copilotkit/vue` 1.87.0 · `@copilotkit/core` 1.87.0 · `@copilotkit/runtime` 1.87.0 · `@ag-ui/client` 1.0.2 (`HttpAgent`, the same copy the runtime uses) |
| **ADK** | `google-adk` 2.14.0 · `ag-ui-adk` 0.13.0 · `fastapi` 0.162.5 · `uvicorn` 0.54.0 · Python 3.14 (uv default; the Quickstart pins none) |
| **Frontend** | Vite 8.3 · Vue 3.5 · vue-router 5.5 · TypeScript 6.0 · Tailwind 4.3 (harness chrome only) · zod 3.25.76 · chart.js 4.6.1 · maplibre-gl 5.24.1 (Components pages) |
| **Build status** | No CI. `vite build` ✅. `vue-tsc` reports 9 errors, all in published doc code (§9.10). All 86 URLs (every route and every demo sample, Components pages included) mounted in headless Chrome with **zero console or page errors** (2026-11-17). The chain (runtime → `HttpAgent` → ADK agent → Gemini) was driven with a **fake** key on both agent endpoints (`/` and `/tool-rendering`): each reached Google and failed only with `API key not valid`. The `/toolset` routes were driven with a fake key against a local stand-in for the Gemini API, which captured each frontend tool in the model request (§9.17). **No route has been driven against a live model yet.** |

---

## 2. Overview

Google's Agent Development Kit (ADK) builds agents in Python, typically around Gemini. CopilotKit reaches an ADK agent over AG-UI: the `ag-ui-adk` adapter (`ADKAgent` + `add_adk_fastapi_endpoint`) serves it as a FastAPI endpoint, the Copilot Runtime registers an AG-UI `HttpAgent` pointed at it, and `@copilotkit/vue` renders the result.

This repo turns the Quickstart and the Basics, Generative UI, Interactivity and Agent capabilities sections of the Vue ADK sidebar (22 pages) into one navigable Vite app. It adds the nine **Generative UI › Components** pages, which aren't under `/vue` and print each sample for React, Angular, React Native and Vue; only their Vue tab is used. Every route mounts the page's code verbatim, bugs included, and shows the exact files that run. Anything the harness added is marked **[harness]** in the file, in a pink **Harness** callout on the notes page, and, for stand-in components, with a **HARNESS STAND-IN** badge on screen.

Tracks: **<https://docs.copilotkit.ai/vue/google-adk>** and **<https://docs.copilotkit.ai/google-adk/generative-ui/components>**

---

## 3. Architecture

```
Browser — Vite dev server · localhost:5173
  │  @copilotkit/vue/v2; each /<route>/demo-chat mounts that page's own App.vue
  │  runtime-url="/api/copilotkit…" ──► Vite proxy /api → :8200
  ▼
Node · backend/server.ts · localhost:8200
  │  Vue Quickstart's host: createServer + createCopilotNodeListener({ cors: true })
  │  ADK landing page's runtime: my_agent = new HttpAgent({ url: AGENT_URL })
  │  /api/copilotkit                 every doc agent id → my_agent
  │  /api/copilotkit-tool-rendering  `default` → <AGENT_URL>tool-rendering        [harness: own path]
  │  /api/copilotkit-threads         Intelligence quickstart's runtime (if key set) [harness: own path]
  │  /api/copilotkit-mcp-apps        MCP Apps' runtime (mcpApps.servers)          [harness: own path]
  ▼  AGENT_URL (AG-UI over HTTP)
Python · agent/harness_app.py · localhost:8000   (uv)
  │  /                main.py, verbatim: LlmAgent("gemini-3.8-flash") → ADKAgent → add_adk_fastapi_endpoint
  │  /tool-rendering  [harness] the same arguments + tools=[get_weather] from the Tool Rendering page
  ▼
Gemini (GOOGLE_API_KEY)                    MCP Apps example server on :3101 (MCP Apps route only)
```

**Three processes.** The agent is **Python** (ADK + FastAPI). The Copilot Runtime is **TypeScript on Node** (`tsx`). The frontend is Vite.

**Where each piece comes from.**
- **The Vue ADK Quickstart redirects to a landing page.** Its `.md` is the Vue (built-in agent) Quickstart, which says to keep its Vue frontend steps and take "the runtime wiring" from your framework's quickstart. So `App.vue`, `main.ts` and the Node host come from the Vue Quickstart.
- **The landing page's only code block is the runtime**, published as a Next.js route: `agents: { my_agent: new HttpAgent({ url: process.env.AGENT_URL! }) }`. It's used verbatim, hosted in the Vue Quickstart's Node listener.
- **The agent** is the ADK Quickstart's (`/google-adk/quickstart`, linked as the landing page's guide): "Use an existing agent". That's `main.py` verbatim, served through `harness_app.py`, which imports `main.app` unchanged and adds two endpoints: `/tool-rendering` (§9.2) and `/toolset`, the Quickstart agent plus `AGUIToolset()` (§9.17).

### Agent ids

The landing page registers only `my_agent`. The Vue samples use `default` (no agent-id), `my-agent`, `sales`, `support`, `researcher`, `workspace` and `writer`. The ADK page agents can't load (§9.4), so by your rules every id is `my_agent` (`backend/agents.ts`). Two exceptions run harness agents as `default` on their own runtime paths: Tool Rendering (`/api/copilotkit-tool-rendering`, §9.2), and the routes that send frontend tools (`/api/copilotkit-toolset`, the Quickstart agent plus `AGUIToolset()`, §9.17). MCP Apps' runtime uses the `/toolset` agent too.

### What the adapter does, and doesn't, for this agent (verified in the installed `ag-ui-adk` source)

- **Frontend tools are declared to the model only if the agent's tools include `AGUIToolset()`.** Otherwise the adapter logs "Frontend tools … will not be declared to the model". The Quickstart's `LlmAgent` has none, so `useFrontendTool`, `useComponent`, `useHumanInTheLoop` and MCP Apps tools never reach it (§9.3). At your request those routes run on a flagged `/toolset` agent that adds `AGUIToolset()` (§9.17).
- **Context** is stored in session state (`_ag_ui_context`) and run metadata for tools and instruction providers, **not** put in the prompt. The Quickstart's instruction is a fixed string, so `useAgentContext` values never reach the model (§9.3).
- **Generative UI › Components:** the runtime adds `render_ui` to the run's tools and its guide to the run's context, On the Quickstart agent neither reaches the model. On the `/toolset` agent (§9.17) `render_ui` is declared, but the guide still isn't in the prompt (§9.16).

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | **24.12+** (or 22.18+) | `create-vue`'s scaffold requires it. Developed on 24.16. |
| npm | 10+ | Developed on npm 12. |
| uv | 0.11+ | The Quickstart uses it (`uv add ag-ui-adk google-adk uvicorn fastapi`). |
| Python | 3.10+ | uv picks one; developed on 3.14. |
| Google AI API key | — | Required, in `agent/.env` as `GOOGLE_API_KEY`. The agent uses `gemini-3.8-flash` as published. |
| CopilotKit Intelligence key | — | Optional, only for the two Threads routes. |

---

## 5. Setup

```bash
git clone <this-repo> google-adk && cd google-adk
cd agent && uv sync && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cp .env.example agent/.env              # set GOOGLE_API_KEY
cp .env.example backend/.env            # AGENT_URL is pre-filled
```

| File | Variable | What it does |
|---|---|---|
| `agent/.env` | `GOOGLE_API_KEY` | **Required.** Read by `google-adk` for Gemini. |
| `backend/.env` | `AGENT_URL` | **Required.** The landing page's `HttpAgent` URL: `http://localhost:8000/`. Tool Rendering uses `<AGENT_URL>tool-rendering`. |
| `backend/.env` | `CPK_INTELLIGENCE_API_KEY` | Optional. Intelligence for the Threads runtime: `cd backend && npx copilotkit@latest login && npx copilotkit@latest project select`. |
| `backend/.env` | `APP_USER_ID` · `MCP_APPS_URL` · `PORT` · `COPILOTKIT_TELEMETRY_DISABLED` | Optional: fixed local Threads identity, MCP server URL (default `http://localhost:3101/mcp`), runtime port (default 8200), telemetry opt-out. |

**Ports:** agent **8000** (hard-coded in the Quickstart's `main.py`), runtime **8200**, frontend **5173** (`strictPort`), MCP Apps example **3101**.

---

## 6. Running the project

```bash
# 1 — ADK agent (the Quickstart's main.py, plus the Tool Rendering endpoint)
cd agent && uv run --env-file .env harness_app.py
```
Success: `Uvicorn running on http://localhost:8000`. (`uv run main.py`, the Quickstart's own command, also works but serves `/` only, so Tool Rendering and the `/toolset` routes then have no agent.) **If port 8000 is taken:** `uv run --env-file .env uvicorn harness_app:app --port 8002`, and set `AGENT_URL=http://localhost:8002/` in `backend/.env`.

```bash
# 2 — Copilot Runtime
cd backend && npm run dev
```
Success:
```
Copilot Runtime listening at http://localhost:8200/api/copilotkit
  Agent: http://localhost:8000/
  + /api/copilotkit-threads  (sse)
  + /api/copilotkit-mcp-apps
  + /api/copilotkit-tool-rendering
```

```bash
# 3 — Vue app
cd frontend && npm run dev               # → http://localhost:5173/
```

Open **<http://localhost:5173>**. **MCP Apps route only:** `cd backend && npm run mcp:apps`.

---

## 7. What to expect: walkthrough per section

Each route has a notes page (`/<route>`: notes, Try-it prompts with pass/fail, the exact source, unmounted samples as published, Harness and gap callouts) and a demo (`/<route>/demo-chat`; a **Sample** picker where a page has several samples).

### Getting Started
**`/quickstart`**: **Try:** `Hello! What can you do?` **Pass:** a streamed reply from Gemini. **Fail:** connection refused or `RUN_ERROR` means the agent isn't running or `AGENT_URL` is wrong (an HTTP 404 means another server is on that port, §6). `API key not valid` means `GOOGLE_API_KEY` is missing from `agent/.env`.

### Basics
**`/prebuilt-components`**, **`/custom-look-and-feel/headless-ui`**, **`/programmatic-control`**: chat against `my_agent`: a streamed reply. Programmatic Control's default sample adds a chat (harness, on request). **`/custom-look-and-feel/slots`**: nine samples; the **Disclaimer** sample shows no disclaimer (doc bug, §9.11).
**`/prebuilt-components/copilot-threads-drawer`**, **`/headless-threads`**: need `CPK_INTELLIGENCE_API_KEY`.
**`/frontend-tools`**: runs on `/toolset` (§9.17). **Try:** `Only show sev1 incidents`. **Pass:** "Current filter" changes to sev1. **Fail:** prose with the filter unchanged, usually because the agent was started with `main.py`.

### Generative UI
**`/generative-ui/tool-based`**: runs on `/toolset` (§9.17). **Try:** `Show me the weather in Paris`. **Pass:** an inline weather card (values invented by the model).
**`/generative-ui/tool-rendering`**: **Try:** `What is the weather in Tokyo?` **Pass:** per-tool "Checking Tokyo", then the city and `get_weather`'s result (68°, Sunny). **Fail:** prose only, meaning the agent was started with `main.py` instead of `harness_app.py`.
**`/generative-ui/state-rendering`**: **Expected now:** "Idle" (§9.4).
**`/generative-ui/mcp-apps`**: needs `npm run mcp:apps`; its runtime uses the `/toolset` agent (§9.17). **Try:** `What time is it on the server?` **Pass:** a get-time tool call, then an inline app.

### Interactivity
**`/shared-state`**: **Try:** **Prefer concise answers**. **Pass:** `preferences.tone` appears in the agent state (Inspector › State). The notes list stays empty (§9.4).
**`/shared-state/rendering-in-app`**: the Canvas shows "Project launch", but the agent can't edit it.
**`/shared-state/streaming`**: **Expected now:** "Waiting for a draft…" throughout (§9.4).
**`/shared-state/agent-readonly`**: **Expected now:** the agent doesn't know the workspace (gap, §9.3).
**`/human-in-the-loop`**, **`/human-in-the-loop/governed-actions`**: run on `/toolset` (§9.17). **Try:** `Schedule a meeting about Q3 planning with Dana`. **Pass:** a card with time slots, and picking one resumes the run. On Governed Actions, only the tool half can show a card; the interrupt half can't fire (§9.5).
**`/human-in-the-loop/useInterrupt`**, **`/human-in-the-loop/headless`**: **Expected now:** no interrupt (§9.5).
**`/webmcp`**: stand-in sample only (your choice). In Chrome 149+ with WebMCP, **Run tool** `searchOrders` `{"status":"open"}` returns ORD-1001 and ORD-1004.

### Generative UI › Components (Vue tab of the `/google-adk/generative-ui/components` pages)
The samples that send `render_ui` run on `/toolset`, so the model sees the tool. They don't send the guide, so it doesn't know the catalog's components (§9.16, §9.17). Markdown mode and the markdown and `agentIds` Transports samples stay on the Quickstart agent. **Expected now:** at best a render attempt with guessed component names; Markdown mode answers in plain text. The **Pass** lines below need the guide in the prompt as well.
**`/generative-ui/components`**: the overview's `App.vue` with the standard catalog. It calls `:8200` directly, as published. **Try:** `Compare the Starter, Team, and Enterprise plans in a table`. **Pass:** a table component in the chat.
**`/generative-ui/components/catalogs`**: your own catalog (`ProductGrid`, `ProductCard`). **Try:** `Show me two products`. **Pass:** a grid of product cards.
**`/generative-ui/components/surfaces`**: a page target (`featured`) above the chat; its default content is a **stand-in** `ProductRow`. **Pass:** the agent replaces it with a ProductGrid.
**`/generative-ui/components/standard-catalog`**: the standard catalog, and a sample that replaces `Card` with `MyCard`.
**`/generative-ui/components/state-and-actions`**: `ProductCard` with "Add to cart" (an `onAddToCart` event bound to an `addToCart` function). The handler sample needs `./cart-store`, which isn't published, so clicking takes the card's error path.
**`/generative-ui/components/theming`**: standard components in the amber accent and 10px radius.
**`/generative-ui/components/transports`**: tool, markdown and `agentIds: ['shop']` samples.
**`/generative-ui/components/markdown-mode`**: the agent would answer with `a2ui` blocks if it saw the guide; the adapter keeps context out of the prompt. The `sendContext: false` sample puts the guide only in forwarded props, which no published ADK code reads.
**`/generative-ui/components/from-a2ui`**: the "After" provider; `Airport` and `Arrow` are **stand-ins**.

### Agent capabilities
**`/multi-agent/subagents`**: notes only (§9.4).

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
|---|---|---|---|
| `/vue/google-adk` | `/` | 📖 Reference | Landing page. |
| `/vue/google-adk` (Quickstart) | `/quickstart` | ✅ Working | Chain verified with a fake key (Google rejected it). |
| `prebuilt-components` | same | ✅ Working | Only `CopilotChat` has code. |
| `custom-look-and-feel/slots` | same | ⚠️ Partial | Imports added to fragments; 2 stand-ins; `labels` type error; disclaimer never renders (§9.10, §9.11). |
| `custom-look-and-feel/headless-ui` | same | ✅ Working | |
| `programmatic-control` | same | ✅ Working | Default sample adds a harness chat (on request). |
| `prebuilt-components/copilot-threads-drawer` | same | ⚠️ Partial | Intelligence quickstart runtime, fixed local identity; needs a key (§9.8). |
| `headless-threads` | same | ⚠️ Partial | Same runtime (§9.8). |
| `frontend-tools` | same | ✅ Working | On `/toolset` (Quickstart + `AGUIToolset()`, flagged, §9.17); `filter_incidents` captured in the model request. |
| `generative-ui/tool-based` | same | ✅ Working | On `/toolset` (§9.17); `show_weather` captured in the model request. |
| `generative-ui/tool-rendering` | same | ⚠️ Partial | Page's `get_weather` in a flagged harness agent, on its own path (§9.2). |
| `generative-ui/state-rendering` | same | ❌ Broken | Page agent can't load (§9.4). |
| `generative-ui/mcp-apps` | same | ⚠️ Partial | Runtime uses the `/toolset` agent (§9.17); not driven with the MCP server. |
| `/google-adk/generative-ui/components` | same | ⚠️ Partial | `App.vue` + chart/map plugins; on `/toolset`, `render_ui` declared; guide not in the prompt (§9.16, §9.17). |
| `…/components/surfaces` | same | ⚠️ Partial | `ProductRow` stand-in; `render_ui` declared, guide missing. |
| `…/components/catalogs` | same | ⚠️ Partial | Provider line wrapped with a chat; `render_ui` captured in the model request; guide missing. |
| `…/components/standard-catalog` | same | ⚠️ Partial | `render_ui` declared, guide missing. |
| `…/components/state-and-actions` | same | ⚠️ Partial | `./cart-store` never published; `render_ui` declared, guide missing. |
| `…/components/theming` | same | ⚠️ Partial | `render_ui` declared, guide missing. |
| `…/components/transports` | same | ⚠️ Partial | Tool sample on `/toolset`: `render_ui` declared, guide missing; markdown: guide not in the prompt. |
| `…/components/markdown-mode` | same | ❌ Broken | Guide in context, not the prompt; `sendContext: false` guide in forwarded props, unread (§9.16). |
| `…/components/from-a2ui` | same | ⚠️ Partial | `Airport`/`Arrow` stand-ins; `render_ui` declared, guide missing. |
| `shared-state` | same | ⚠️ Partial | Read + tone write-back; nothing writes `notes` (§9.4). |
| `shared-state/rendering-in-app` | same | ⚠️ Partial | Canvas renders; agent can't write. |
| `shared-state/streaming` | same | ❌ Broken | Page agent can't load (§9.4). |
| `shared-state/agent-readonly` | same | ❌ Broken | Gap: context not in the prompt (§9.3). |
| `human-in-the-loop` | same | ⚠️ Partial | On `/toolset` (§9.17), `schedule_meeting` captured; `TimePickerCard` stand-in. |
| `human-in-the-loop/useInterrupt` | same | ❌ Broken | No interrupting agent; `MeetingChat` stand-in (§9.5). |
| `human-in-the-loop/headless` | same | ❌ Broken | Only `App.vue` published; `HeadlessInterruptPanel` stand-in (§9.5). |
| `human-in-the-loop/governed-actions` | same | ⚠️ Partial | Tool half on `/toolset` (§9.17), `approve_governed_action` captured; interrupt half §9.5. |
| `webmcp` | same | ⚠️ Partial | Stand-in sample only; as published every call errors (§9.6). |
| `multi-agent/subagents` | same | ❌ Broken | Backend can't load; no Vue code (§9.4). |

**Legend:** ✅ Working · ⚠️ Partial · 📖 Reference · 🚧 Not started · ❌ Broken. "Working" means wired and verified from code, mounts, and the fake-key run; **not yet driven against a live model.**

---

## 9. Known issues / doc-vs-implementation discrepancies

All against `@copilotkit/vue` / `@copilotkit/runtime` 1.87.0, `ag-ui-adk` 0.13.0, `google-adk` 2.14.0, and the docs as of the 2026-11-13 baseline.

**1. The Quickstart is split across three pages.** `/vue/google-adk/quickstart` redirects (307) to the landing page. The root `.md` is the built-in Vue Quickstart (`BuiltInAgent`), rendered on `/vue`. The landing page's only code block, the runtime route (a Next.js route, `createCopilotRuntimeHandler` with `GET`/`POST`), appears in no `.md`. The agent is on the non-Vue `/google-adk/quickstart` "Use an existing agent" tab, which renders client-side (verified through `data-raw-code`).

**2. Tool Rendering publishes a tool but no agent.** [Tool Rendering](https://docs.copilotkit.ai/vue/google-adk/generative-ui/tool-rendering)'s `tool_rendering_common.py` defines only `get_weather`. At your request ("define the tools if they are given"), `agent/harness_app.py` (flagged) builds an `LlmAgent` from the Quickstart's own arguments plus `tools=[get_weather]`, wraps it with the Quickstart's `ADKAgent` arguments, and mounts it at `/tool-rendering`. `main.py` itself is untouched. The samples use `default`, so they get their own runtime path (`/api/copilotkit-tool-rendering`); the three `App.vue` copies point there, with the published `runtime-url` kept as a comment. Verified with a fake key: runs reach Gemini.

**3. Gap: the Quickstart agent declares no frontend tools and reads no context.** Verified in `ag-ui-adk`'s source: frontend tools are declared only to agents whose tools include `AGUIToolset()`, and context is kept in session state and run metadata, not in the prompt. The Quickstart's `LlmAgent` has no `AGUIToolset` and a fixed instruction. The ADK page agents that do include `AGUIToolset` can't load (§9.4), and no Vue page publishes another. So by your rules nothing was written, and these routes were broken. **Tool half since resolved at your request by the flagged `/toolset` agent (§9.17)**; the context half still stands:
- ~~Frontend Tools, Components as Tools, HITL, Governed Actions: the model never sees the tool.~~ Fixed by `/toolset`.
- ~~MCP Apps: the server's tools are never declared.~~ Fixed by `/toolset`.
- Generative UI › Components: `render_ui` is declared on `/toolset`, but its guide stays out of the prompt (§9.16).
- Agent Read-Only Context: the page credits "the backend's CopilotKit middleware"; ADK has none, and the value never reaches the prompt.

**4. The ADK page agents import an unpublished module.** `shared_state_streaming_agent.py` (State Rendering, Shared State, State Streaming: a complete `LlmAgent` with `write_document`, `AGUIToolset()` and a `PredictStateMapping`) and `subagents_agent.py` (delegation tools + a root `LlmAgent`) both import `get_model` and `stop_on_terminal_text` from `agents.shared_chat`, which no page publishes. Both fail with `ModuleNotFoundError` and are kept verbatim, not served. [HITL Overview](https://docs.copilotkit.ai/vue/google-adk/human-in-the-loop) and [Programmatic Control](https://docs.copilotkit.ai/vue/google-adk/programmatic-control) also print `hitl_in_chat_agent.py`, a complete `LlmAgent` with `AGUIToolset()` that imports the same module, so it can't load either; its instruction targets `generate_task_steps`, which no Vue page on those routes registers. [Shared State](https://docs.copilotkit.ai/vue/google-adk/shared-state) also prints `shared_state_read_write_agent.py`, which is only the `LlmAgent(...)` call: no imports, and `_INSTRUCTION`, `set_notes` and `_inject_preferences` are never defined. Both are shown on their routes and are gaps (statuses unchanged). Even loaded, `shared_state_streaming_agent.py` writes `document`, while State Rendering's `ResearchProgress.vue` reads `status`, `completed`, `total` and `draft`, and Shared State lists `notes`. Sub-agents' "Rendering a live delegation log" publishes no Vue code.

**5. Interrupts.** [Pausing the Agent for Input](https://docs.copilotkit.ai/vue/google-adk/human-in-the-loop/useInterrupt) publishes `ApprovalPanel.vue` and an `App.vue` that imports a `MeetingChat.vue` it never publishes. [Headless Interrupts](https://docs.copilotkit.ai/vue/google-adk/human-in-the-loop/headless) publishes only an `App.vue` that imports a never-published `HeadlessInterruptPanel.vue`. Both are flagged stand-ins (the files can't compile without them). No ADK agent that interrupts is published, so no interrupt can fire.

**6. Undefined functions left undefined.** `searchOrders` (WebMCP: as published every call throws; the demo shows only a flagged stand-in sample, your choice), `executeSideEffect` (Governed Actions), and on the Components pages `useCartStore` (`./cart-store`) and `vueBasicCatalog`.

**7. Agent ids no page registers.** All → `my_agent` (§3).

**8. Threads: Intelligence quickstart runtime.** Wired per the [Vue ADK Intelligence quickstart](https://docs.copilotkit.ai/vue/google-adk/intelligence/quickstart). Its `authenticateApplicationUser` is never defined; per that page's "a fixed identity is suitable only for a local, single-user demo", it returns `local-user` / "Local user" (flagged, **not authentication**). Without `CPK_INTELLIGENCE_API_KEY` the path is plain SSE, and `GET /threads` returns 403. Restart the backend after `project select`.

**9. MCP Apps.** The placeholder server URL is replaced by the page's own `http://localhost:3101/mcp` example (`npm run mcp:apps`), on its own runtime path (labelled). Its never-defined `agent` is now the `/toolset` agent (§9.17).

**10. Type errors in published doc code** (`npm run type-check`, 9 errors): the `labels` prop is typed as literal default strings; `useRenderTool`, `useDefaultRenderTool` and `useHumanInTheLoop` reject render components that declare only the props they use; `searchOrders` ×2; Surfaces' `FeaturedProducts.vue` imports `../product`, a type module no page publishes. `npm run build` is `vite build`.

**11. Slots › Disclaimer never renders.** `CopilotChat`'s `#input` slot props don't include `showDisclaimer`, so the sample's `#disclaimer` slot is never drawn. Left as published.

**12. Fragments, stand-ins and wrappers.** Slots' fragments get imports only, and "Three levels" is nested in "Two levels". Headless UI's `RenderedMessages.vue` is mounted with `HeadlessChat.vue` as its composer. Shared State's two `SharedWorkspace.vue` fragments are merged. Stand-ins: `TimePickerCard.vue`, `MeetingChat.vue`, `HeadlessInterruptPanel.vue`, `CustomMessageView`, `CustomToolbarAction`, `BrandedToolCard`, `searchOrders` (on request). `HarnessApp.vue` mounts HITL's `MeetingApproval` beside a chat. **Shown only:** `agent.subscribe`, the watch-sources line, Headless Threads' pagination, `toggleItem`, useInterrupt's multi-interrupt template, and Governed Actions' type and `handleApproval`.

**13. Port 8000.** The Quickstart's `main.py` hard-codes `localhost:8000`. If something else already listens there, runs fail with `HTTP 404`. Use the `uvicorn … --port` alternative in §6.

**14. The harness itself.** There's no root `CopilotKitProvider`: each demo mounts its page's own `App.vue`. Doc sync runs as Vite dev-server middleware and diffs the `.md` of all 31 tracked pages (the 22 Vue pages and the nine Components pages), so changes to the landing runtime block or the ADK Quickstart are invisible to it. `npm run doc-files` re-reads both live.

**15. Catalog parsing bug, found and fixed (2026-11-13).** The block-catalog builder first recognised only backtick fences. Some pages print code in **tilde** fences (`~~~~python`), so `hitl_in_chat_agent.py` (HITL Overview, Programmatic Control) and `shared_state_read_write_agent.py` (Shared State) were invisible. The builder now reads both fence styles, as well as code the rendered page carries in RSC text chunks. Every generated file was regenerated and verified byte-identical. Neither newly visible file can run (§9.4), so no status changed.

**16. Generative UI › Components (added 2026-11-17).**
- **The pages.** The nine pages live under `/google-adk/generative-ui/components`, not `/vue`, and print each sample in React, Angular, React Native and Vue tabs. Only the Vue tab and untabbed code are used; tab membership is read from the snapshot's `<Tab value="Vue">` markup.
- **The agent.** The overview's Vue setup includes its own runtime: a TanStack `BuiltInAgent` (`@tanstack/ai`, `openaiText("gpt-6-luna")`, `convertInputToTanStackAI`). It's shown on the route and not served. The samples keep `runtime-url="/api/copilotkit"`, so they run on `default`, the ADK Quickstart agent (§3).
- **Gap: neither `render_ui` nor its guide reaches the model.** For a run that carries a catalog, the Copilot Runtime's generative-UI middleware adds `render_ui` to the run's tools and its guide (components, props, how to call the tool) to the run's context (`@copilotkit/runtime` 1.87.0). In `ag-ui-adk` 0.13.0, run tools are declared only to an agent whose tools include `AGUIToolset()` (its A2UI auto-injection is a separate path, on only when the runtime forwards `injectA2UITool`, which the harness runtime doesn't), and context goes to session state and run metadata, not the prompt (§9.3). **Run 2026-11-17** with a fake key (agent :8011, runtime :8221): Catalogs' run reached the agent, which logged `Frontend tools ['render_ui'] were sent with this run but the agent tree has no AGUIToolset, so they will not be declared to the model`, and then failed at Gemini on the key. No ADK page publishes an agent for these pages. **Since then, at your request, the samples that send `render_ui` run on the `/toolset` agent (§9.17), so the tool is declared.** The guide still isn't in the prompt: `render_ui`'s own description only says to follow it, so the model doesn't know the catalog. Getting the guide in would need an instruction that reads run context, which no page publishes (your call). Markdown mode stays broken.
- **What the harness wrote, all flagged:**
  - Five pages print only an opening `<CopilotKitProvider …>` line (Catalogs, Transports ×3, Markdown mode's `sendContext: false`, Adopt from A2UI's "After"). The harness adds the imports, a `<CopilotChat />` and the closing tag.
  - Three pages print a provider component with a `<slot />` (Standard catalog, Theming, Markdown mode's `App.vue`). The harness puts a `<CopilotChat />` in the slot.
  - Surfaces, Standard catalog's override and State and actions get small harness pages that put the published pieces together.
  - Two modules printed without imports (State and actions' `shop-ui.ts`, Adopt from A2UI's `app-ui.ts`) get only their import lines.
  - Surfaces' `FeaturedProducts.vue` imports `../shop-ui`, which that page never prints. The Catalogs page's `shop-ui.ts` (same `acme/shop@1`) and its two components are copied there, labelled.
  - The overview's plugin entry (`GenerativeUIChart`, `GenerativeUIMap`) is applied in the harness's `src/main.ts`, and `chart.js` and `maplibre-gl` are installed as the page says.
- **Stand-ins (flagged):** `ProductRow` (Surfaces), `Airport` and `Arrow` (Adopt from A2UI).
- **Shown only:** Catalogs' type-error demo and its `exportA2UICatalog` script; Surfaces' recommendations sample (`Product` type never published); State and actions' cart samples (`./cart-store` never published); Theming's `index.html` dark-mode script, since it would affect every route; Markdown mode's backend fragment (`MY_PROMPT` undefined); Adopt from A2UI's "Before" (`vueBasicCatalog` undefined).

**17. `AGUIToolset()` agent for the routes that send frontend tools (added 2026-11-17, at your request: "add AGUIToolset in google-adk sections that need them and flag it").**
- **Agent:** `agent/harness_app.py` builds a second `LlmAgent` from the Quickstart's own arguments plus `tools=[AGUIToolset()]` (imported as the doc set's `shared_state_streaming_agent.py` imports it). It wraps it with the Quickstart's `ADKAgent` arguments and mounts it at `/toolset`. `main.py` is untouched, and the Quickstart and every other route still run the verbatim Quickstart agent.
- **Runtime:** `backend/runtimes/toolset.ts` serves `default` = the landing page's `HttpAgent` pointed at `/toolset`, at `/api/copilotkit-toolset`. MCP Apps' runtime already supplied the page's never-defined `agent`, which is now `toolsetAgent()`, so no doc file changed there.
- **Routes moved** (each `runtime-url` changed, with the published value kept in a `[harness]` comment): Frontend Tools, Components as Tools, Governed Actions (generated by `write-doc-files.py`); and the Components overview (`http://localhost:8200/api/copilotkit-toolset`, published host kept), Catalogs, Surfaces, Standard catalog, Theming, Transports › tool, and Adopt from A2UI (generated by `write-genui-files.py`). Hand-edited harness providers: HITL's `HarnessApp.vue`, Standard catalog's `override/HarnessOverride.vue`, and State and actions' `HarnessApp.vue`. Not moved, because they send no frontend tool: Markdown mode, Transports › markdown and `agentIds`, and WebMCP (no chat).
- **Verified 2026-11-17** with a fake key, routing the Gemini client to a local capture server with `GOOGLE_GEMINI_BASE_URL`. The captured model requests declared `filter_incidents`, `show_weather`, `schedule_meeting`, `approve_governed_action` and `render_ui` on their routes. Markdown mode's request carried no tools. Not yet driven against a live model, and MCP Apps wasn't driven with its server running.
- **Still gaps:** context (Agent Read-Only Context, the Components guide) still doesn't reach the prompt (§9.3, §9.16).
- **Doc drift seen during this change:** `npm run doc-files` now fails its live render check. The live Slots page has been rewritten, and many blocks, including the Components pages and the landing runtime block, no longer match the rendered pages. The snapshot wasn't refreshed in this change (that's a doc sync). The generated files were rewritten from the unchanged snapshot, and only the intended `runtime-url` lines changed.

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Connection refused, or `RUN_ERROR` naming the agent URL | Agent not running, or `AGENT_URL` unset | Start terminal 1; set `AGENT_URL` in `backend/.env`; restart the backend. |
| `RUN_ERROR "HTTP 404"` | Another server holds port 8000 | §6: run on another port and update `AGENT_URL`. |
| `RUN_ERROR "400 Bad Request … API key not valid"` | `GOOGLE_API_KEY` missing or wrong in **`agent/.env`** | Fix it and restart the agent with `--env-file .env`. |
| Tool Rendering answers in prose | Agent started with `main.py`, so there's no `/tool-rendering` | Start `harness_app.py`. |
| Agent log: "Frontend tools … will not be declared to the model" | A frontend-tool route ran on the Quickstart agent | Start the agent with `harness_app.py` so `/toolset` exists (§9.17); expected only on Markdown mode's routes. |
| `/frontend-tools` etc. fail with `HTTP 404` on `/toolset` | Agent started with `main.py` | Start `harness_app.py`. |
| CORS error on `/quickstart` or `/generative-ui/components` | Those `App.vue` files call `:8200` directly | Keep `cors: true`. |
| Threads stay on "Loading threads…" | Runtime started before the key existed (SSE → 403) | Restart the backend; the startup line must say `(intelligence)`. |
| `Port 5173 is in use` | Another harness's Vite | Stop it (one harness at a time on 5173/8200). |

---

## Doc drift detection

`/doc-sync` fetches the `.md` behind all 31 tracked pages, diffs each against `doc-snapshot/pages/`, replaces the snapshot, and ranks changes High/Medium/Low. Commit `pages/`, `manifest.json` and `CHANGELOG.md`; `reports/` is gitignored. **Regenerating the doc files:** `cd frontend && npm run doc-files` rebuilds the block catalog (snapshot pages, plus the ADK Quickstart fetched live, every block checked against the rendered page). It then rewrites the verbatim doc files (`write-genui-files.py` writes the Components routes' files), `src/lib/published.json`, `agent/main.py` and `agent/src/agents/*.py`. It doesn't touch `harness_app.py` or the stand-ins.

---

## 11. Project structure

```
google-adk/
├── CLAUDE.md · PR_GUIDELINES.md · README.md · .env.example
├── doc-snapshot/                    # pages/*.md + manifest.json — doc-sync baseline
├── agent/                           # ADK (Python, uv) — FastAPI :8000
│   ├── main.py                      # ★ ADK Quickstart agent, verbatim
│   ├── harness_app.py               # [harness] main.app + /tool-rendering + /toolset (AGUIToolset) — what you run
│   └── src/agents/
│       ├── tool_rendering_common.py       # verbatim — get_weather (used)
│       ├── shared_state_streaming_agent.py # verbatim — not served (§9.4)
│       └── subagents_agent.py              # verbatim — not served (§9.4)
├── backend/                         # Copilot Runtime, Node :8200
│   ├── server.ts                    # ★ Vue Quickstart host + landing runtime
│   ├── agents.ts                    # HttpAgent per doc agent id
│   └── runtimes/ threads.ts · mcp-apps.ts · tool-rendering.ts · toolset.ts
└── frontend/                        # Vite + Vue 3
    ├── scripts/ build-doc-catalog.py · write-doc-files.py · write-genui-files.py · write-demo-entries.py
    └── src/ lib/nav-config.ts (★ routes + statuses) · routes/<doc path>/{Notes.vue, demo-chat/} · …
```

---

## 12. References

**Getting Started**: [Quickstart (landing)](https://docs.copilotkit.ai/vue/google-adk) · [Vue Quickstart (frontend steps)](https://docs.copilotkit.ai/vue) · [ADK Quickstart (agent)](https://docs.copilotkit.ai/google-adk/quickstart)

**Basics**: [Prebuilt Components](https://docs.copilotkit.ai/vue/google-adk/prebuilt-components) · [Slots](https://docs.copilotkit.ai/vue/google-adk/custom-look-and-feel/slots) · [Headless UI](https://docs.copilotkit.ai/vue/google-adk/custom-look-and-feel/headless-ui) · [Programmatic Control](https://docs.copilotkit.ai/vue/google-adk/programmatic-control) · [Threads Drawer](https://docs.copilotkit.ai/vue/google-adk/prebuilt-components/copilot-threads-drawer) · [Headless Threads](https://docs.copilotkit.ai/vue/google-adk/headless-threads) · [Frontend Tools](https://docs.copilotkit.ai/vue/google-adk/frontend-tools)

**Generative UI**: [Components as Tools](https://docs.copilotkit.ai/vue/google-adk/generative-ui/tool-based) · [Tool Call Rendering](https://docs.copilotkit.ai/vue/google-adk/generative-ui/tool-rendering) · [State Rendering](https://docs.copilotkit.ai/vue/google-adk/generative-ui/state-rendering) · [MCP Apps](https://docs.copilotkit.ai/vue/google-adk/generative-ui/mcp-apps)

**Generative UI › Components**: [Components and surfaces](https://docs.copilotkit.ai/google-adk/generative-ui/components) · [Surfaces](https://docs.copilotkit.ai/google-adk/generative-ui/components/surfaces) · [Catalogs](https://docs.copilotkit.ai/google-adk/generative-ui/components/catalogs) · [Standard catalog](https://docs.copilotkit.ai/google-adk/generative-ui/components/standard-catalog) · [State and actions](https://docs.copilotkit.ai/google-adk/generative-ui/components/state-and-actions) · [Theming](https://docs.copilotkit.ai/google-adk/generative-ui/components/theming) · [Transports](https://docs.copilotkit.ai/google-adk/generative-ui/components/transports) · [Markdown mode](https://docs.copilotkit.ai/google-adk/generative-ui/components/markdown-mode) · [Adopt from A2UI](https://docs.copilotkit.ai/google-adk/generative-ui/components/from-a2ui)

**Interactivity**: [Shared State](https://docs.copilotkit.ai/vue/google-adk/shared-state) · [Render agent state in your app](https://docs.copilotkit.ai/vue/google-adk/shared-state/rendering-in-app) · [State Streaming](https://docs.copilotkit.ai/vue/google-adk/shared-state/streaming) · [Agent Read-Only Context](https://docs.copilotkit.ai/vue/google-adk/shared-state/agent-readonly) · [HITL Overview](https://docs.copilotkit.ai/vue/google-adk/human-in-the-loop) · [Pausing the Agent for Input](https://docs.copilotkit.ai/vue/google-adk/human-in-the-loop/useInterrupt) · [Headless Interrupts](https://docs.copilotkit.ai/vue/google-adk/human-in-the-loop/headless) · [Governed Action Approval UI](https://docs.copilotkit.ai/vue/google-adk/human-in-the-loop/governed-actions) · [WebMCP](https://docs.copilotkit.ai/vue/google-adk/webmcp)

**Agent capabilities**: [Sub-agents](https://docs.copilotkit.ai/vue/google-adk/multi-agent/subagents)

**Intelligence (Threads routes)**: [Connect Intelligence in 5 minutes](https://docs.copilotkit.ai/vue/google-adk/intelligence/quickstart)
