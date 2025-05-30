import { config } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { v4 } from "https://deno.land/std@0.224.0/uuid/mod.ts";

// Load environment variables from .env if present
await config({ export: true });

const AUTH_TOKEN = Deno.env.get("AUTH_TOKEN") || "";
const PORT = parseInt(Deno.env.get("PORT") ?? "3000");

const modelMap: Record<string, any> = {
  "claude-3-7-sonnet-20250219": {
    provider: "anthropic",
    name: "claude-3-7-sonnet-latest",
    model_config_display_name: null,
    parameters: {
      max_tokens: 64000,
      temperature: 1,
      top_k: 0,
      top_p: 0,
    },
  },
  "claude-3-7-sonnet-20250219-thinking": {
    provider: "anthropic",
    name: "claude-3-7-sonnet-latest",
    model_config_display_name: null,
    parameters: {
      max_tokens: 64000,
      thinking: {
        type: "enabled",
        budget_tokens: 32000,
      },
    },
  },
  "claude-sonnet-4-20250514": {
    provider: "anthropic",
    name: "claude-sonnet-4-20250514",
    model_config_display_name: null,
    parameters: {
      max_tokens: 64000,
      temperature: 1,
      top_k: 0,
      top_p: 0,
    },
  },
  "claude-sonnet-4-20250514-thinking": {
    provider: "anthropic",
    name: "claude-sonnet-4-20250514",
    model_config_display_name: null,
    parameters: {
      max_tokens: 64000,
      thinking: {
        type: "enabled",
        budget_tokens: 32000,
      },
    },
  },
  "claude-opus-4-20250514": {
    provider: "anthropic",
    name: "claude-opus-4-20250514",
    model_config_display_name: null,
    parameters: {
      max_tokens: 32000,
      temperature: 1,
      top_k: 0,
      top_p: 0,
    },
  },
  "claude-opus-4-20250514-thinking": {
    provider: "anthropic",
    name: "claude-opus-4-20250514",
    model_config_display_name: null,
    parameters: {
      max_tokens: 32000,
      thinking: {
        type: "enabled",
        budget_tokens: 16000,
      },
    },
  },
  "o4-mini": {
    provider: "openai",
    name: "o4-mini",
    model_config_display_name: null,
    parameters: {
      response_format: {
        type: "text",
      },
      reasoning_effort: "high",
      max_completion_tokens: 100000,
    },
  },
  "chatgpt-4o-latest": {
    provider: "openai",
    name: "chatgpt-4o-latest",
    model_config_display_name: null,
    parameters: {
      temperature: 1,
      seed: 0,
      response_format: null,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
  },
  "gpt-4.1": {
    provider: "openai",
    name: "gpt-4.1",
    model_config_display_name: null,
    parameters: {
      temperature: 1,
      seed: 0,
      response_format: null,
      top_p: 1,
    },
  },
  "gpt-4.5-preview": {
    provider: "openai",
    name: "gpt-4.5-preview",
    model_config_display_name: null,
    parameters: {
      temperature: 1,
      seed: 0,
      response_format: null,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
  },
};

const verify = async (ctx: any, next: () => Promise<unknown>) => {
  const auth = ctx.request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }
  const token = auth.replace("Bearer ", "");
  if (token !== AUTH_TOKEN) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }
  await next();
};

const router = new Router();

router.get("/v1/models", (ctx) => {
  ctx.response.body = Object.keys(modelMap).map((id) => ({
    id,
    object: "model",
    ...modelMap[id],
  }));
});

router.post("/v1/chat/completions", verify, async (ctx) => {
  const body = await ctx.request.body({ type: "json" }).value;
  const messages = body.messages ?? [];
  const model = body.model;
  ctx.response.body = {
    id: `chatcmpl-${v4.generate()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: JSON.stringify(messages) },
        finish_reason: "stop",
      },
    ],
  };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });

