import { Handlers } from "$fresh/server.ts";
import { aggregateBy } from "../../../../../lib/db.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const { year } = ctx.params;
    const articles = aggregateBy(year);
    return new Response(JSON.stringify(articles), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
