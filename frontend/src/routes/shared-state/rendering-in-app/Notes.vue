<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/shared-state/rendering-in-app" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      A <code>Canvas</code> outside the chat reads <code>default</code>'s state, seeds only the missing <code>title</code>/<code>items</code> with
      UI-owned initial values, and renders them. <code>CopilotChat</code> beside it resolves the same agent.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Rename the project to “Spring release”', 'Mark “Build a prototype” as done']" expect="“Project launch” with two items on load; the heading and data-done attributes change in place when the agent writes state." fail="What actually happens here: the canvas stays on “Project launch” — see the gap below." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/shared-state/rendering-in-app/demo-chat/components/Canvas.vue" />
      <SourceCode file="frontend/src/routes/shared-state/rendering-in-app/demo-chat/App.vue" />
    </div>
  </Panel>
  <Callout tone="warn" title="Gap: the agent cannot write this state (README §9)">
    <p><code>default</code> is the ADK Quickstart agent (<code>agent/main.py</code>): an <code>LlmAgent</code> with no tools, so it can read the conversation but has no way to change <code>title</code> or <code>items</code>. The ADK page agent that writes state (<code>shared_state_streaming_agent.py</code>) cannot load (README §9). The canvas still seeds and renders the UI-owned state.</p>
  </Callout>
  <Panel title="Published, not mounted" description="A fragment with no component or button around it; wiring it would mean writing UI the page does not publish.">
    <PublishedCode page="shared-state__rendering-in-app" :index="2" />
  </Panel>
</template>
