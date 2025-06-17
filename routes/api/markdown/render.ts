import { Handlers } from "$fresh/server.ts";
import { render } from "@deno/gfm";

export const handler: Handlers = {
  async POST(req) {
    const data = await req.json();
    return new Response(
      JSON.stringify({
        rendered: render(data.content, {}),
      }),
      { status: 200 },
    );
  },
};
