import { Status } from "https://deno.land/std@0.183.0/http/http_status.ts";
import {
  Application,
  Router,
  RouterContext,
} from "https://deno.land/x/oak@v12.2.0/mod.ts";

export const setRouter = (app: Application<Record<string, any>>) => {
  const router = new Router();
  router.get("/ws", async (ctx) => {
    if (!ctx.isUpgradable) {
      ctx.throw(Status.BadRequest, "cant Upgrade to websocket");
      return;
    }
    const socket = await ctx.upgrade();
    const username = ctx.request.url.searchParams.get("username");
    if (connectedClients.has(username)) {
      socket.close(1008, `Username ${username} is already taken`);
      return;
    }
    socket.username = username;
    connectedClients.set(username, socket);
    console.log(`New client connected: ${username}`);

    // broadcast the active users list when a new user logs in
    socket.onopen = () => {
      broadcast_usernames();
    };

    // when a client disconnects, remove them from the connected clients list
    // and broadcast the active users list
    socket.onclose = () => {
      console.log(`Client ${socket.username} disconnected`);
      connectedClients.delete(socket.username);
      broadcast_usernames();
    };

    // broadcast new message if someone sent one
    socket.onmessage = (m) => {
      const data = JSON.parse(m.data);
      switch (data.event) {
        case "send-message":
          broadcast(
            JSON.stringify({
              event: "send-message",
              username: socket.username,
              message: data.message,
            })
          );
          break;
      }
    };
  });
  app.use(router.routes());
  app.use(router.allowedMethods());
};

const connectedClients = new Map();
// send a message to all connected clients
function broadcast(message: string) {
  for (const client of connectedClients.values()) {
    client.send(message);
  }
}

// send updated users list to all connected clients
function broadcast_usernames() {
  const usernames = [...connectedClients.keys()];
  console.log(
    "Sending updated username list to all clients: " + JSON.stringify(usernames)
  );
  broadcast(
    JSON.stringify({
      event: "update-users",
      usernames: usernames,
    })
  );
}
