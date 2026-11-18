# @0noxtackore/crewai

Implementation of the AG-UI protocol for CrewAI.

Connects CrewAI Flows and Crews to frontend applications via the AG-UI protocol. Supports both TypeScript HTTP clients and Python FastAPI server integration with streaming crew execution.

## Installation

```bash
npm install @0noxtackore/crewai
pnpm add @0noxtackore/crewai
yarn add @0noxtackore/crewai
```

## Usage

```ts
import { CrewAIAgent } from "@0noxtackore/crewai";

// Create an AG-UI compatible agent
const agent = new CrewAIAgent({
  url: "http://localhost:8000/crew-endpoint",
  headers: { "Content-Type": "application/json" },
});

// Run with streaming
const result = await agent.runAgent({
  messages: [{ role: "user", content: "Execute the research crew" }],
});
```

## Features

- **HTTP connectivity** – Connect to CrewAI FastAPI servers
- **Flow & Crew support** – Works with both CrewAI Flows and traditional Crews
- **Step tracking** – Real-time crew execution progress
- **Python integration** – Full FastAPI server implementation included

## To run the example server in the dojo

The dojo server is a separate project alongside the Python package, so run it from a
checkout of this repository.

```bash
cd integrations/crew-ai/python/examples
uv sync && uv run dev
```
