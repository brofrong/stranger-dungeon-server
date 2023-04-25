import { WS, userInfo } from "./types/Websocket.type.ts";
import { createUser } from "./user/user.ts";

const connectedUsers = new Map<string, WS>();

export function wsOnOpen(this: WS, event: Event) {
  const user = this.data;
  if (!user.id) {
    user.id = createUser(this);
  }
  console.log(`user ${user.id} connected`);
  connectedUsers.set(user.id, this);
}

export function wsOnMassage(this: WS, event: MessageEvent) {
  connectedUsers.forEach((ws, userId) => {
    if (this.data.id === userId) return;
    ws.send(event.data);
  });
}

export function wsOnError(this: WS, event: Event | ErrorEvent) {
  console.error(JSON.stringify(event));
}

export function wsOnCLose(this: WS, event: CloseEvent) {
  if (!this.data.id) {
    console.error("on close user don't connected");
    return;
  }
  console.log(`user ${this.data.id} disconnected`);
  connectedUsers.delete(this.data.id);
}
