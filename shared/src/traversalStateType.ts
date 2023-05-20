import { Edge } from "reactflow";
import { Message } from "./types/MessageTypes";

export type TraversalStateType = {
  visited: Set<string>;
  skipped: Set<string>;
  stack: string[];
  edges: Edge[];
  // nodesLengthToVisit: number;
  chatHistory: Message[];
};
