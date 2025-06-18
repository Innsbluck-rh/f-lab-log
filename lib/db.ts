// lib/logs.ts

export const kv = await Deno.openKv();

export const uuid = () => crypto.randomUUID();
