<script setup lang="ts">
import { CopilotKitProvider } from "@copilotkit/vue/v2";
import DashboardAgent from "./components/DashboardAgent.vue";
</script>

<template>
  <!-- [harness] published: runtime-url="/api/copilotkit" — the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so frontend tools are declared (README §9.17) -->
  <CopilotKitProvider runtime-url="/api/copilotkit-toolset">
    <DashboardAgent />
  </CopilotKitProvider>
</template>
