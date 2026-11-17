<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/tool-rendering/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/tool-rendering" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      Three ways to draw a tool call — the built-in <code>*</code> renderer, a custom catch-all, and a per-tool <code>useRenderTool</code> for
      <code>get_weather</code> — against the page's own backend tool, <code>get_weather</code>.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['What is the weather in Tokyo?']" expect="Per-tool: “Checking Tokyo” while the call runs, then the city and the tool's JSON result (68°, Sunny). Zero-config: a status card with arguments and result. Catch-all: the BrandedToolCard stand-in." fail="A prose answer with no card — the agent is not serving /tool-rendering (run harness_app.py, not main.py), or the route is not on /api/copilotkit-tool-rendering." />
    </div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/default/components/AgentExperience.vue`" />
      <SourceCode :file="`${D}/per-tool/components/WeatherToolCard.vue`" />
      <SourceCode :file="`${D}/per-tool/components/AgentExperience.vue`" />
      <SourceCode :file="`${D}/per-tool/App.vue`" note="The same published App.vue is copied into each variant directory; runtime-url changed (see below)." />
    </div>
  </Panel>
  <Panel title="The backend — published tool, harness-built agent">
    <div class="space-y-4">
      <SourceCode file="agent/src/agents/tool_rendering_common.py" note="Verbatim. Defines get_weather only; no agent." />
      <SourceCode file="agent/harness_app.py" />
      <SourceCode file="backend/runtimes/tool-rendering.ts" />
    </div>
  </Panel>
  <Panel title="Custom catch-all" description="The page prints only one line for this file.">
    <div class="space-y-4">
      <PublishedCode page="generative-ui__tool-rendering" :index="1" />
      <SourceCode :file="`${D}/catch-all/components/AgentExperience.vue`" />
      <SourceCode :file="`${D}/catch-all/components/BrandedToolCard.vue`" />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <PublishedCode page="generative-ui__tool-rendering" :index="4" note="Fragment: `parameters` and `locale` are never declared." />
  </Panel>
  <Callout tone="harness" title="What the harness added (README §9)">
    <p>· <strong>The agent</strong>, at your request (“define the tools if they are given”): <code>harness_app.py</code> builds an <code>LlmAgent</code> from the ADK Quickstart's own arguments plus <code>tools=[get_weather]</code>, wraps it with the Quickstart's <code>ADKAgent</code> arguments, and mounts it at <code>/tool-rendering</code> beside the Quickstart's <code>/</code>.</p>
    <p>· <strong>Its own runtime path</strong>: the samples use <code>default</code>, which every route shares, so <code>/api/copilotkit-tool-rendering</code> serves this agent as <code>default</code> and the three <code>App.vue</code> copies point there (published value kept as a comment).</p>
    <p>· The catch-all <code>AgentExperience.vue</code> wraps the published line; <code>BrandedToolCard</code> is a stand-in — never published.</p>
  </Callout>
</template>
