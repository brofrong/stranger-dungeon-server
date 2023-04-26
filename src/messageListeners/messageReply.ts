import { eventEnum } from "../messageListeners.ts";
import { MessageData, wsManager } from "../wsManager.ts";

export const onMessageReply = ({ data, sender }: MessageData) => {
  wsManager.sendMessageEveryone({ event: eventEnum.MSG, data: data }, sender);
};
