<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/frontend-tools" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useFrontendTool</code> registers <code>filter_incidents</code> with a zod enum. The handler runs in the browser, writes the
      <code>severity</code> ref, and returns <code>{ applied, severity }</code> to the agent as the tool result.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Only show sev1 incidents', 'Show everything again']" expect="“Current filter:” changes to sev1, then back to all; the agent confirms each change." fail="A prose answer with “Current filter: all” unchanged: the run did not reach /toolset (start the agent with harness_app.py) or the model did not call the tool." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/frontend-tools/demo-chat/components/DashboardAgent.vue" />
      <SourceCode file="frontend/src/routes/frontend-tools/demo-chat/App.vue" />
    </div>
  </Panel>
  <Callout tone="info" title="zod">
    <p>The page imports <code>zod</code> without naming a version. This repo installs zod 3 (^3.25), the version <code>@copilotkit/vue</code> 1.87 itself depends on, so there is one copy.</p>
  </Callout>
  <Callout tone="harness" title="AGUIToolset agent at /toolset (added at your request; README §9.17)">
    <p>The <code>ag-ui-adk</code> adapter declares a run's frontend tools only to an agent whose tools include <code>AGUIToolset()</code>. The Quickstart's <code>LlmAgent</code> has none, and no loadable ADK page agent does, so at your request <code>agent/harness_app.py</code> serves the Quickstart's own <code>LlmAgent</code>/<code>ADKAgent</code> arguments plus <code>tools=[AGUIToolset()]</code> at <code>/toolset</code>. The sample's <code>runtime-url</code> is changed to <code>/api/copilotkit-toolset</code>, where <code>default</code> is that agent; the published value is kept as a comment beside it. Checked on 2026-11-17 with a fake key and a local stand-in for the Gemini API: the captured model request declared <code>filter_incidents</code>. Not yet driven against a live model.</p>
  </Callout>
</template>
