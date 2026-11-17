<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/surfaces/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components/surfaces" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">A named page target: <code>FeaturedProducts</code> wraps a <code>GenerativeUISurface</code> (id <code>featured</code>, limited to ProductGrid/ProductCard) whose default content the agent can replace from the chat; the provider adds an error boundary with a retry fallback.</p>
    <div class="mt-4"><TryIt :prompts="['Show the featured products here as a grid']" expect="The surface's row is replaced by a ProductGrid of ProductCards, above the chat." fail="The stand-in ProductRow stays: no render_ui call targeted the surface (see the agent note)." /></div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/components/FeaturedProducts.vue`" note="Imports ../product (a type module no page publishes — left missing, one vue-tsc error) and ../shop-ui." />
      <SourceCode :file="`${D}/components/RetryFallback.vue`" />
      <SourceCode :file="`${D}/Providers.vue`" note="Printed untitled under “When a component fails”; it imports ./components/RetryFallback.vue and ./shop-ui." />
    </div>
  </Panel>
  <Panel title="Harness files">
    <div class="space-y-4">
      <SourceCode :file="`${D}/shop-ui.ts`" note="Not printed on this page: Catalogs' shop-ui.ts, copied with its two components (FeaturedProducts imports it)." />
      <SourceCode :file="`${D}/components/ProductRow.vue`" note="STAND-IN: FeaturedProducts renders it; never published." />
      <SourceCode :file="`${D}/HarnessApp.vue`" note="Puts the page's Providers, FeaturedProducts (two sample products) and a CopilotChat together." />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <div class="space-y-4">
      <PublishedCode page="google-adk__generative-ui__components__surfaces" :index="8" note="Fragment: a surface tag limited to two components." />
      <PublishedCode page="google-adk__generative-ui__components__surfaces" :index="12" note="Fragment: a surface without auto-scroll." />
      <PublishedCode page="google-adk__generative-ui__components__surfaces" :index="17" note="Recommendations under a product: Product is never published." />
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
