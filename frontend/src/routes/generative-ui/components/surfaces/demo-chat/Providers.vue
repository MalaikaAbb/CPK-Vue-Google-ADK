<script setup lang="ts">
import { CopilotKitProvider } from "@copilotkit/vue/v2";
import type { GenerativeUIErrorInfo } from "@copilotkit/vue/v2/generative-ui";
import RetryFallback from "./components/RetryFallback.vue";
import { shopUI } from "./shop-ui";

function onError(info: GenerativeUIErrorInfo) {
  console.warn(info.kind, info.surfaceId, info.error.message);
}
</script>

<template>
  <!-- [harness] published: runtime-url="/api/copilotkit" — the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so render_ui is declared (README §9.17) -->
  <CopilotKitProvider
    runtime-url="/api/copilotkit-toolset"
    :generativeUI="{ ui: shopUI, errorBoundary: { onError, fallback: RetryFallback } }"
  >
    <slot />
  </CopilotKitProvider>
</template>
