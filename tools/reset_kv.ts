const kv = await Deno.openKv();

const promises = [];
for await (const entry of kv.list({ prefix: [] })) {
  promises.push(kv.delete(entry.key));
}
await Promise.all(promises);
