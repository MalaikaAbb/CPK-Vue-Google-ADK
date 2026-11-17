<script setup lang="ts">
/**
 * [harness] NOT FROM THE DOCS.
 *
 * HITL Overview publishes MeetingApproval.vue and says to mount it beneath
 * CopilotKitProvider, but prints no App.vue. The registered tool is only ever
 * called from a conversation, so this mounts it beside a CopilotChat — the
 * same shape as every App.vue the Vue docs do publish.
 */
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue/v2";

import MeetingApproval from "./components/MeetingApproval.vue";
</script>

<template>
  <!-- [harness] was runtime-url="/api/copilotkit": the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so frontend tools are declared (README §9.17) -->
  <CopilotKitProvider runtime-url="/api/copilotkit-toolset">
    <MeetingApproval />
    <CopilotChat />
  </CopilotKitProvider>
</template>
