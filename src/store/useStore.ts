import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  OnEdgesDelete,
} from "reactflow";

import initialNodes from "./initialNodes";
import initialEdges from "./initialEdges";
import { Inputs } from "../nodes/types/Input";
import {
  CustomNode,
  InputNode,
  LLMPromptNodeDataType,
  NodeTypesEnum,
  TextInputNodeDataType,
} from "../nodes/types/NodeTypes";

interface RFState {
  openAIKey: string;
  setOpenAiKey: (key: string) => void;
  nodes: CustomNode[];
  edges: Edge[];
  selectedNode: CustomNode | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onEdgesDelete: OnEdgesDelete;
  onNodeDragStop: any;
  onConnect: OnConnect;
  onAdd: any;
  updateNode: any;
  updateInputExample: any;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>()((set, get) => ({
  openAIKey: localStorage.getItem("openAIKey") || "",
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  inputNodes: [],
  setOpenAiKey: (key: string) => {
    window.localStorage.setItem("openAIKey", key);
    set({
      openAIKey: key,
    });
  },
  onNodeDragStop: (_: MouseEvent, node: CustomNode) => {
    // console.log("onNodeDragStop called");
    set({
      selectedNode: node,
    });
  },
  onNodesChange: (changes: NodeChange[]) => {
    const nodes = get().nodes;
    // console.log("onNodesChange called");
    set({
      nodes: applyNodeChanges(changes, nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    // console.log("onEdgesChange called");
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    // console.log("onConnect called");
    const nodes = get().nodes;
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (targetNode && targetNode.type === NodeTypesEnum.llmPrompt) {
      if (connection.source) {
        targetNode.data.inputs.addInput(
          connection.source,
          nodes as InputNode[]
        );
      }
    }

    set({
      edges: addEdge(connection, get().edges),
    });
  },
  onEdgesDelete: (edges: Edge[]) => {
    // console.log("onEdgesDelete called");
    const nodes = get().nodes;
    const edgesToDelete = edges.map((e) => e.source);
    let selectedNode = get().selectedNode;
    const updatedNodes = nodes.map((node) => {
      if (node.type === NodeTypesEnum.llmPrompt && node.data.inputs) {
        node.data.inputs.deleteInputs(edgesToDelete);
        if (node.id === get().selectedNode?.id) {
          selectedNode = node;
        }
      }
      return node;
    });
    set({
      nodes: updatedNodes,
      selectedNode,
    });
  },
  onAdd: (type: NodeTypesEnum, x: number = 0, y: number = 0) => {
    // console.log("onAdd called");
    const nodes = get().nodes;

    // TODO: set different defaults based on the node type (e.g. text input won't include a prompt field)
    set({
      nodes: nodes.concat({
        id: `${type}-${nodes.length + 1}`,
        type,
        position: { x, y },
        data: {
          name: `test prompt ${nodes.length + 1}`,
          prompt: `This is a test prompt ${nodes.length + 1}`,
          model: "text-davinci-003",
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          best_of: 1,
          inputs: new Inputs(),
          response: "",
        },
      }),
    });
  },
  updateNode: (
    nodeId: string,
    llmPrompt: LLMPromptNodeDataType & TextInputNodeDataType
  ) => {
    // console.log("updateNode called");
    let selectedNode: Node | null = null;
    const nodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        // it's important to create a new object here, to inform React Flow about the changes
        node.data = { ...llmPrompt };
        selectedNode = node;
      }

      return node;
    });

    // update inputs of target nodes
    const edges = get().edges;
    const targetEdges = edges.filter((e) => e.source === nodeId);
    const targetNodes = nodes.filter((n) =>
      targetEdges.map((e) => e.target).includes(n.id)
    );
    targetNodes.forEach((targetNode) => {
      targetNode.data.inputs.updateInput(nodeId, nodes as InputNode[]);
    });

    set({
      nodes,
      selectedNode,
    });
  },
  updateInputExample: (
    nodeId: string,
    name: string,
    value: string,
    index: number
  ) => {
    // console.log("updateInputExample called");
    let selectedNode: Node | null = null;
    const nodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        node.data.inputs.handleInputExampleChange(name, value, index);
        selectedNode = node;
      }

      return node;
    });

    set({
      nodes,
      selectedNode,
    });
  },
}));

export const selector = (state: RFState) => ({
  ...state,
});

export default useStore;
