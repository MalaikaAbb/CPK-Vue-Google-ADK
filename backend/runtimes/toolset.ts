import { CopilotRuntime } from "@copilotkit/runtime/v2";

import { toolsetAgent } from "../agents";

/**
 * [harness] The runtime behind the routes that send frontend tools, mounted at
 * /api/copilotkit-toolset (added 2026-11-17, at the user's request: "add
 * AGUIToolset in google-adk sections that need them and flag it").
 *
 * Those samples use no agent-id, i.e. `default` — the same id every other
 * route uses for the landing page's my_agent. Here `default` is the landing
 * page's HttpAgent pointed at agent/harness_app.py's /toolset: the Quickstart
 * agent plus AGUIToolset(), so ag-ui-adk declares the run's frontend tools to
 * the model (README §9.3, §9.17). The routes' runtime-urls are changed to this
 * path, with the published value kept as a comment beside each.
 */
export function createToolsetRuntime(): CopilotRuntime {
  return new CopilotRuntime({
    agents: { default: toolsetAgent() },
  });
}
