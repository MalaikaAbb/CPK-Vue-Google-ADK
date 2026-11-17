<script setup lang="ts">
// [harness] Catalogs › “Hand it to the provider”.
// The page prints only the opening provider tag below; these imports, the
// <CopilotChat /> inside it and the closing tag are the only added lines.
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue/v2";
import { shopUI } from "./shop-ui";
</script>

<template>
<!-- [harness] published: runtime-url="/api/copilotkit" — the Quickstart agent + AGUIToolset() is served as `default` on /api/copilotkit-toolset, so render_ui is declared (README §9.17) -->
<CopilotKitProvider runtime-url="/api/copilotkit-toolset" :generativeUI="{ ui: shopUI }">
  <CopilotChat /> <!-- [harness] -->
</CopilotKitProvider> <!-- [harness] -->
</template>
