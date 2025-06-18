import { Handlers } from "$fresh/server.ts";
import { aggregateBy } from "../../../../../../lib/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { year, month } = ctx.params;
    const articles = await aggregateBy(year, month);
    return new Response(JSON.stringify(articles), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
