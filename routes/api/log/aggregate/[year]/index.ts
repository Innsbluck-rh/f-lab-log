import { Handlers } from "$fresh/server.ts";
import { aggregateBy } from "../../../../../lib/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { year } = ctx.params;
    const articles = await aggregateBy(year);
    return new Response(JSON.stringify(articles), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
