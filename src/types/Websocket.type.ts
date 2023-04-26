import { User } from "../user/user.d.ts";

export type WS = {
  user: User;
  onopen: (this: WS, event: Event) => void;
  onmessage: (this: WS, event: MessageEvent) => void;
  onerror: (this: WS, event: Event | ErrorEvent) => void;
  onclose: (this: WS, event: CloseEvent) => void;
} & Omit<WebSocket, "onopen" | "onmessage" | "onerror" | "onclose">;
