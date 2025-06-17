import { Handlers } from "$fresh/server.ts";
import { CSS } from "@deno/gfm";

export const handler: Handlers = {
  GET(_req) {
    return new Response(
      JSON.stringify({
        css: CSS,
      }),
      { status: 200 },
    );
  },
};
