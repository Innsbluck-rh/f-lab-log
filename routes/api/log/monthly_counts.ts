import { Handlers } from "$fresh/server.ts";
import { getMonthlyCounts } from "../../../lib/logs.ts";

export const handler: Handlers = {
  async GET(_req) {
    const monthlyCounts = await getMonthlyCounts();
    return new Response(JSON.stringify(monthlyCounts), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
