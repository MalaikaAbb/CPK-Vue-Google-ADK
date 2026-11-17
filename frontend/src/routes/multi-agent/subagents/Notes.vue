<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
</script>

<template>
  <RouteHeader path="/multi-agent/subagents" />
  <Callout tone="warn" title="Gap: the backend cannot load, and there is no frontend (README §9)">
    <p>· <code>src/agents/subagents_agent.py</code> (verbatim below; the page prints it twice, the second a subset of the first) defines the <code>research_agent</code> / <code>writing_agent</code> / <code>critique_agent</code> delegation tools and a root <code>LlmAgent</code>, but imports <code>get_model</code> and <code>stop_on_terminal_text</code> from <code>agents.shared_chat</code>, which no page publishes — so it cannot load. Per your rules nothing was written in its place; the file is not served.</p>
    <p>· The “Rendering a live delegation log” section publishes no Vue code, so this route has no demo.</p>
  </Callout>
  <Panel title="Published backend, verbatim, not served"><SourceCode file="agent/src/agents/subagents_agent.py" /></Panel>
</template>
