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

interface RFState {
	uiErrorMessage: string | null;
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
	onAdd: (type: NodeTypesEnum, x: number, y: number) => void;

	// TODO: type this
	updateNode: any;
	updateInputExample: any;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>()(
	persist(
		(set, get) => ({
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
						targetNode.data.inputs.addInput(connection.source, nodes as InputNode[]);
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
			onAdd: (type: NodeTypesEnum, x = 0, y = 0) => {
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
							model: 'text-davinci-003',
							temperature: 0.7,
							max_tokens: 256,
							top_p: 1,
							frequency_penalty: 0.0,
							presence_penalty: 0.0,
							best_of: 1,
							inputs: new Inputs(),
							response: '',
						},
					}),
				});
			},
			updateNode: (nodeId: string, data: LLMPromptNodeDataType & TextInputNodeDataType) => {
				// console.log("updateNode called");
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
				// console.log("updateInputExample called");
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
		}),
		{
			name: 'promptsandbox.io',
			storage: {
				getItem: (name) => {
					const str = localStorage.getItem(name);
					const obj = str ? JSON.parse(str) : null;

					// convert nodes.data.inputs
					const nodes: CustomNode[] = obj.state.nodes.map((node: CustomNode) => {
						if (node.type === 'textInput') {
							return node;
						}
						const inputSet = new Set(node.data.inputs.inputs);
						return {
							...node,
							data: {
								...node.data,
								inputs: new Inputs(
									inputSet,
									node.data.inputs.inputNodes,
									node.data.inputs.inputExamples,
								),
							},
						};
					});

					return {
						state: {
							...(obj ? obj.state : {}),
							nodes,
						},
					};
				},
				setItem: (name, newValue: { state: RFState }) => {
					const str = JSON.stringify({
						state: {
							...newValue.state,
							nodes: newValue.state.nodes.map((node: CustomNode) => {
								if (node.type === 'textInput') {
									return node;
								}
								return {
									...node,
									data: {
										...node.data,
										inputs: {
											...node.data.inputs,
											inputs: [...node.data.inputs.inputs],
										},
									},
								};
							}),
						},
					});
					localStorage.setItem(name, str);
				},
				removeItem: (name) => localStorage.removeItem(name),
			},
		},
	),
);

export const selector = (state: RFState) => ({
	...state,
});

export default useStore;
