# @0noxtackore/llamaindex

Implementation of the AG-UI protocol for LlamaIndex.

Connects LlamaIndex workflows to frontend applications via the AG-UI protocol. Provides HTTP connectivity to LlamaIndex servers with support for RAG pipelines and workflow orchestration.

## Installation

```bash
npm install @0noxtackore/llamaindex
pnpm add @0noxtackore/llamaindex
yarn add @0noxtackore/llamaindex
```

## Usage

```ts
import { LlamaIndexAgent } from "@0noxtackore/llamaindex";

// Create an AG-UI compatible agent
const agent = new LlamaIndexAgent({
  url: "http://localhost:9000/agentic_chat",
  headers: { "Content-Type": "application/json" },
});

// Run with streaming
const result = await agent.runAgent({
  messages: [{ role: "user", content: "Query my documents" }],
});
```

## Features

- **HTTP connectivity** – Connect to LlamaIndex FastAPI servers
- **Workflow support** – Full integration with LlamaIndex workflow orchestration
- **RAG capabilities** – Document retrieval and reasoning workflows
- **Python integration** – Complete FastAPI server implementation included

## To run the example server in the dojo

```bash
cd integrations/llama-index/python/examples
uv sync && uv run dev
```
