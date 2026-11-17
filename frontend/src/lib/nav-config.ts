/**
 * The nav, the route headers, the /status table and the doc sync all read from
 * here, so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under https://docs.copilotkit.ai/vue/google-adk,
 * minus that prefix. Groups and folders mirror that sidebar's separators and
 * folders as of the doc sync recorded in doc-snapshot/manifest.json.
 *
 * Pure TypeScript, no Vue imports: the doc-sync Vite plugin imports this file
 * on the Node side too.
 *
 * Statuses reflect code inspection, mount checks and a fake-key end-to-end
 * run — no route has been driven against a live model yet (README §8).
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/vue/google-adk";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};

export interface RouteMeta {
  path: string;
  title: string;
  /** Path under docs.copilotkit.ai, e.g. `/vue/frontend-tools`. */
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  /** The doc sidebar folder the page sits in, under its group's separator. */
  folder?: string;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
  /** Harness-only page, not a doc page (no doc-sync target). */
  harness?: boolean;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/vue/google-adk",
        summary: "What this harness covers, how the pieces fit, and the agent roster.",
        status: "reference",
        statusNote: "Landing page — orientation and doc-drift summary.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        title: "Quickstart",
        docPath: "/vue/google-adk",
        summary:
          "A Vite Vue app with CopilotChat, a Node Copilot Runtime registering the landing page's HttpAgent, and the ADK Quickstart's FastAPI agent.",
        status: "working",
        statusNote:
          "Vue Quickstart host + ADK landing runtime (HttpAgent my_agent \u2192 AGENT_URL) \u2192 ADK Quickstart agent (Gemini, FastAPI :8000). Wiring verified end to end with a fake key.",
      },
    ],
  },
  {
    title: "Basics",
    routes: [
      {
        path: "/prebuilt-components",
        hasDemo: true,
        folder: "Chat",
        title: "Prebuilt Components",
        docPath: "/vue/google-adk/prebuilt-components",
        summary:
          "The drop-in CopilotChat, as the page's only published code sample, against agent `my-agent`.",
        status: "working",
        statusNote:
          "CopilotSidebar, CopilotPopup and useConfigureSuggestions are named but have no code on this page.",
      },
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Slots",
        docPath: "/vue/google-adk/custom-look-and-feel/slots",
        summary:
          "Vue named and scoped slots on CopilotChat: welcome screen, assistant toolbar, disclaimer, class/props on leaves, custom components, nested slots, labels.",
        status: "partial",
        statusNote:
          "Most samples are template fragments; imports were added to mount them. CustomMessageView and CustomToolbarAction are flagged stand-ins. The disclaimer sample never shows its disclaimer (doc bug, README §9).",
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Headless UI",
        docPath: "/vue/google-adk/custom-look-and-feel/headless-ui",
        summary:
          "A chat with no CopilotKit chrome built from useAgent + useCopilotKit, and the complete variant composed from public message leaves.",
        status: "working",
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Programmatic Control",
        docPath: "/vue/google-adk/programmatic-control",
        summary:
          "Run and stop agent `sales` from buttons with agent.addMessage + copilotkit.runAgent, no chat UI.",
        status: "working",
        statusNote:
          "The page renders no output, so the default sample adds a CopilotChat on the same agent (harness, on request). The agent.subscribe sample is a fragment and is shown, not mounted.",
      },
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        folder: "Chat › Threads",
        title: "Threads Drawer",
        docPath: "/vue/google-adk/prebuilt-components/copilot-threads-drawer",
        summary:
          "CopilotThreadsDrawer beside CopilotChat under a shared CopilotChatConfigurationProvider, plus the toolbar-button, controlled and customization samples.",
        status: "partial",
        statusNote:
          "Intelligence wired per the Vue Intelligence quickstart, with its fixed local-demo identity. Needs CPK_INTELLIGENCE_API_KEY; not yet verified against a live project (README §9).",
      },
      {
        path: "/headless-threads",
        hasDemo: true,
        folder: "Chat › Threads",
        title: "Headless Threads",
        docPath: "/vue/google-adk/headless-threads",
        summary:
          "useThreads with a hand-built list — select, rename, archive, delete — beside CopilotChat.",
        status: "partial",
        statusNote:
          "Same Intelligence runtime as the Threads Drawer. Needs CPK_INTELLIGENCE_API_KEY; not yet verified against a live project (README §9).",
      },
      {
        path: "/frontend-tools",
        hasDemo: true,
        title: "Frontend Tools",
        docPath: "/vue/google-adk/frontend-tools",
        summary:
          "useFrontendTool registers `filter_incidents`; the agent calls it and the handler updates a Vue ref in the browser.",
        status: "working",
        statusNote:
          "Frontend tool runs on /api/copilotkit-toolset: the Quickstart agent + AGUIToolset() (flagged, at your request; README \u00a79.17). A fake-key capture showed filter_incidents declared to the model; not yet driven against a live model.",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/tool-based",
        hasDemo: true,
        folder: "Controlled",
        title: "Components as Tools",
        docPath: "/vue/google-adk/generative-ui/tool-based",
        summary:
          "useComponent exposes WeatherCard to the agent as `show_weather`; the agent's arguments become the card's props.",
        status: "working",
        statusNote:
          "Frontend tool runs on /api/copilotkit-toolset: the Quickstart agent + AGUIToolset() (flagged, at your request; README \u00a79.17). A fake-key capture showed show_weather declared; not yet driven against a live model.",
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        folder: "Controlled",
        title: "Tool Call Rendering",
        docPath: "/vue/google-adk/generative-ui/tool-rendering",
        summary:
          "useDefaultRenderTool (zero-config and custom catch-all) and a per-tool useRenderTool for `get_weather`.",
        status: "partial",
        statusNote:
          "The page publishes get_weather but no agent; at the user's request a flagged harness agent (Quickstart arguments + the tool) is served at /tool-rendering, on its own runtime path (README \u00a79).",
      },
      {
        path: "/generative-ui/state-rendering",
        hasDemo: true,
        folder: "Controlled",
        title: "State Rendering",
        docPath: "/vue/google-adk/generative-ui/state-rendering",
        summary:
          "ResearchProgress reads agent `researcher`'s state through useAgent and renders status, progress and draft.",
        status: "broken",
        statusNote:
          "The page's agent (shared_state_streaming_agent.py) imports an unpublished agents.shared_chat module and cannot load; `researcher` writes no state (README \u00a79).",
      },
      {
        path: "/generative-ui/mcp-apps",
        hasDemo: true,
        folder: "Open-ended",
        title: "MCP Apps",
        docPath: "/vue/google-adk/generative-ui/mcp-apps",
        summary:
          "mcpApps.servers on the runtime; the built-in MCPAppsActivityRenderer draws the server's UI resource in a sandboxed iframe.",
        status: "partial",
        statusNote:
          "MCP Apps' runtime now uses the /toolset agent (Quickstart + AGUIToolset(), flagged; README \u00a79.17), so the MCP server's tools are declared. Needs `npm run mcp:apps`; not yet driven with the server running.",
      },
      {
        path: "/generative-ui/components",
        hasDemo: true,
        folder: "Components",
        title: "Components and surfaces",
        docPath: "/google-adk/generative-ui/components",
        summary: "Let the agent render your own components, in the chat and in named areas of the page.",
        status: "partial",
        statusNote:
          "App.vue verbatim with the chart/map plugins. render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16).",
      },
      {
        path: "/generative-ui/components/surfaces",
        hasDemo: true,
        folder: "Components",
        title: "Surfaces",
        docPath: "/google-adk/generative-ui/components/surfaces",
        summary: "Render generated UI in the chat or in named page targets the chat can change.",
        status: "partial",
        statusNote:
          "FeaturedProducts + error-boundary provider mounted; ProductRow is a flagged stand-in. render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16).",
      },
      {
        path: "/generative-ui/components/catalogs",
        hasDemo: true,
        folder: "Components",
        title: "Catalogs",
        docPath: "/google-adk/generative-ui/components/catalogs",
        summary: "Declare the components the agent may render, with typed props, in one catalog.",
        status: "partial",
        statusNote:
          "Catalog + components verbatim; the provider line is wrapped with a chat (harness). render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16).",
      },
      {
        path: "/generative-ui/components/standard-catalog",
        hasDemo: true,
        folder: "Components",
        title: "Standard catalog",
        docPath: "/google-adk/generative-ui/components/standard-catalog",
        summary: "Use the standard components, drop some, and replace others with your own.",
        status: "partial",
        statusNote:
          "standardUI provider and a Card override mounted. render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16).",
      },
      {
        path: "/generative-ui/components/state-and-actions",
        hasDemo: true,
        folder: "Components",
        title: "State and actions",
        docPath: "/google-adk/generative-ui/components/state-and-actions",
        summary: "Bind live app data into generated UI, run code on clicks, keep what users type.",
        status: "partial",
        statusNote:
          "shopUI functions/events + ProductCard mounted; the handler needs ./cart-store, never published. render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16).",
      },
      {
        path: "/generative-ui/components/theming",
        hasDemo: true,
        folder: "Components",
        title: "Theming",
        docPath: "/google-adk/generative-ui/components/theming",
        summary: "Give the standard components your colors and fonts, and dark mode.",
        status: "partial",
        statusNote:
          "Themed provider mounted. render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16).",
      },
      {
        path: "/generative-ui/components/transports",
        hasDemo: true,
        folder: "Components",
        title: "Transports",
        docPath: "/google-adk/generative-ui/components/transports",
        summary: "Choose how the agent sends generated UI: the render_ui tool or markdown.",
        status: "partial",
        statusNote:
          "Tool variant: render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16). Markdown and agentIds variants send no render_ui and stay on the Quickstart agent (guide not in the prompt).",
      },
      {
        path: "/generative-ui/components/markdown-mode",
        hasDemo: true,
        folder: "Components",
        title: "Markdown mode",
        docPath: "/google-adk/generative-ui/components/markdown-mode",
        summary: "The agent writes UI inside its markdown reply, in a2ui code blocks.",
        status: "broken",
        statusNote:
          "Provider + slot and sendContext: false variants mounted; the sendContext: false guide travels in forwarded props, which no published ADK code reads. Gap: no AGUIToolset on the ADK Quickstart agent, so render_ui is never declared to the model, and its guide (context) stays out of the prompt (README \u00a79.3, \u00a79.16).",
      },
      {
        path: "/generative-ui/components/from-a2ui",
        hasDemo: true,
        folder: "Components",
        title: "Adopt from A2UI",
        docPath: "/google-adk/generative-ui/components/from-a2ui",
        summary: "Move an app from the a2ui renderer to components and surfaces.",
        status: "partial",
        statusNote:
          "The After provider + appUI mounted; Airport and Arrow are flagged stand-ins. render_ui runs on /api/copilotkit-toolset (Quickstart + AGUIToolset(), flagged; README \u00a79.17) and was declared in a fake-key capture, but its guide (context) still stays out of the prompt, so the model doesn't know the catalog (README \u00a79.16).",
      },
    ],
  },
  {
    title: "Interactivity",
    routes: [
      {
        path: "/shared-state",
        hasDemo: true,
        folder: "Shared state",
        title: "Shared State",
        docPath: "/vue/google-adk/shared-state",
        summary:
          "Read agent `workspace`'s state with useAgent and write it back with setState from a button.",
        status: "partial",
        statusNote:
          "Read + tone write-back wired; the page's agent cannot load (unpublished agents.shared_chat), so nothing writes notes (README \u00a79).",
      },
      {
        path: "/shared-state/rendering-in-app",
        hasDemo: true,
        folder: "Shared state",
        title: "Render agent state in your app",
        docPath: "/vue/google-adk/shared-state/rendering-in-app",
        summary:
          "A canvas outside the chat seeds and renders `default`'s state; the chat and the canvas share one agent.",
        status: "partial",
        statusNote:
          "The Canvas seeds and renders state, but the Quickstart agent has no tools, so it cannot write title/items (README \u00a79).",
      },
      {
        path: "/shared-state/streaming",
        hasDemo: true,
        folder: "Shared state",
        title: "State Streaming",
        docPath: "/vue/google-adk/shared-state/streaming",
        summary:
          "StreamingDocument renders agent `writer`'s `document` state with a LIVE indicator while the run streams.",
        status: "broken",
        statusNote:
          "The page's agent imports an unpublished agents.shared_chat module and cannot load; `writer` streams no state (README \u00a79).",
      },
      {
        path: "/shared-state/agent-readonly",
        hasDemo: true,
        folder: "Shared state",
        title: "Agent Read-Only Context",
        docPath: "/vue/google-adk/shared-state/agent-readonly",
        summary:
          "useAgentContext publishes the active workspace id to the agent as read-only context.",
        status: "broken",
        statusNote:
          "The ADK adapter stores context in session state, not the prompt, and the Quickstart agent's fixed instruction never reads it (README \u00a79).",
      },
      {
        path: "/human-in-the-loop",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "HITL Overview",
        docPath: "/vue/google-adk/human-in-the-loop",
        summary:
          "useHumanInTheLoop registers `schedule_meeting`; the agent's call renders a time picker that answers with `respond`.",
        status: "partial",
        statusNote:
          "schedule_meeting runs on /api/copilotkit-toolset: the Quickstart agent + AGUIToolset() (flagged, at your request; README \u00a79.17); a fake-key capture showed it declared. TimePickerCard.vue is a flagged stand-in; not yet driven against a live model.",
      },
      {
        path: "/human-in-the-loop/useInterrupt",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "Pausing the Agent for Input",
        docPath: "/vue/google-adk/human-in-the-loop/useInterrupt",
        summary:
          "useInterrupt with renderInChat: false — an Approve / Cancel panel for runtime interrupts.",
        status: "broken",
        statusNote:
          "No ADK agent that interrupts is published; MeetingChat.vue is never published (flagged stand-in) (README \u00a79).",
      },
      {
        path: "/human-in-the-loop/headless",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "Headless Interrupts",
        docPath: "/vue/google-adk/human-in-the-loop/headless",
        summary: "Resolving interrupts from a panel with no chat mounted.",
        status: "broken",
        statusNote:
          "The page publishes only App.vue; HeadlessInterruptPanel.vue is a flagged stand-in, and no interrupting agent is published (README \u00a79).",
      },
      {
        path: "/human-in-the-loop/governed-actions",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "Governed Action Approval UI",
        docPath: "/vue/google-adk/human-in-the-loop/governed-actions",
        summary:
          "An approval card for `approve_governed_action` that auto-resolves allow/deny verdicts and asks on require_approval.",
        status: "partial",
        statusNote:
          "Tool half: approve_governed_action runs on /api/copilotkit-toolset: the Quickstart agent + AGUIToolset() (flagged, at your request; README \u00a79.17); a fake-key capture showed it declared. Interrupt half: no interrupting agent is published (README \u00a79.5).",
      },
      {
        path: "/webmcp",
        hasDemo: true,
        title: "WebMCP",
        docPath: "/vue/google-adk/webmcp",
        summary:
          "A frontend tool mirrored to document.modelContext, via useFrontendTool and via CopilotKitCore directly.",
        status: "partial",
        statusNote:
          "Demo shows only OrderSearch.vue with a flagged searchOrders stand-in (user's choice); calls return sample orders. As published, searchOrders is never defined and every call errors (README §9.9). webmcp.ts is shown, not mounted.",
      },
    ],
  },
  {
    title: "Agent capabilities",
    routes: [
      {
        path: "/multi-agent/subagents",
        title: "Sub-agents",
        docPath: "/vue/google-adk/multi-agent/subagents",
        summary:
          "Supervisor → research / writing / critique sub-agents with a live delegation log.",
        status: "broken",
        statusNote:
          "subagents_agent.py imports an unpublished agents.shared_chat module and cannot load; no Vue delegation log is published (README \u00a79).",
      },
    ],
  },
  {
    title: "Harness",
    routes: [
      {
        path: "/status",
        title: "Status overview",
        docPath: "/vue/google-adk",
        summary: "Every route, its doc page and its status in one table.",
        status: "reference",
        harness: true,
      },
      {
        path: "/doc-sync",
        title: "Doc sync",
        docPath: "/vue/google-adk",
        summary:
          "Re-fetch the markdown behind every tracked doc page, diff it against doc-snapshot/, and replace the snapshot.",
        status: "reference",
        harness: true,
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

/** Doc routes only — what doc sync fetches. */
export const DOC_ROUTES: RouteMeta[] = ALL_ROUTES.filter((r) => !r.harness);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}
