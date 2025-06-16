import { Handlers } from "$fresh/server.ts";
import { CSS, render } from "@deno/gfm";

export const handler: Handlers = {
  async POST(req) {
    const data = await req.json();
    return new Response(
      JSON.stringify({
        rendered: render(data.content),
        css: CSS,
      }),
      { status: 200 },
    );
  },
};
