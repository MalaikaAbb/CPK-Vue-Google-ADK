<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/human-in-the-loop" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      Pattern 1: <code>useHumanInTheLoop</code> registers <code>schedule_meeting</code>. When the model calls it, the render component gets a
      <code>respond</code> callback while the call is executing, and the run resumes with the user's answer as the tool result.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Schedule a meeting about Q3 planning with Dana']" expect="A card with topic and attendee and three time slots; picking one resumes the run and the agent confirms that time." fail="A prose answer and no card: the run did not reach /toolset (start the agent with harness_app.py) or the model did not call schedule_meeting." />
    </div>
  </Panel>
  <Panel title="Published file, mounted verbatim"><SourceCode file="frontend/src/routes/human-in-the-loop/demo-chat/components/MeetingApproval.vue" /></Panel>
  <Callout tone="harness" title="What the harness added">
    <p>· <strong>TimePickerCard.vue</strong> — imported by the page, never published. Without it the tool has no UI and never calls <code>respond</code>. Minimal stand-in: three fixed slots (the page mentions “static candidate slots”), plus “None of these”.</p>
    <p>· <strong>HarnessApp.vue</strong> — the page prints no App.vue; this mounts MeetingApproval beside a CopilotChat under the standard provider.</p>
  </Callout>
  <Panel title="Harness files">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/human-in-the-loop/demo-chat/components/TimePickerCard.vue" />
      <SourceCode file="frontend/src/routes/human-in-the-loop/demo-chat/HarnessApp.vue" />
    </div>
  </Panel>
  <Callout tone="info" title="Pattern 2"><p><code>useInterrupt</code> is on its own route, <a href="/human-in-the-loop/useInterrupt" class="underline">Pausing the Agent for Input</a>.</p></Callout>
  <Callout tone="harness" title="AGUIToolset agent at /toolset (added at your request; README §9.17)">
    <p>The <code>ag-ui-adk</code> adapter declares a run's frontend tools only to an agent whose tools include <code>AGUIToolset()</code>. The Quickstart's <code>LlmAgent</code> has none, and no loadable ADK page agent does, so at your request <code>agent/harness_app.py</code> serves the Quickstart's own <code>LlmAgent</code>/<code>ADKAgent</code> arguments plus <code>tools=[AGUIToolset()]</code> at <code>/toolset</code>. The sample's <code>runtime-url</code> is changed to <code>/api/copilotkit-toolset</code>, where <code>default</code> is that agent; the published value is kept as a comment beside it. Checked on 2026-11-17 with a fake key and a local stand-in for the Gemini API: the captured model request declared <code>schedule_meeting</code>. Not yet driven against a live model.</p>
  </Callout>
  <Panel title="Also published: hitl_in_chat_agent.py — cannot load, not served">
    <PublishedCode page="human-in-the-loop" :index="1" note="Printed on HITL Overview and Programmatic Control: a complete LlmAgent with AGUIToolset(), so it would declare frontend tools — but it imports get_model and stop_on_terminal_text from agents.shared_chat, which no page publishes (ModuleNotFoundError). Its instruction also targets generate_task_steps, a tool no Vue page on either route registers. Kept as published; per your rules it is a gap (README §9.4)." />
  </Panel>
</template>
