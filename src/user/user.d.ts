import { WS } from "../types/Websocket.type.ts";

type User = {
  id: string;
  username: string;
  region: string;
};

type WebSocketUser = { user: User; ws: WS };
