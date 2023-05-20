import { BaseChatMessage, BaseChatMessageHistory } from "../../schema/index.js";
export declare class ChatMessageHistory extends BaseChatMessageHistory {
    private messages;
    constructor(messages?: BaseChatMessage[]);
    getMessages(): Promise<BaseChatMessage[]>;
    addUserMessage(message: string): Promise<void>;
    addAIChatMessage(message: string): Promise<void>;
    clear(): Promise<void>;
}
