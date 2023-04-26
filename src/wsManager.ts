import { env } from "./helpers/env.ts";
import { EventEmitter } from "./helpers/eventEmitter.ts";
import { eventEnum, initListeners } from "./messageListeners.ts";
import { WS } from "./types/Websocket.type.ts";
import { User, WebSocketUser } from "./user/user.d.ts";

export type MessageData = { data: any; sender: User };
export type WSEvent = { event: eventEnum; data: any };

let channel = new BroadcastChannel("ws");

class WSManager {
  public connectedUsers = new Map<string, WebSocketUser>();

  public messageEmitter = new EventEmitter<MessageData>();

  constructor() {
    initListeners(this.messageEmitter);
  }

  public sendMessageEveryone(
    event: WSEvent,
    sender: User,
    options?: { replyToSender: boolean }
  ) {
    const toSendUsers = this.connectedUsers;
    if (!options?.replyToSender) {
      toSendUsers.delete(sender.id);
    }

    toSendUsers.forEach((u) => {
      if (env.ServerRegion !== u.user.region) {
        channel.postMessage(JSON.stringify(event));
      } else {
        u.ws.send(JSON.stringify(event));
      }
    });
  }
}

export const wsManager = new WSManager();

export function wsOnOpen(this: WS, event: Event) {
  console.log(`user ${this.user.id}  ${this.user.username} connected`);
  wsManager.connectedUsers.set(this.user.id, { user: this.user, ws: this });
  channel.postMessage(
    JSON.stringify({
      event: eventEnum.JOIN_WS,
      data: { user: this.user, ws: null },
    })
  );
}

channel.onmessage = (event: MessageEvent) => {
  try {
    const parsedData: WSEvent = JSON.parse(event.data);
    switch (parsedData.event) {
      case eventEnum.JOIN_WS: {
        const user: WebSocketUser = parsedData.data;
        wsManager.connectedUsers.set(user.user.id, user);
        break;
      }
      case eventEnum.DISCONNECT_WS: {
        const user: WebSocketUser = parsedData.data;
        wsManager.connectedUsers.delete(user.user.id);
        break;
      }
      default: {
        const messageData: MessageData = parsedData.data;
        wsManager.messageEmitter.emit(parsedData.event, messageData);
      }
    }
  } catch (e) {
    console.error(`invalid data ${event.data}`);
  }
};

export function wsOnMassage(this: WS, event: MessageEvent) {
  try {
    const parsedData = JSON.parse(event.data);
    wsManager.messageEmitter.emit(parsedData.event, {
      data: parsedData.data,
      sender: this.user,
    });
  } catch (e) {
    console.error(`invalid data ${event.data}`);
  }
}

export function wsOnError(this: WS, event: Event | ErrorEvent) {
  console.error(JSON.stringify(event));
}

export function wsOnCLose(this: WS, event: CloseEvent) {
  if (!this.user.id) {
    console.error("on close user don't connected");
    return;
  }
  console.log(`user ${this.user.id} disconnected`);
  wsManager.connectedUsers.delete(this.user.id);
  channel.postMessage(
    JSON.stringify({
      event: eventEnum.DISCONNECT_WS,
      data: { user: this.user },
    })
  );
}
