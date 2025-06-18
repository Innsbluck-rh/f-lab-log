const kv = await Deno.openKv(
  "https://api.deno.com/databases/35333337-b7d9-4bcb-852d-a3695d95a098/connect",
);

const promises = [];
for await (const entry of kv.list({ prefix: [] })) {
  promises.push(kv.delete(entry.key));
}
await Promise.all(promises);
