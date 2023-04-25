// import { Application } from "https://deno.land/x/oak@v12.2.0/mod.ts";
// import { setRouter } from "./src/router.ts";

// const app = new Application();
// const port = 8000;

// setRouter(app);

// console.log("Listening at http://localhost:" + port);
// await app.listen({ port });

import { serve } from "https://deno.land/std@0.184.0/http/server.ts";

serve((req) => {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    console.log("socket message:", e.data);
    socket.send(new Date().toString());
  };
  socket.onerror = (e) => console.log("socket errored:", e.toString());
  socket.onclose = () => console.log("socket closed");
  return response;
});
