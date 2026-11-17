<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/shared-state" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      Agent <code>workspace</code>'s state read through <code>useAgent</code> and rendered as a notes list, and written back with
      <code>agent.setState</code> from the “Prefer concise answers” button.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Click “Prefer concise answers”, then ask: Write a two-line poem']" expect="The click writes preferences.tone into the agent state (Inspector › State); the chat replies." fail="What does not happen here: the notes list never fills — no loadable ADK backend writes state (see below)." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/shared-state/demo-chat/components/SharedWorkspace.vue" />
      <SourceCode file="frontend/src/routes/shared-state/demo-chat/App.vue" />
    </div>
  </Panel>
  <Panel title="The two fragments, as published">
    <div class="space-y-4">
      <PublishedCode page="shared-state" :index="2" />
      <PublishedCode page="shared-state" :index="3" />
    </div>
  </Panel>
  <Callout tone="harness" title="What the harness changed">
    <p>· The page prints <code>SharedWorkspace.vue</code> twice (reading, then writing; the second has no imports and uses <code>agent</code> from the first). Merged into one file, each verbatim.</p>
    <p>· <code>workspace</code> → <code>my_agent</code>, the ADK Quickstart's agent (<code>backend/agents.ts</code>); the page's own backend cannot load.</p>
  </Callout>
  <Panel title="The page's backend, verbatim, not served"><SourceCode file="agent/src/agents/shared_state_streaming_agent.py" /></Panel>
  <Panel title="Also published: shared_state_read_write_agent.py — a fragment, not served">
    <PublishedCode page="shared-state" :index="1" note="The page's read/write agent, printed as a fragment: only the LlmAgent call, with no imports, and _INSTRUCTION, set_notes, _inject_preferences, get_model and stop_on_terminal_text never defined here (the last two live in the unpublished agents.shared_chat). Per your rules it is a gap (README §9.4)." />
  </Panel>
  <Callout tone="warn" title="Doc note (README §9)">
    <p>The page's backend (<code>shared_state_streaming_agent.py</code>, shown below) cannot load — it imports the unpublished <code>agents.shared_chat</code> — so <code>workspace</code> is the Quickstart agent, which has no tools: nothing writes <code>notes</code> and the list stays empty; the tone write-back reaches the session state. Even loaded, that backend writes <code>document</code>, not <code>notes</code>.</p>
  </Callout>
</template>
