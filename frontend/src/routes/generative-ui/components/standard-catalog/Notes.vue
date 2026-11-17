<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/standard-catalog/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components/standard-catalog" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">The standard catalog on the provider, then a catalog that extends it and replaces its <code>Card</code> with your own <code>MyCard</code>.</p>
    <div class="mt-4"><TryIt :prompts="['Show a card with a title and two buttons']" expect="Standard sample: a standard Card. Override sample: the bordered MyCard instead." fail="A prose answer and no component: the model did not call render_ui, or the run errored (check the Inspector)." /></div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/Providers.vue`" note="Untitled provider component with a slot." />
      <SourceCode :file="`${D}/override/components/MyCard.vue`" />
      <SourceCode :file="`${D}/override/app-ui.ts`" />
    </div>
  </Panel>
  <Panel title="Harness files">
    <div class="space-y-4">
      <SourceCode :file="`${D}/HarnessApp.vue`" note="Mounts Providers with a CopilotChat in its slot." />
      <SourceCode :file="`${D}/override/HarnessOverride.vue`" note="The page never prints the provider for appUI; written like its own." />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <div class="space-y-4">
      <PublishedCode page="google-adk__generative-ui__components__standard-catalog" :index="5" note="Fragment: ProductCard and productSchema are never defined." />
    </div>
  </Panel>
  <Callout tone="harness" title="AGUIToolset agent at /toolset (added at your request; README §9.17)">
    <p>For a run that carries a catalog, the Copilot Runtime adds the <code>render_ui</code> tool to the run's tools and its guide (the components, their props, how to call the tool) to the run's context. The <code>ag-ui-adk</code> adapter declares run tools only to an agent whose tools include <code>AGUIToolset()</code>, which the Quickstart's <code>LlmAgent</code> lacks. So at your request <code>agent/harness_app.py</code> serves the Quickstart's own arguments plus <code>tools=[AGUIToolset()]</code> at <code>/toolset</code>, and this route's <code>runtime-url</code> is changed to <code>/api/copilotkit-toolset</code> (published value kept as a comment). Checked on 2026-11-17 with a fake key and a local stand-in for the Gemini API: the captured request declared <code>render_ui</code>.</p>
  </Callout>
  <Callout tone="warn" title="Still a gap: the guide stays out of the prompt (README §9.16)">
    <p>The adapter keeps run context in session state and run metadata, and the Quickstart's instruction is a fixed string, so the guide never reaches the model. <code>render_ui</code>'s own description only says to follow that guide; the model sees the tool, but not the catalog's component names or props. Expect a render attempt at best, likely with unknown components. Not yet driven against a live model.</p>
  </Callout>
  <Callout tone="info" title="Framework tabs"><p>This page is not under <code>/vue</code>: it prints each sample for React, Angular, React Native and Vue. Only the Vue tab (and code outside the tabs) is used.</p></Callout>
</template>
