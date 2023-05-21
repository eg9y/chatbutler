import { NodeTypesEnum } from "./NodeTypes";

export enum MessageType {
  CHATBOT_CHANGE = "chatbot_change",
  NODE_TYPE = "node_type",
}

export interface Message {
  role: "assistant" | "user";
  content: string;
  assistantMessageType?: NodeTypesEnum;
}

export interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}
