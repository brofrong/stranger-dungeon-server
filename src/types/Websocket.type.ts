export type userInfo = {
  id?: string;
};

export type WS = {
  data: userInfo;
  onopen: (this: WS, event: Event) => void;
  onmessage: (this: WS, event: MessageEvent) => void;
  onerror: (this: WS, event: Event | ErrorEvent) => void;
  onclose: (this: WS, event: CloseEvent) => void;
} & Omit<WebSocket, "onopen" | "onmessage" | "onerror" | "onclose">;
