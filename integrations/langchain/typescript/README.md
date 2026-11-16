# @0noxtackore/langchain

Implementation of the AG-UI protocol for LangChain.

## Installation

```bash
npm install @0noxtackore/langchain
pnpm add @0noxtackore/langchain
yarn add @0noxtackore/langchain
```

## Usage

```ts
import { LangChainAgent } from "@0noxtackore/langchain";

// Create an AG-UI compatible agent
const agent = new LangChainAgent({
    chainFn: async ({ messages, tools, threadId }) => {
        // Your chosen llm model
        const { ChatOpenAI } = await import("@langchain/openai");
        const chatOpenAI = new ChatOpenAI({ model: "gpt-4o" });
        const model = chatOpenAI.bindTools(tools, {
            strict: true,
        });
        return model.stream(messages, { tools, metadata: { conversation_id: threadId } });
    },
})
```
