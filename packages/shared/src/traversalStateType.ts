import { Edge } from "reactflow";
import { Message } from "./types/MessageTypes";
import { CustomNode } from "./types/NodeTypes";

export type TraversalStateType = {
  visited: Set<string>;
  skipped: Set<string>;
  stack: string[];
  nodes: CustomNode[];
  edges: Edge[];
  // nodesLengthToVisit: number;
  chatHistory: Message[];
};
