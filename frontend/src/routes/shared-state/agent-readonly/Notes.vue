<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/shared-state/agent-readonly" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useAgentContext({ description: "Active workspace", value: workspaceId })</code> publishes the ref to the agent on every turn,
      with no setter.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Which workspace am I in?', 'Switch my workspace to “orion”']" expect="“northstar”, with no tool call. The second request cannot change “Workspace: northstar” on the page." fail="What actually happens here: the agent does not know the workspace — see the gap below." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/shared-state/agent-readonly/demo-chat/components/WorkspaceContext.vue" />
      <SourceCode file="frontend/src/routes/shared-state/agent-readonly/demo-chat/App.vue" />
    </div>
  </Panel>
  <Callout tone="warn" title="Gap: the ADK agent never reads the context (README §9)">
    <p>The page credits “the backend's CopilotKit middleware”. For ADK, the <code>ag-ui-adk</code> adapter stores the run's context in session state (<code>_ag_ui_context</code>) and run metadata, for tools and instruction providers to read — it does not put it in the prompt. The Quickstart agent's instruction is the fixed string “Be helpful and fun!”, so the model never sees the value. No Vue page publishes an ADK agent that reads it.</p>
  </Callout>
</template>
