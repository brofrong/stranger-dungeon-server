import { generate } from "https://deno.land/std@0.184.0/uuid/v1.ts";
import { WS, userInfo } from "../types/Websocket.type.ts";

function generateUserId(): string {
  return generate().toString();
}

export function createUser(ws: WS): string {
  const id = generateUserId();
  Object.assign(ws.data, { id });
  return id;
}
