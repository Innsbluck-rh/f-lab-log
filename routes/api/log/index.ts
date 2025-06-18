import { Handlers } from "$fresh/server.ts";
import { getLogs } from "../../../lib/logs.ts";

export const handler: Handlers = {
  async GET(_req) {
    const logs = await getLogs();
    return new Response(JSON.stringify(logs), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
