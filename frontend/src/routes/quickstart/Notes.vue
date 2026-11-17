<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/quickstart" />

  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      The whole stack, assembled from the three places the docs put it: the Vue app from the Vue Quickstart (<code>App.vue</code> with
      <code>CopilotChat</code>), the runtime from the ADK landing page (an AG-UI <code>HttpAgent</code> named <code>my_agent</code>
      pointed at <code>AGENT_URL</code>) hosted in the Vue Quickstart's Node <code>server.ts</code>, and the agent from the ADK
      Quickstart (<code>main.py</code>: an ADK <code>LlmAgent</code> wrapped in <code>ADKAgent</code>, served by FastAPI). Three
      processes: the agent on :8000, the runtime on :8200, Vite on :5173.
    </p>
    <div class="mt-4">
      <TryIt
        :prompts="['Hello! What can you do?', 'Write a haiku about rivers.']"
        expect="A streamed reply from the ADK agent (Gemini); the Inspector's AG-UI Events show RUN_STARTED → TEXT_MESSAGE_* → RUN_FINISHED."
        fail="Connection refused or RUN_ERROR — the agent is not running on :8000 or AGENT_URL is unset; an API-key error — GOOGLE_API_KEY missing in agent/.env."
      />
    </div>
  </Panel>

  <Panel title="The demo" description="Verbatim src/App.vue from the Vue Quickstart, which the ADK Vue Quickstart's .md is.">
    <SourceCode file="frontend/src/routes/quickstart/demo-chat/App.vue" />
  </Panel>

  <Panel title="The runtime, as published on the ADK landing page" description="Its only code block — a Next.js route.">
    <PublishedCode page="index" :index="9" />
  </Panel>

  <Panel title="This repo's runtime" description="The Vue Quickstart's Node host with the landing page's agent registration; additions marked [harness].">
    <div class="space-y-4">
      <SourceCode file="backend/server.ts" />
      <SourceCode file="backend/agents.ts" />
    </div>
  </Panel>

  <Panel title="The agent — ADK Quickstart, “Use an existing agent”" description="main.py verbatim; this repo serves it through agent/harness_app.py, which imports main.app unchanged and adds Tool Rendering's endpoint.">
    <div class="space-y-4">
      <SourceCode file="agent/main.py" />
      <SourceCode file="agent/harness_app.py" />
    </div>
  </Panel>

  <Panel title="The Vue Quickstart's server.ts and main.ts, as published">
    <div class="space-y-4">
      <PublishedCode page="index" :index="4" note="Host only — its BuiltInAgent registration is replaced by the landing page's HttpAgent, as the Vue Quickstart itself instructs for an existing agent." />
      <PublishedCode page="index" :index="5" />
    </div>
  </Panel>

  <Callout tone="harness" title="How the three sources fit (README §3, §9.1)">
    <p>· <strong>The Vue ADK Quickstart redirects to a landing page.</strong> Its .md is the built-in Vue Quickstart, which says: if you already have an agent, keep its Vue frontend steps and take the runtime wiring from your framework's quickstart.</p>
    <p>· <strong>The landing page</strong> publishes only the runtime route (<code>my_agent: new HttpAgent({ url: process.env.AGENT_URL! })</code>), as a Next.js route; a Vue app has no Next route, so it is hosted in the Vue Quickstart's Node listener.</p>
    <p>· <strong>The agent</strong> is from the ADK Quickstart the landing page links as its guide: the “Use an existing agent” path — <code>LlmAgent</code> (<code>gemini-3.8-flash</code>) → <code>ADKAgent</code> → <code>add_adk_fastapi_endpoint(app, …, path="/")</code>.</p>
    <p>· The runtime also registers the doc agent ids (<code>backend/agents.ts</code>); each is <code>my_agent</code>.</p>
  </Callout>

  <Callout tone="warn" title="What this agent can and cannot do (README §3)">
    <p>The <code>ag-ui-adk</code> adapter declares a run's frontend tools only to agents that include <code>AGUIToolset()</code>, and keeps read-only context in session state rather than the prompt. The Quickstart agent has neither, so context is a gap (README §9.3); the routes that send frontend tools run on a flagged harness agent that adds <code>AGUIToolset()</code> (README §9.17), while this route keeps the verbatim agent. It has no backend tools, writes no shared state and never interrupts.</p>
  </Callout>
</template>
