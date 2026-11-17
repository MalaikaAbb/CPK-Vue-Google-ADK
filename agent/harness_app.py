"""
[harness] NOT FROM THE DOCS — the app this repo serves (`uv run --env-file .env
harness_app.py`). It is the ADK Quickstart's `app` (main.py, verbatim and
unchanged) plus one more endpoint, added at the user's request ("define the
tools if they are given in section docs for vue"):

- The Tool Rendering page publishes `get_weather` in tool_rendering_common.py
  and no agent. This builds one from the Quickstart's own LlmAgent and
  ADKAgent arguments, adding only `tools=[get_weather]` (the `tools=[...]`
  parameter as the same doc set's shared_state_streaming_agent.py uses it),
  and mounts it at /tool-rendering with the Quickstart's
  add_adk_fastapi_endpoint. No AGUIToolset: the page does not publish one for
  this agent.

- [harness] /toolset (added 2026-11-17, at the user's request: "add AGUIToolset
  in google-adk sections that need them and flag it"). The Quickstart's
  LlmAgent has no AGUIToolset, so ag-ui-adk never declares a run's frontend
  tools to the model (README §9.3). This is the Quickstart's own LlmAgent and
  ADKAgent arguments plus `tools=[AGUIToolset()]` (the import and call as the
  same doc set's shared_state_streaming_agent.py uses them), mounted at
  /toolset. Only the routes that send frontend tools reach it, through their
  own runtime path /api/copilotkit-toolset (README §9.17). It adds no
  instruction, so run context (e.g. the generative-UI guide) still stays out
  of the prompt.

The `__main__` block mirrors the Quickstart's (localhost:8000).
"""
from ag_ui_adk import ADKAgent, AGUIToolset, add_adk_fastapi_endpoint
from google.adk.agents import LlmAgent

from main import app
from src.agents.tool_rendering_common import get_weather

tool_rendering_agent = LlmAgent(
    name="assistant",
    model="gemini-3.8-flash",
    instruction="Be helpful and fun!",
    tools=[get_weather],
)

tool_rendering_adk_agent = ADKAgent(
    adk_agent=tool_rendering_agent,
    app_name="demo_app",
    user_id="demo_user",
    session_timeout_seconds=3600,
    use_in_memory_services=True,
)

add_adk_fastapi_endpoint(app, tool_rendering_adk_agent, path="/tool-rendering")

# [harness] Quickstart agent + AGUIToolset(), for the routes that send frontend tools (README §9.17).
toolset_agent = LlmAgent(
    name="assistant",
    model="gemini-3.8-flash",
    instruction="Be helpful and fun!",
    tools=[AGUIToolset()],  # [harness] the only change from the Quickstart's LlmAgent
)

toolset_adk_agent = ADKAgent(
    adk_agent=toolset_agent,
    app_name="demo_app",
    user_id="demo_user",
    session_timeout_seconds=3600,
    use_in_memory_services=True,
)

add_adk_fastapi_endpoint(app, toolset_adk_agent, path="/toolset")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
