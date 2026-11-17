<script setup lang="ts">
import { CopilotKitProvider } from "@copilotkit/vue/v2";
import { standardUI } from "@copilotkit/vue/v2/generative-ui";
</script>

<template>
  <!-- [harness] published: runtime-url="/api/copilotkit" — the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so render_ui is declared (README §9.17) -->
  <CopilotKitProvider runtime-url="/api/copilotkit-toolset" :generativeUI="{ ui: standardUI }">
    <slot />
  </CopilotKitProvider>
</template>
