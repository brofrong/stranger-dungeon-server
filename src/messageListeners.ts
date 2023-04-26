import { EventEmitter } from "./helpers/eventEmitter.ts";
import { onMessageReply } from "./messageListeners/messageReply.ts";
import { MessageData } from "./wsManager.ts";

export enum eventEnum {
  MSG = "msg",
  // server
  JOIN_WS = "joinWs",
  DISCONNECT_WS = "disconnectWs",
}

export function initListeners(messageEmitter: EventEmitter<MessageData>) {
  messageEmitter.on(eventEnum.MSG, onMessageReply);
}
