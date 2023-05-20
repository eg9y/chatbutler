import { HumanChatMessage, AIChatMessage, BaseChatMessageHistory, } from "../../schema/index.js";
export class ChatMessageHistory extends BaseChatMessageHistory {
    constructor(messages) {
        super();
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.messages = messages ?? [];
    }
    async getMessages() {
        return this.messages;
    }
    async addUserMessage(message) {
        this.messages.push(new HumanChatMessage(message));
    }
    async addAIChatMessage(message) {
        this.messages.push(new AIChatMessage(message));
    }
    async clear() {
        this.messages = [];
    }
}
