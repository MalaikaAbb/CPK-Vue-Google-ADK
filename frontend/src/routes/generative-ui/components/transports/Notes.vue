<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/transports/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components/transports" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">How generated UI travels: the default <code>render_ui</code> tool, or <code>transport: 'markdown'</code> (the agent writes a2ui code blocks in its reply), and limiting generative UI to some agents with <code>agentIds</code>.</p>
    <div class="mt-4"><TryIt :prompts="['Compare three plans in a table']" expect="Tool: a component via render_ui. Markdown: a component from an a2ui block in the reply. agentIds ['shop']: plain text, since the chat's agent is default." fail="Tool: no component — see the agent note. Markdown: plain text — the model did not write an a2ui block." /></div>
  </Panel>
  <Panel title="Harness wrappers around the published provider lines">
    <div class="space-y-4">
      <SourceCode :file="`${D}/tool/HarnessApp.vue`" note="Opening provider line verbatim; imports, chat and closing tag added." />
      <SourceCode :file="`${D}/markdown/HarnessApp.vue`" note="Same." />
      <SourceCode :file="`${D}/agent-ids/HarnessApp.vue`" note="Same. No agent is registered as shop." />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <div class="space-y-4">
      <PublishedCode page="google-adk__generative-ui__components__transports" :index="4" note="A runtime option (generativeUI: true), printed as a Next route; the harness runtime is unchanged." />
    </div>
  </Panel>
  <Callout tone="harness" title="AGUIToolset agent at /toolset (added at your request; README §9.17)">
    <p>For a run that carries a catalog, the Copilot Runtime adds the <code>render_ui</code> tool to the run's tools and its guide (the components, their props, how to call the tool) to the run's context. The <code>ag-ui-adk</code> adapter declares run tools only to an agent whose tools include <code>AGUIToolset()</code>, which the Quickstart's <code>LlmAgent</code> lacks. So at your request <code>agent/harness_app.py</code> serves the Quickstart's own arguments plus <code>tools=[AGUIToolset()]</code> at <code>/toolset</code>, and this route's <code>runtime-url</code> is changed to <code>/api/copilotkit-toolset</code> (published value kept as a comment). Only the tool sample (and the overview) run there; the markdown and <code>agentIds</code> samples send no <code>render_ui</code> and stay on <code>/api/copilotkit</code>. Checked on 2026-11-17 with a fake key and a local stand-in for the Gemini API: the captured request declared <code>render_ui</code>.</p>
  </Callout>
  <Callout tone="warn" title="Still a gap: the guide stays out of the prompt (README §9.16)">
    <p>The adapter keeps run context in session state and run metadata, and the Quickstart's instruction is a fixed string, so the guide never reaches the model. <code>render_ui</code>'s own description only says to follow that guide; the model sees the tool, but not the catalog's component names or props. Expect a render attempt at best, likely with unknown components. Not yet driven against a live model.</p>
  </Callout>
  <Callout tone="info" title="Framework tabs"><p>This page is not under <code>/vue</code>: it prints each sample for React, Angular, React Native and Vue. Only the Vue tab (and code outside the tabs) is used.</p></Callout>
</template>
