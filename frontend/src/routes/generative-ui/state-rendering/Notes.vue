<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/generative-ui/state-rendering" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useAgent</code> with <code>OnStateChanged</code> + <code>OnRunStatusChanged</code> on agent <code>researcher</code>;
      <code>ResearchProgress</code> renders <code>status</code>, a progress bar from <code>completed</code>/<code>total</code>, and <code>draft</code>.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Write a short note about bicycles']" expect="If the backend wrote these keys: status text, a moving bar and a draft." fail="What actually happens here: “Idle” and an empty bar (see below)." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/generative-ui/state-rendering/demo-chat/components/ResearchProgress.vue" />
      <SourceCode file="frontend/src/routes/generative-ui/state-rendering/demo-chat/App.vue" />
    </div>
  </Panel>
  <Panel title="The page's backend, verbatim, not served"><SourceCode file="agent/src/agents/shared_state_streaming_agent.py" /></Panel>
  <Callout tone="warn" title="Why this route is broken (README §9)">
    <p>The page's backend, <code>src/agents/shared_state_streaming_agent.py</code> (verbatim, shown below), is a complete <code>LlmAgent</code> with <code>write_document</code> and <code>AGUIToolset()</code> — but it imports <code>get_model</code> and <code>stop_on_terminal_text</code> from <code>agents.shared_chat</code>, which no page publishes, so it cannot load. Per your rules nothing was written in its place; <code>researcher</code> is the Quickstart agent, which writes no state. Even loaded, it writes <code>document</code>, while <code>ResearchProgress</code> reads <code>status</code>, <code>completed</code>, <code>total</code> and <code>draft</code>.</p>
  </Callout>
  <Callout tone="harness" title="Agent id"><p><code>researcher</code> → <code>my_agent</code>, the ADK Quickstart's agent (<code>backend/agents.ts</code>).</p></Callout>
</template>
