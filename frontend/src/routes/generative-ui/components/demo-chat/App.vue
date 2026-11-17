<script setup lang="ts">
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue/v2";
import { standardUI } from "@copilotkit/vue/v2/generative-ui";
</script>

<template>
  <!-- [harness] published: runtime-url="http://localhost:8200/api/copilotkit" — the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so render_ui is declared (README §9.17) -->
  <CopilotKitProvider
    runtime-url="http://localhost:8200/api/copilotkit-toolset"
    :generativeUI="{ ui: standardUI }"
  >
    <div style="height: 100vh">
      <CopilotChat />
    </div>
  </CopilotKitProvider>
</template>
