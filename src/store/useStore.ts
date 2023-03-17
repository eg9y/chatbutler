import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
	NodeMouseHandler,
} from 'reactflow';

import initialNodes from './initialNodes';
import initialEdges from './initialEdges';
import { Inputs } from '../nodes/types/Input';
import {
	CustomNode,
	InputNode,
	LLMPromptNodeDataType,
	NodeTypesEnum,
	TextInputNodeDataType,
} from '../nodes/types/NodeTypes';
import storage from './storage';
import { Graph } from './Graph';
import { getOpenAIResponse } from '../openAI/openAI';

export interface RFState {
	uiErrorMessage: string | null;
	unlockGraph: boolean;
	setUiErrorMessage: (message: string | null) => void;
	openAIApiKey: string | null;
	setOpenAiKey: (key: string | null) => void;
	nodes: CustomNode[];
	edges: Edge[];
	selectedNode: CustomNode | null;
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	onEdgesDelete: OnEdgesDelete;
	onNodeDragStop: NodeMouseHandler;
	onConnect: OnConnect;
	onAdd: (
		type: NodeTypesEnum,
		position: {
			x: number;
			y: number;
		},
	) => void;
	getInputNodes: (inputs: Set<string>) => InputNode[];

	// TODO: type this
	updateNode: any;
	updateInputExample: any;

	getSortedNodes: () => CustomNode[];
	runGraph: (sortedNodes: CustomNode[], sortedNodeIndex: number) => void;
	clearAllNodeResponses: () => void;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>()(
	persist(
		(set, get) => ({
			unlockGraph: true,
			uiErrorMessage: null,
			openAIApiKey: null,
			// get nodes from local storage or use initial nodes
			nodes: initialNodes,
			edges: initialEdges,
			selectedNode: null,
			setUiErrorMessage: (message: string | null) => {
				set({
					uiErrorMessage: message,
				});
			},
			setOpenAiKey: (key: string | null) => {
				if (key) {
					window.localStorage.setItem('openAIKey', key);
					set({
						openAIApiKey: key,
					});
				} else {
					window.localStorage.removeItem('openAIKey');
					set({
						openAIApiKey: key,
					});
				}
			},
			onNodeDragStop: (_: React.MouseEvent<Element, MouseEvent>, node: CustomNode) => {
				set({
					selectedNode: node,
				});
			},
			onNodesChange: (changes: NodeChange[]) => {
				const nodes = get().nodes;
				set({
					nodes: applyNodeChanges(changes, nodes),
				});
			},
			onEdgesChange: (changes: EdgeChange[]) => {
				set({
					edges: applyEdgeChanges(changes, get().edges),
				});
			},
			onConnect: (connection: Connection) => {
				const nodes = get().nodes;
				const targetNode = nodes.find((n) => n.id === connection.target);
				if (targetNode && targetNode.type === NodeTypesEnum.llmPrompt) {
					if (connection.source) {
						targetNode.data.inputs.addInput(connection.source, nodes as InputNode[]);
					}
				}

				set({
					edges: addEdge(connection, get().edges),
				});
			},
			onEdgesDelete: (edges: Edge[]) => {
				const nodes = get().nodes;
				let selectedNode = get().selectedNode;

				const updatedNodes = nodes.map((node) => {
					if (node.type === NodeTypesEnum.llmPrompt && node.data.inputs) {
						const edgesToDelete = edges
							.filter((edge) => edge.target === node.id)
							.map((edge) => edge.source);
						if (edgesToDelete) {
							node.data.inputs.deleteInputs(edgesToDelete);
							if (node.id === get().selectedNode?.id) {
								selectedNode = node;
							}
						}
					}
					return node;
				});
				set({
					nodes: updatedNodes,
					selectedNode,
				});
			},
			onAdd: (
				type: NodeTypesEnum,
				position: {
					x: number;
					y: number;
				},
			) => {
				const x = position.x;
				const y = position.y;

				const nodes = get().nodes;

				// TODO: set different defaults based on the node type (e.g. text input won't include a prompt field)
				const nodeLength = nodes.length + 1;
				set({
					nodes: nodes.concat({
						id: `${type}-${nodeLength}`,
						type,
						position: {
							x,
							y,
						},
						data: {
							name: `test prompt ${nodeLength}`,
							prompt: `This is a test prompt ${nodeLength}`,
							isLoading: false,
							model: 'text-davinci-003',
							temperature: 0.7,
							max_tokens: 256,
							top_p: 1,
							frequency_penalty: 0.0,
							presence_penalty: 0.0,
							best_of: 1,
							inputs: new Inputs(),
							response: '',
							isBreakpoint: false,
						},
					}),
				});
			},

			getInputNodes: (inputs: Set<string>) => {
				const nodes = get().nodes;
				const inputNodes = nodes.filter((node) => inputs.has(node.id));
				return inputNodes as InputNode[];
			},

			updateNode: (nodeId: string, data: LLMPromptNodeDataType & TextInputNodeDataType) => {
				let selectedNode: Node | null = null;
				const nodes = get().nodes.map((node) => {
					if (node.id === nodeId) {
						// it's important to create a new object here, to inform React Flow about the changes
						node.data = { ...data };
						selectedNode = node;
					}

					return node;
				});

				// update inputs of target nodes
				const edges = get().edges;
				const targetEdges = edges.filter((e) => e.source === nodeId);
				const targetNodes = nodes.filter((n) =>
					targetEdges.map((e) => e.target).includes(n.id),
				);
				targetNodes.forEach((targetNode) => {
					targetNode.data.inputs.updateInput(nodeId, nodes as InputNode[]);
				});

				set({
					nodes,
					selectedNode,
				});
			},
			updateInputExample: (nodeId: string, inputId: string, value: string, index: number) => {
				let selectedNode: Node | null = null;
				const nodes = get().nodes.map((node) => {
					if (node.id === nodeId) {
						node.data.inputs.handleInputExampleChange(inputId, value, index);
						selectedNode = node;
					}

					return node;
				});

				set({
					nodes,
					selectedNode,
				});
			},

			getSortedNodes: () => {
				const nodes = get().nodes;
				const edges = get().edges;

				const graph = new Graph();
				edges.forEach((edge) => {
					graph.addEdge(edge.source, edge.target);
				});

				const sorted = graph.topologicalSort();

				// get nodes in the order of the sorted array
				const sortedNodes = sorted.map((id) =>
					nodes.find((n) => n.id === id),
				) as CustomNode[];

				return sortedNodes;
			},

			clearAllNodeResponses: () => {
				const nodes = get().nodes;
				const updatedNodes = nodes.map((node) => {
					if (node.type === NodeTypesEnum.llmPrompt) {
						node.data.response = '';
					}
					return node;
				});
				set({
					nodes: updatedNodes,
				});
			},

			runGraph: async (sortedNodes: CustomNode[], sortedNodeIndex: number) => {
				set({
					unlockGraph: false,
				});
				try {
					if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.llmPrompt) {
						sortedNodes[sortedNodeIndex].data = {
							...sortedNodes[sortedNodeIndex].data,
							isLoading: true,
							response: '',
						};
						set({
							nodes: [...sortedNodes],
						});
						// get response from nodes with inputs
						const inputs = sortedNodes[sortedNodeIndex].data.inputs;
						if (inputs) {
							const response = await getOpenAIResponse(
								get().openAIApiKey,
								sortedNodes[sortedNodeIndex].data,
								get().getInputNodes(inputs.inputs),
							);
							// const mockResponse = {
							// 	data: {
							// 		choices: [
							// 			{
							// 				text:
							// 					Math.random().toString(36).substring(2, 15) +
							// 					Math.random().toString(36).substring(2, 15),
							// 			},
							// 		],
							// 	},
							// };
							// const completion = mockResponse.data.choices[0].text;
							const completion = response.data.choices[0].text;
							if (completion) {
								sortedNodes[sortedNodeIndex].data = {
									...sortedNodes[sortedNodeIndex].data,
									response: completion,
									isLoading: false,
								};
							}
						}
					}
					set({
						nodes: [...sortedNodes],
						selectedNode: null,
						unlockGraph: true,
					});
				} catch (error: any) {
					throw new Error(error);
				} finally {
					sortedNodes[sortedNodeIndex].data.isLoading = false;
					set({
						nodes: [...sortedNodes],
						unlockGraph: true,
					});
				}
			},
		}),
		{
			name: 'promptsandbox.io',
			storage,
		},
	),
);

export const selector = (state: RFState) => ({
	...state,
});

export default useStore;
