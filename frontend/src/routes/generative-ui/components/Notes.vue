<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">The overview's Vue setup: a provider given the standard catalog (<code>:generativeUI=&quot;{ ui: standardUI }&quot;</code>) and a plain <code>CopilotChat</code>; the agent answers visual questions by rendering standard components.</p>
    <div class="mt-4"><TryIt :prompts="['Compare the Starter, Team, and Enterprise plans in a table']" expect="A table component fills in inside the chat; a follow-up such as “add a column for support” changes it in place." fail="A prose answer and no component: the model did not call render_ui, or the run errored (check the Inspector)." /></div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/App.vue`" note="Vue tab, verbatim (runtime-url http://localhost:8200/api/copilotkit)." />
    </div>
  </Panel>
  <Panel title="Published for Vue, not mounted">
    <div class="space-y-4">
      <PublishedCode page="google-adk__generative-ui__components" :index="26" note="The plugin entry. Applied in the harness's own src/main.ts (labelled), since the harness has one entry for every route." />
      <PublishedCode page="google-adk__generative-ui__components" :index="11" note="The page's runtime for Vue: a TanStack BuiltInAgent with convertInputToTanStackAI. Not served — the ms-agent-py choice: the samples run on the ADK Quickstart agent." />
      <PublishedCode page="google-adk__generative-ui__components" :index="6" note="The Vue tab's install line. @tanstack/* is not installed (its runtime is not served); chart.js and maplibre-gl are (next block)." />
      <PublishedCode page="google-adk__generative-ui__components" :index="25" note="Installed in frontend/." />
    </div>
  </Panel>
  <Callout tone="harness" title="What the harness added">
    <p>· <code>src/main.ts</code> applies <code>GenerativeUIChart</code> and <code>GenerativeUIMap</code> (the page's plugin entry); <code>chart.js</code> and <code>maplibre-gl</code> are installed as the page says.</p>
  </Callout>
  <Callout tone="harness" title="AGUIToolset agent at /toolset (added at your request; README §9.17)">
    <p>For a run that carries a catalog, the Copilot Runtime adds the <code>render_ui</code> tool to the run's tools and its guide (the components, their props, how to call the tool) to the run's context. The <code>ag-ui-adk</code> adapter declares run tools only to an agent whose tools include <code>AGUIToolset()</code>, which the Quickstart's <code>LlmAgent</code> lacks. So at your request <code>agent/harness_app.py</code> serves the Quickstart's own arguments plus <code>tools=[AGUIToolset()]</code> at <code>/toolset</code>, and this route's <code>runtime-url</code> is changed to <code>/api/copilotkit-toolset</code> (published value kept as a comment). This sample calls <code>http://localhost:8200/api/copilotkit-toolset</code>, keeping the published host. Checked on 2026-11-17 with a fake key and a local stand-in for the Gemini API: the captured request declared <code>render_ui</code>.</p>
  </Callout>
  <Callout tone="warn" title="Still a gap: the guide stays out of the prompt (README §9.16)">
    <p>The adapter keeps run context in session state and run metadata, and the Quickstart's instruction is a fixed string, so the guide never reaches the model. <code>render_ui</code>'s own description only says to follow that guide; the model sees the tool, but not the catalog's component names or props. Expect a render attempt at best, likely with unknown components. Not yet driven against a live model.</p>
  </Callout>
  <Callout tone="info" title="Framework tabs"><p>This page is not under <code>/vue</code>: it prints each sample for React, Angular, React Native and Vue. Only the Vue tab (and code outside the tabs) is used.</p></Callout>
</template>
