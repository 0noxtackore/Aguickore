# aguickore

**aguickore** is an open, event-driven protocol and SDK ecosystem for connecting AI agents to user-facing applications — maintained by **0noxtackore** as a security-hardened, actively improved evolution of the AG-UI project.

> **Lineage & attribution:** aguickore builds on the ideas and foundations of the [AG-UI protocol](https://github.com/ag-ui-protocol/ag-ui). This repository is an independent, improved distribution with its own branding, hardening, and maintenance direction. Upstream specification, documentation, and demos remain valuable references: [AG-UI Docs](https://docs.ag-ui.com) · [Spec](https://docs.ag-ui.com/spec/1.0) · [Dojo](https://dojo.ag-ui.com).

## Why aguickore

Agent experiences rarely fit a single request/response exchange. Real agents stream text, invoke tools, synchronize shared state, pause for human decisions, and delegate to subagents — often in different ways across frameworks. **aguickore** standardizes that interaction as a bidirectional stream of typed events so the same agent backend can drive different clients (web, mobile, desktop, terminal, chat surfaces) without bespoke glue for each pairing.

**Core capabilities enabled by the protocol model include:**
- **Streaming conversations** — incremental text and message lifecycle events across turns.
- **Tool use** — tool call arguments/results and frontend-executed tools.
- **Shared state** — snapshots and delta updates between agent and application.
- **Human-in-the-loop** — pauses/interrupts and resumable runs.
- **Reasoning, activity, and subagents** — structured visibility into agent progress and delegation.
- **Extensibility** — custom and raw events for framework-specific needs.

## What’s in this repository

This is a monorepo containing protocol assets, SDKs, integrations, and apps:

| Area | Path | Purpose |
|---|---|---|
| **Protocol spec** | [`spec/`](spec) | Protocol definitions and schemas |
| **TypeScript SDKs** | [`sdks/typescript/`](sdks/typescript) | Core/client/server/encoder packages (published under the `@0noxtackore/*` scope in this distribution) |
| **Python SDK** | [`sdks/python/`](sdks/python) | Python protocol/core implementation (`ag-ui-protocol`) |
| **.NET SDK** | [`sdks/dotnet/`](sdks/dotnet) | .NET client/server libraries |
| **Community SDKs** | [`sdks/community/`](sdks/community) | Additional language implementations (Go, Java, Kotlin, Dart, Rust, Ruby, Swift, C++, etc.) |
| **Integrations** | [`integrations/`](integrations) | Adapters for agent frameworks and platforms (LangChain/LangGraph, CrewAI, Google ADK, Microsoft Agent Framework, Pydantic AI, Mastra, LlamaIndex, AWS Strands, Claude SDKs, and more) |
| **Middlewares** | [`middlewares/`](middlewares) | Protocol middlewares (e.g. MCP/A2UI-related components) |
| **Apps** | [`apps/`](apps) | Demo and development applications (including Dojo) |
| **Docs & tooling** | [`docs/`](docs), [`scripts/`](scripts), [`skills/`](skills) | Documentation sources and repository tooling |

## Getting started

### Prerequisites
- **Node.js** (see [`.node-version`](.node-version)) and **pnpm** (see `packageManager` in [`package.json`](package.json))
- Language-specific toolchains as needed (Python, .NET, etc.) for the SDKs/integrations you work on

### Install & build (monorepo)
```bash
pnpm install
pnpm build
```

Useful workspace scripts (see [`package.json`](package.json)): `pnpm lint`, `pnpm test`, `pnpm check-types`, `pnpm dev`, `pnpm dev:integrations`.

### Minimal protocol example (concept)

An aguickore-compatible agent endpoint accepts a run input (messages, tools, state, context) and returns a stream of typed events over an HTTP transport (commonly SSE). A minimal run typically emits:
1. `RUN_STARTED`
2. message/tool/state events as work progresses
3. `RUN_FINISHED` (or an error/interrupt outcome, depending on the flow)

**Illustrative server shape (Python, using the Python SDK):**
```python
# example_server.py (illustrative)
import uuid
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from ag_ui.core import (
    RunAgentInput, RunStartedEvent, RunFinishedEvent,
    TextMessageStartEvent, TextMessageContentEvent, TextMessageEndEvent,
)
from ag_ui.encoder import EventEncoder

app = FastAPI()

@app.post("/agent")
async def agent(input: RunAgentInput, request: Request):
    enc = EventEncoder(accept=request.headers.get("accept"))

    async def stream():
        yield enc.encode(RunStartedEvent(thread_id=input.thread_id, run_id=input.run_id))
        mid = str(uuid.uuid4())
        yield enc.encode(TextMessageStartEvent(message_id=mid, role="assistant"))
        for part in ["Hello ", "from ", "aguickore."]:
            yield enc.encode(TextMessageContentEvent(message_id=mid, delta=part))
        yield enc.encode(TextMessageEndEvent(message_id=mid))
        yield enc.encode(RunFinishedEvent(thread_id=input.thread_id, run_id=input.run_id))

    return StreamingResponse(stream(), media_type=enc.get_content_type())
```

**Illustrative client shape (TypeScript, using `@0noxtackore/client` in this repo):**
```ts
// example_client.ts (illustrative)
import { HttpAgent } from "@0noxtackore/client";

const agent = new HttpAgent({ url: "http://localhost:8000/agent" });
agent.addMessage({ id: crypto.randomUUID(), role: "user", content: "Hi!" });

await agent.runAgent({}, {
  onTextMessageContentEvent: ({ event }) => process.stdout.write(event.delta),
});
```

> Exact package names, versions, and integration-specific setup vary by SDK/integration. Refer to the corresponding `sdks/` or `integrations/` subproject for authoritative instructions.

## Protocol at a glance

The protocol organizes interaction around a **run** that produces ordered, typed events. Common event families include:

- **Lifecycle:** run/step start, finish, and error
- **Messages:** streaming assistant/user message chunks
- **Tool calls:** tool invocation arguments, results, and streaming updates
- **State:** full snapshots and incremental (e.g. JSON Patch-style) deltas
- **Reasoning:** model reasoning signals (where supported)
- **Activity:** progress/status updates for long-running work
- **Subagents:** nested/delegated agent runs
- **Passthrough:** raw/custom payloads for extensions

For the canonical event/type definitions, consult the [`spec/`](spec) in this repository and the upstream [AG-UI specification](https://docs.ag-ui.com/spec/1.0).

## SDKs

| Language | Location | Notes |
|---|---|---|
| TypeScript | [`sdks/typescript/`](sdks/typescript) | Core/client/server/encoder and related packages under `@0noxtackore/*` in this distribution |
| Python | [`sdks/python/`](sdks/python) | Protocol/core implementation (`ag-ui-protocol`) |
| .NET | [`sdks/dotnet/`](sdks/dotnet) | Client/server libraries |
| Community | [`sdks/community/`](sdks/community) | Kotlin, Go, Java, Dart, Rust, Ruby, Swift, C++, and others |

## Integrations & middlewares

Framework and platform adapters live under [`integrations/`](integrations) (e.g. LangChain/LangGraph, CrewAI, Google ADK, Microsoft Agent Framework, AWS Strands, Pydantic AI, Mastra, LlamaIndex, Agno, AG2, Claude Agent SDK/Managed Agents, OpenAI Agents, server-starter templates, and community integrations) and [`middlewares/`](middlewares) (e.g. MCP/A2UI-related middleware). Check each subdirectory for its own README and setup.

## Improvements in aguickore

This distribution includes hardening and maintenance improvements over the baseline, including:

- **CI security gates:** blocking workflow static analysis (zizmor), dependency auditing (`pnpm audit`), and secret scanning (gitleaks).
- **Supply chain hardening:** tightened pnpm overrides for transitive dependencies.
- **Toolchain consistency:** centralized Node/pnpm configuration for reproducible environments.
- **Protocol safety:** transformation warnings emitted consistently (no silent suppression) and stricter handling in the legacy bridge (e.g. omitting explicit optional `null` values when emitting converted events).

Details and the evolving vulnerability/disadvantage analysis for this repository are tracked in [`vulnerabilidades.txt`](vulnerabilidades.txt).

## Development

- **Task runner:** [Nx](https://nx.dev) (`nx.json` present). Prefer `nx` targets where applicable.
- **Package manager:** pnpm (workspace defined in `pnpm-workspace.yaml`).
- **Common commands:** `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm check-types`, `pnpm format`.

## Contributing

Contributions, fixes, and integrations are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening changes, and follow [SECURITY.md](SECURITY.md) for reporting security issues.

## License

Released under the [MIT License](LICENSE).

Copyright (c) 2026 0noxtackore.
