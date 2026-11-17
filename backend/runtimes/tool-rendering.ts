import { CopilotRuntime } from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

/**
 * [harness] The runtime behind /generative-ui/tool-rendering, mounted at
 * /api/copilotkit-tool-rendering.
 *
 * The Tool Rendering samples use no agent-id, i.e. `default` — the same id
 * every other route uses for the landing page's my_agent. To give this page
 * its own backend (agent/harness_app.py mounts an ADK agent built from the
 * page's published get_weather at /tool-rendering, at the user's request),
 * `default` here is the landing page's HttpAgent pointed at that path. The
 * page's three App.vue copies have their runtime-url changed to this path,
 * with the published value kept as a comment.
 */
export function createToolRenderingRuntime(): CopilotRuntime {
  return new CopilotRuntime({
    agents: {
      default: new HttpAgent({ url: new URL("tool-rendering", process.env.AGENT_URL!).toString() }),
    },
  });
}
