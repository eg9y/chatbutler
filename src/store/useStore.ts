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
	MarkerType,
} from 'reactflow';

import initialNodes from './initialNodes';
import initialEdges from './initialEdges';
import { Inputs } from '../nodes/types/Input';
import {
	CustomNode,
	InputNode,
	LLMPromptNodeDataType,
	NodeTypesEnum,
	PlaceholderDataType,
	TextInputNodeDataType,
} from '../nodes/types/NodeTypes';
import storage from './storage';
import { Graph } from './Graph';
import { getOpenAIResponse, parsePromptInputs } from '../openai/openai';

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
		parentNode?: string,
	) => void;
	onPlaceholderAdd: (placeholderId: string, type: NodeTypesEnum) => void;
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
				const selectedNode = get().selectedNode;
				const isSelectedNodeDeleted = changes.some(
					(change) => change.type === 'remove' && change.id === selectedNode?.id,
				);

				const update: any = {
					nodes: applyNodeChanges(changes, nodes),
				};
				if (isSelectedNodeDeleted) {
					update.selectedNode = null;
				}
				set(update);
			},
			onEdgesChange: (changes: EdgeChange[]) => {
				set({
					edges: applyEdgeChanges(changes, get().edges),
				});
			},
			onConnect: (connection: Connection) => {
				const nodes = get().nodes;
				const targetNode = nodes.find((n) => n.id === connection.target);
				if (
					targetNode &&
					connection.source &&
					connection.sourceHandle !== 'placeholder' &&
					connection.sourceHandle !== 'chat-prompt-start'
				) {
					targetNode.data.inputs.addInput(connection.source, nodes as InputNode[]);
				}

				set({
					edges: addEdge(connection, get().edges),
				});
			},
			onEdgesDelete: (edges: Edge[]) => {
				const nodes = get().nodes;
				let selectedNode = get().selectedNode;

				const updatedNodes = nodes.map((node) => {
					if (node.data.inputs) {
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
				parentNode?: string,
			) => {
				const x = position.x;
				const y = position.y;

				const nodes = get().nodes;

				// TODO: set different defaults based on the node type (e.g. text input won't include a prompt field)
				const nodeLength = nodes.length + 1;

				let node: CustomNode | null = null;
				if (type === NodeTypesEnum.llmPrompt) {
					node = {
						id: `${type}-${nodeLength}`,
						type,
						position: {
							x,
							y,
						},
						data: {
							name: `test prompt ${nodeLength}`,
							text: `This is a test prompt ${nodeLength}`,
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
							stop: [],
						},
					};
				} else if (type === NodeTypesEnum.textInput) {
					node = {
						id: `${type}-${nodeLength}`,
						type,
						position: {
							x,
							y,
						},
						data: {
							name: `test input ${nodeLength}`,
							text: `This is a test input ${nodeLength}`,
							inputs: new Inputs(),
							response: `This is a test input ${nodeLength}`,
							isLoading: false,
							isBreakpoint: false,
						},
					};
				} else if (type === NodeTypesEnum.chatPrompt) {
					const nodeId = `${type}-${nodeLength}`;
					node = {
						id: nodeId,
						type,
						position: {
							x,
							y,
						},
						data: {
							name: `test prompt ${nodeLength}`,
							text: `this is a system message ${nodeLength}`,
							isLoading: false,
							model: 'gpt-4',
							temperature: 0.7,
							max_tokens: 256,
							top_p: 1,
							frequency_penalty: 0.0,
							presence_penalty: 0.0,
							best_of: 1,
							inputs: new Inputs(),
							response: '',
							isBreakpoint: false,
							stop: [],
						},
					};

					const placeHolderId = `placeholder-${nodeId}-${nodeLength}`;
					const placeHolderNode: Node<PlaceholderDataType> = {
						id: placeHolderId,
						type: NodeTypesEnum.placeholder,
						parentNode: nodeId,
						position: {
							x: 600,
							y: 0,
						},
						data: {
							typeToCreate: NodeTypesEnum.chatExample,
							name: `placeholder ${nodeId}`,
							text: `placeholder ${nodeId}`,
							inputs: new Inputs(),
							response: `placeholder ${nodeId}`,
							isLoading: false,
							isBreakpoint: false,
						},
					};

					const nodeChanges = nodes.concat(node);
					set({
						nodes: nodeChanges,
					});
					set({
						nodes: nodeChanges.concat(placeHolderNode),
					});

					const edges = get().edges;

					const edge = {
						id: `${nodeId}-${placeHolderId}`,
						source: nodeId,
						target: placeHolderId,
						type: 'smoothstep',
						animated: false,
						style: {
							strokeWidth: 2,
							stroke: '#808080',
							strokeDasharray: '5,5',
						},
						markerEnd: {
							type: MarkerType.Arrow,
							width: 20,
							height: 20,
							color: 'rgb(0,0,0,0)',
						},
					};
					set({
						edges: edges.concat(edge),
					});
					return;
				} else if (type === NodeTypesEnum.chatExample && parentNode) {
					node = {
						id: `${type}-${nodeLength}`,
						type,
						position: {
							x,
							y,
						},
						parentNode,
						data: {
							role: 'user',
							name: `test chat message ${nodeLength}`,
							text: `This is a chat example message ${nodeLength}`,
							inputs: new Inputs(),
							response: `This is a chat example message ${nodeLength}`,
							isLoading: false,
							isBreakpoint: false,
						},
					};
				}

				if (node) {
					set({
						nodes: nodes.concat(node),
					});
				}
			},
			onPlaceholderAdd: (placeholderId: string, type: NodeTypesEnum) => {
				//get placeholder parentId and then remove it placeholderid
				const nodes = get().nodes;
				const placeholderNode = nodes.find((node) => node.id === placeholderId);
				let parentNodeId: string | undefined = '';
				if (!placeholderNode) {
					return;
				}
				parentNodeId = placeholderNode.parentNode;
				// remove
				set({
					nodes: nodes.filter((node) => node.id !== placeholderId),
				});
				get().onAdd(type, placeholderNode.position, parentNodeId);

				if (!parentNodeId) {
					return;
				}

				const edges = get().edges;
				const newNodes = get().nodes;
				const newNode = newNodes.find((node) => node.parentNode === parentNodeId);
				if (!newNode) {
					return;
				}
				const edge = {
					id: `${parentNodeId}-${newNode.id}`,
					source: parentNodeId,
					target: newNode.id,
				};
				console.log('edgeszsds', edge);
				set({
					edges: edges.concat(edge),
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
					if (
						sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.llmPrompt ||
						sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.chatPrompt
					) {
						sortedNodes[sortedNodeIndex].data = {
							...sortedNodes[sortedNodeIndex].data,
							isLoading: true,
							response: '',
						};
						set({
							nodes: [...sortedNodes],
						});
					}
					if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.llmPrompt) {
						// get response from nodes with inputs
						const inputs = sortedNodes[sortedNodeIndex].data.inputs;
						if (inputs) {
							const response = await getOpenAIResponse(
								get().openAIApiKey,
								sortedNodes[sortedNodeIndex].data as LLMPromptNodeDataType,
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
					} else if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.chatPrompt) {
						// get response from nodes with inputs
						const inputs = sortedNodes[sortedNodeIndex].data.inputs;
						if (inputs) {
							const response = await getOpenAIResponse(
								get().openAIApiKey,
								sortedNodes[sortedNodeIndex].data as LLMPromptNodeDataType,
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
					} else if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.textInput) {
						sortedNodes[sortedNodeIndex].data.response = parsePromptInputs(
							sortedNodes[sortedNodeIndex].data.text,
							get().getInputNodes(sortedNodes[sortedNodeIndex].data.inputs.inputs),
						);
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
