<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/generative-ui/tool-based" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useComponent</code> turns <code>WeatherCard.vue</code> into a frontend tool named <code>show_weather</code>. When the agent calls
      it, the arguments are passed straight through as the card's props — no handler, no backend.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Show me the weather in Paris']" expect="An inline card: “Paris” and “<number>° · <condition>”. The values are invented by the model — the page has no weather source." fail="A prose answer with no card: the run did not reach /toolset (start the agent with harness_app.py) or the model did not call show_weather." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/generative-ui/tool-based/demo-chat/components/WeatherCard.vue" />
      <SourceCode file="frontend/src/routes/generative-ui/tool-based/demo-chat/components/AgentExperience.vue" />
      <SourceCode file="frontend/src/routes/generative-ui/tool-based/demo-chat/App.vue" />
    </div>
  </Panel>
  <Callout tone="harness" title="AGUIToolset agent at /toolset (added at your request; README §9.17)">
    <p>The <code>ag-ui-adk</code> adapter declares a run's frontend tools only to an agent whose tools include <code>AGUIToolset()</code>. The Quickstart's <code>LlmAgent</code> has none, and no loadable ADK page agent does, so at your request <code>agent/harness_app.py</code> serves the Quickstart's own <code>LlmAgent</code>/<code>ADKAgent</code> arguments plus <code>tools=[AGUIToolset()]</code> at <code>/toolset</code>. The sample's <code>runtime-url</code> is changed to <code>/api/copilotkit-toolset</code>, where <code>default</code> is that agent; the published value is kept as a comment beside it. Checked on 2026-11-17 with a fake key and a local stand-in for the Gemini API: the captured model request declared <code>show_weather</code>. Not yet driven against a live model.</p>
  </Callout>
</template>
