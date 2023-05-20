"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageHistory = void 0;
const index_js_1 = require("../../schema/index.cjs");
class ChatMessageHistory extends index_js_1.BaseChatMessageHistory {
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
        this.messages.push(new index_js_1.HumanChatMessage(message));
    }
    async addAIChatMessage(message) {
        this.messages.push(new index_js_1.AIChatMessage(message));
    }
    async clear() {
        this.messages = [];
    }
}
exports.ChatMessageHistory = ChatMessageHistory;
