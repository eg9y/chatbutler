import {
	ChatSessionType,
	CustomNode,
	Database,
	DocumentDbSchema,
	InputNode,
	LLMPromptNodeDataType,
	LoopDataType,
	NodeTypesEnum,
	SimpleWorkflow,
	TextNodeDataType,
} from '@chatbutler/shared/src/index';
import { SupabaseClient } from '@supabase/supabase-js';
import {
	Connection,
	Edge,
	EdgeChange,
	Node,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	applyEdgeChanges,
	OnEdgesDelete,
	NodeMouseHandler,
	ReactFlowInstance,
} from 'reactflow';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import initialEdges from './initialEdges';
import initialNodes from './initialNodes';
import onAdd from './onAdd';
import onConnect from './onConnect';
import onEdgesDelete from './onEdgesDelete';
import onNodesChange from './onNodesChange';
import onPlaceholderAdd from './onPlaceholderAdd';
import storage from './storage';
import updateNode from './updateNode';
import { RFStateSecret } from './useStoreSecret';
import { runFlow } from '../utils/runFlow';
import { Message } from '../windows/ChatPanel/Chat/types';

export type UseStoreSetType = (
	partial: RFState | Partial<RFState> | ((state: RFState) => RFState | Partial<RFState>),
	replace?: boolean | undefined,
) => void;

export interface RFState {
	setIsDetailMode: (isDetailMode: boolean) => void;
	waitingUserResponse: boolean;
	username: string;
	setUsername: (username: string) => void;
	setWaitingUserResponse: (waiting: boolean) => void;
	pauseResolver: (value: string) => void;
	setPauseResolver: (resolver: (value: string) => void) => void;
	chatApp: Message[];
	setChatApp: (messages: Message[]) => void;
	chatSessions: ChatSessionType[];
	setChatSessions: (chatSessions: ChatSessionType[]) => void;
	currentChatSessionIndex: number;
	setCurrentChatSessionIndex: (index: number) => void;
	documents: DocumentDbSchema[];
	setDocuments: (documents: DocumentDbSchema[]) => void;
	workflows: SimpleWorkflow[];
	setWorkflows: (workflows: SimpleWorkflow[]) => void;
	currentWorkflow: SimpleWorkflow | null;
	setCurrentWorkflow: (workflow: SimpleWorkflow | null) => void;
	reactFlowInstance: ReactFlowInstance | null;
	setReactFlowInstance: (instance: ReactFlowInstance | null) => void;
	unlockGraph: boolean;
	setUnlockGraph: (unlock: boolean) => void;
	clearGraph: () => void;
	notificationMessage: {
		message: string | null;
		status: 'success' | 'error' | 'warning' | 'info';
	} | null;
	setNotificationMessage: (
		message: string | null,
		status?: 'success' | 'error' | 'warning' | 'info',
	) => void;
	nodes: CustomNode[];
	edges: Edge[];
	setNodes: (nodes: CustomNode[]) => void;
	setEdges: (edges: Edge[]) => void;
	selectedNode: CustomNode | null;
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	deleteEdges: (sourceHandle: string) => void;
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
	getNodes: (inputs: string[]) => CustomNode[];

	// TODO: type this
	updateNode: any;
	updateInputExample: any;
	runFlow: (
		getSecret: () => RFStateSecret,
		nodes: CustomNode[],
		edges: Edge[],
		supabase: SupabaseClient<Database>,
		signal: AbortSignal,
	) => Promise<void>;
	clearAllNodeResponses: () => void;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>()(
	persist(
		(set, get) => ({
			username: '',
			setUsername: (username: string) => {
				set({
					username,
				});
			},
			setIsDetailMode: (isDetailMode: boolean) => {
				const currentNodes = get().nodes;
				const newNodes = currentNodes.map((node) => {
					node.data = {
						...node.data,
						isDetailMode,
					};
					return node;
				});
				set({
					nodes: newNodes,
				});
			},
			chatApp: [],
			setChatApp: (messages: Message[]) => {
				set({
					chatApp: messages,
				});
			},
			chatSessions: [],
			setChatSessions: (chatSessions: RFState['chatSessions']) => {
				set({
					chatSessions: chatSessions,
				});
			},
			currentChatSessionIndex: -1,
			setCurrentChatSessionIndex: (index: number) => {
				set({
					currentChatSessionIndex: index,
				});
			},
			waitingUserResponse: false,
			setWaitingUserResponse: (waiting: boolean) => {
				set({
					waitingUserResponse: waiting,
				});
			},
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			pauseResolver: (value: string) => {},
			setPauseResolver: (resolver: (value: string) => void) => {
				set({
					pauseResolver: resolver,
				});
			},
			documents: [],
			setDocuments: (documents: DocumentDbSchema[]) => {
				set({
					documents,
				});
			},
			reactFlowInstance: null,
			setReactFlowInstance: (instance: ReactFlowInstance | null) => {
				set({
					reactFlowInstance: instance,
				});
			},
			workflows: [],
			setWorkflows: (workflows: SimpleWorkflow[]) => {
				set({
					workflows,
				});
			},
			currentWorkflow: null,
			setCurrentWorkflow: (workflow: SimpleWorkflow | null) => {
				set({
					currentWorkflow: workflow,
				});
			},
			notificationMessage: null,
			clearGraph: () => {
				set({
					nodes: [],
					edges: [],
					selectedNode: null,
					chatApp: [],
				});
			},
			unlockGraph: true,
			setUnlockGraph: (unlock: boolean) => {
				set({
					unlockGraph: unlock,
				});
			},
			openAIApiKey: null,
			// get nodes from local storage or use initial nodes
			nodes: initialNodes,
			edges: initialEdges,
			setNodes: (nodes: CustomNode[]) => {
				set({
					nodes,
				});
			},
			setEdges: (edges: Edge[]) => {
				set({
					edges,
				});
			},
			selectedNode: null,
			setNotificationMessage: (
				message: string | null,
				status: 'success' | 'error' | 'warning' | 'info' = 'error',
			) => {
				if (message === null) {
					set({
						notificationMessage: null,
					});
					return;
				}
				set({
					notificationMessage: {
						message,
						status,
					},
				});
				setTimeout(() => {
					set({
						notificationMessage: null,
					});
				}, 6000);
			},
			onNodeDragStop: (_: React.MouseEvent<Element, MouseEvent>, node: CustomNode) => {
				set({
					selectedNode: node,
				});
			},
			onNodesChange: onNodesChange(get, set),
			onEdgesChange: (changes: EdgeChange[]) => {
				set({
					edges: applyEdgeChanges(changes, get().edges),
				});
			},
			deleteEdges: (sourceHandle: string) => {
				const edges = get().edges;
				const newEdges = edges.filter((edge) => edge.sourceHandle !== sourceHandle);
				set({
					edges: newEdges,
				});
			},
			onConnect: (connection: Connection) => {
				return onConnect(get, set, connection, get().setNotificationMessage);
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
			getNodes: (nodeIds: string[]) => {
				const nodes = get().nodes;
				if (nodeIds.length === 0) {
					return [];
				}

				const inputNodes = nodes.filter((node) => nodeIds.includes(node.id));

				return inputNodes as InputNode[];
			},
			updateNode: (
				nodeId: string,
				data: LLMPromptNodeDataType & TextNodeDataType,
				newPosition?: { mode: 'add' | 'set'; x: number; y: number },
			) => {
				return updateNode(get, set, nodeId, data, newPosition);
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
			runFlow: async (
				getSecret: () => RFStateSecret,
				nodes: CustomNode[],
				edges: Edge[],
				supabase: SupabaseClient<Database>,
				signal: AbortSignal,
			): Promise<void> => {
				await runFlow(get, getSecret, nodes, edges, supabase);
			},
			clearAllNodeResponses: () => {
				const nodes = get().nodes;
				const updatedNodes = nodes.map((node) => {
					node.data.response = '';
					if (node.type === NodeTypesEnum.counter) {
						node.data.response = '-1';
					} else if (node.type === NodeTypesEnum.loop) {
						(node.data as LoopDataType).loopCount = 0;
					}
					return node;
				});

				set({
					nodes: updatedNodes,
				});
			},
		}),
		{
			name: 'Chatbutler.ai',
			storage,
		},
	),
);

export const selector = (state: RFState) => ({
	...state,
});

export default useStore;
