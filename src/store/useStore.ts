import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
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
import {
	ChatMessageNodeDataType,
	ChatPromptNodeDataType,
	CustomNode,
	InputNode,
	LLMPromptNodeDataType,
	NodeTypesEnum,
	TextInputNodeDataType,
} from '../nodes/types/NodeTypes';
import storage from './storage';
import { Graph } from './Graph';
import runGraph from './runGraph';
import onAdd from './onAdd';
import onConnect from './onConnect';
import onEdgesDelete from './onEdgesDelete';
import onPlaceholderAdd from './onPlaceholderAdd';
import updateNode from './updateNode';
import getChatPaths from './getChatPaths';

export type UseStoreSetType = (
	partial: RFState | Partial<RFState> | ((state: RFState) => RFState | Partial<RFState>),
	replace?: boolean | undefined,
) => void;

export interface RFState {
	getChatPaths: (rootNode: Node<ChatMessageNodeDataType | ChatPromptNodeDataType>) => string[][];
	uiErrorMessage: string | null;
	unlockGraph: boolean;
	clearGraph: () => void;
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

	getSortedNodesAndRootNodes: () => {
		sortedNodes: CustomNode[];
		rootNodes: CustomNode[];
	};
	runGraph: (
		sortedNodes: CustomNode[],
		sortedNodeIndex: number,
		chatPromptSequence: {
			[chatPrompt: string]: string[];
		},
	) => void;
	clearAllNodeResponses: () => void;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>()(
	persist(
		(set, get) => ({
			clearGraph: () => {
				set({
					nodes: [],
					edges: [],
					selectedNode: null,
				});
			},
			chatSessions: {},
			unlockGraph: true,
			uiErrorMessage: null,
			openAIApiKey: null,
			// get nodes from local storage or use initial nodes
			nodes: initialNodes,
			edges: initialEdges,
			selectedNode: null,
			getChatPaths: (rootNode: Node<ChatMessageNodeDataType | ChatPromptNodeDataType>) => {
				return getChatPaths(get, rootNode);
			},
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
				return onConnect(get, set, connection);
			},
			onEdgesDelete: (edges: Edge[]) => {
				return onEdgesDelete(get, set, edges);
			},
			onAdd: (
				type: NodeTypesEnum,
				position: {
					x: number;
					y: number;
				},
				parentNode?: string,
			) => {
				return onAdd(get, set, type, position, parentNode);
			},
			onPlaceholderAdd: (placeholderId: string, type: NodeTypesEnum) => {
				return onPlaceholderAdd(get, set, placeholderId, type);
			},
			getInputNodes: (inputs: Set<string>) => {
				const nodes = get().nodes;
				const inputNodes = nodes.filter((node) => inputs.has(node.id));

				return inputNodes as InputNode[];
			},

			updateNode: (nodeId: string, data: LLMPromptNodeDataType & TextInputNodeDataType) => {
				return updateNode(get, set, nodeId, data);
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

			getSortedNodesAndRootNodes: () => {
				const nodes = get().nodes;
				const edges = get().edges;

				const graph = new Graph();
				edges.forEach((edge) => {
					graph.addEdge(edge.source, edge.target);
				});

				const sorted = graph.topologicalSort();
				const roots = graph.getRootNodes();

				// get nodes in the order of the sorted array
				const sortedNodes = sorted.map((id) =>
					nodes.find((n) => n.id === id),
				) as CustomNode[];
				const rootNodes = roots.map((id) => nodes.find((n) => n.id === id)) as CustomNode[];

				return {
					sortedNodes,
					rootNodes,
				};
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
			runGraph: (
				sortedNodes: CustomNode[],
				sortedNodeIndex: number,
				chatPromptSequence: {
					[chatPrompt: string]: string[];
				},
			) => {
				return runGraph(get, set, sortedNodes, sortedNodeIndex, chatPromptSequence);
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
