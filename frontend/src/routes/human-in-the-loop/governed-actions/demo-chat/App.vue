<script setup lang="ts">
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue/v2";
import GovernedActionApproval from "./components/GovernedActionApproval.vue";
import GovernedActionTool from "./components/GovernedActionTool.vue";
</script>

<template>
  <!-- [harness] published: runtime-url="/api/copilotkit" — the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so frontend tools are declared (README §9.17) -->
  <CopilotKitProvider runtime-url="/api/copilotkit-toolset">
    <GovernedActionApproval />
    <GovernedActionTool />
    <CopilotChat />
  </CopilotKitProvider>
</template>
