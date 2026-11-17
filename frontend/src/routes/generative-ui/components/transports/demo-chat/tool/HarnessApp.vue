<script setup lang="ts">
// [harness] Transports › the render_ui tool (default).
// The page prints only the opening provider tag below; these imports, the
// <CopilotChat /> inside it and the closing tag are the only added lines.
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue/v2";
import { standardUI } from "@copilotkit/vue/v2/generative-ui";
</script>

<template>
<!-- [harness] published: runtime-url="/api/copilotkit" — the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so render_ui is declared (README §9.17) -->
<CopilotKitProvider runtime-url="/api/copilotkit-toolset" :generativeUI="{ ui: standardUI }">
  <CopilotChat /> <!-- [harness] -->
</CopilotKitProvider> <!-- [harness] -->
</template>
