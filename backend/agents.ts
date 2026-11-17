import { HttpAgent } from "@ag-ui/client";

/**
 * Agents for every runtime in this repo.
 *
 * `myAgent()` is the agent the ADK landing page registers
 * (https://docs.copilotkit.ai/vue/google-adk — its only code block), verbatim:
 * an AG-UI HttpAgent pointed at AGENT_URL, where the ADK Quickstart's FastAPI
 * app (agent/main.py: LlmAgent → ADKAgent → add_adk_fastapi_endpoint at "/")
 * serves the agent.
 *
 * [harness] Doc agent ids. The landing page registers only `my_agent`, while
 * the Vue samples use `default` (no agent-id) and ids no page registers. By the
 * user's rules a page's own published agent would run under its id if it were
 * complete — but the ADK page agents (shared_state_streaming_agent.py,
 * subagents_agent.py) import an unpublished `agents.shared_chat` module and
 * cannot load. So every id is the landing page's my_agent, unchanged.
 */
export function myAgent() {
  // Verbatim from the landing page's runtime route.
  return new HttpAgent({ url: process.env.AGENT_URL! });
}

/**
 * [harness] The landing page's HttpAgent pointed at agent/harness_app.py's
 * /toolset: the Quickstart agent plus AGUIToolset(), for the routes that send
 * frontend tools (README §9.17).
 */
export function toolsetAgent() {
  return new HttpAgent({ url: new URL("toolset", process.env.AGENT_URL!).toString() });
}

/** Doc agent ids, and the page each one comes from. */
export const DOC_AGENT_IDS = {
  default: "no agent-id: Quickstart, Slots, Frontend Tools, Components as Tools, …",
  "my-agent": "Prebuilt Components, Headless UI, Headless Threads",
  sales: "Programmatic Control",
  support: "Threads Drawer",
  researcher: "State Rendering",
  workspace: "Shared State",
  writer: "State Streaming",
} as const;

export function docAgents() {
  return Object.fromEntries(Object.keys(DOC_AGENT_IDS).map((id) => [id, myAgent()]));
}
