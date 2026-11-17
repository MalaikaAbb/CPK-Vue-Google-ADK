<script setup lang="ts">
/**
 * [harness] Standard catalog › “Replace a component”: the page prints MyCard.vue
 * and an appUI that overrides Card with it, but not the provider that uses
 * appUI. This is that provider, written like the page's own (runtime-url
 * "/api/copilotkit", :generativeUI="{ ui }"), with a CopilotChat.
 */
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue/v2";
import { appUI } from "./app-ui";
</script>

<template>
  <!-- [harness] was runtime-url="/api/copilotkit": the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so render_ui is declared (README §9.17) -->
  <CopilotKitProvider runtime-url="/api/copilotkit-toolset" :generativeUI="{ ui: appUI }">
    <CopilotChat />
  </CopilotKitProvider>
</template>
