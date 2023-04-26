import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import { WS } from "./src/types/Websocket.type.ts";
import {
  wsOnCLose,
  wsOnError,
  wsOnMassage,
  wsOnOpen,
} from "./src/wsManager.ts";
import { getUserFromUrl } from "./src/user/user.ts";

serve((req) => {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  const user = getUserFromUrl(req.url);

  const ws: WS = Object.assign(socket, { user }) as any;

  ws.onopen = wsOnOpen;
  ws.onmessage = wsOnMassage;
  ws.onerror = wsOnError;
  ws.onclose = wsOnCLose;

  return response;
});
