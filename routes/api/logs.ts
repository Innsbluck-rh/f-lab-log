// routes/api/logs.ts
import { Handlers } from "$fresh/server.ts";
import { getLogs, insertLog } from "../../lib/db.ts";

export const handler: Handlers = {
  GET(_req) {
    const logs = getLogs();
    return new Response(JSON.stringify(logs), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async POST(req) {
    const data = await req.json();
    const { date, title, content } = data;
    if (!date || !title || !content) {
      return new Response("Missing fields", { status: 400 });
    }
    insertLog(date, title, content);
    return new Response("OK", { status: 200 });
  },
};
