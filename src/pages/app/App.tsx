import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
	MiniMap,
	Background,
	BackgroundVariant,
	Panel,
	ReactFlowInstance,
} from 'reactflow';
import { shallow } from 'zustand/shallow';

import 'reactflow/dist/base.css';

import SandboxExecutionPanel from './SandboxExecutionPanel';
import UsernamePrompt from './UsernamePrompt';
import useSupabase from '../../auth/supabaseClient';
import LoadingOverlay from '../../components/LoadingOverlay';
import Notification from '../../components/Notification';
import ConnectionLine from '../../connection/ConnectionLine';
import populateUserDocuments from '../../db/populateUserDocuments';
import populateUserWorkflows from '../../db/populateUserWorkflows';
import selectWorkflow from '../../db/selectWorkflow';
import syncDataToSupabase from '../../db/syncToSupabase';
import { CustomEdgeType } from '../../edges/CustomEdgeType';
import ChatMessageNode from '../../nodes/ChatMessageNode';
import ChatPromptNode from '../../nodes/ChatPromptNode';
import ClassifyCategoriesNode from '../../nodes/ClassifyCategoriesNode';
import ClassifyNode from '../../nodes/ClassifyNode';
import CombineNode from '../../nodes/CombineNode';
import ConditionalNode from '../../nodes/ConditionalNode';
import CounterNode from '../../nodes/CounterNode';
import DocsLoaderNode from '../../nodes/DocsLoaderNode';
import FileNode from '../../nodes/FileTextNode';
import GlobalVariableNode from '../../nodes/GlobalVariableNode';
import InputTextNode from '../../nodes/InputTextNode';
import LLMPromptNode from '../../nodes/LLMPromptNode';
import LoopNode from '../../nodes/LoopNode';
import OutputTextNode from '../../nodes/OutputTextNode';
import PlaceholderNode from '../../nodes/PlaceholderNode';
import SearchNode from '../../nodes/SearchNode';
import SetVariableNode from '../../nodes/SetVariableNode';
import SingleChatPromptNode from '../../nodes/SingleChatPromptNode';
import TextNode from '../../nodes/TextNode';
import { NodeTypesEnum } from '../../nodes/types/NodeTypes';
import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import isWorkflowOwnedByUser from '../../utils/isWorkflowOwnedByUser';
import { useDebouncedEffect } from '../../utils/useDebouncedEffect';
import { useQueryParams } from '../../utils/useQueryParams';
import useResize from '../../utils/useResize';
import ChatPanel from '../../windows/ChatPanel/ChatPanel';
import SettingsPanel from '../../windows/SettingsPanel/SettingsPanel';

const nodeTypes = {
	classify: ClassifyNode,
	classifyCategories: ClassifyCategoriesNode,
	llmPrompt: LLMPromptNode,
	text: TextNode,
	inputText: InputTextNode,
	outputText: OutputTextNode,
	singleChatPrompt: SingleChatPromptNode,
	chatPrompt: ChatPromptNode,
	chatMessage: ChatMessageNode,
	loop: LoopNode,
	fileText: FileNode,
	search: SearchNode,
	docsLoader: DocsLoaderNode,
	combine: CombineNode,
	conditional: ConditionalNode,
	placeholder: PlaceholderNode,
	counter: CounterNode,
	globalVariable: GlobalVariableNode,
	setVariable: SetVariableNode,
};

const edgeTypes = {
	smart: CustomEdgeType,
};

export default function App() {
	const params = useQueryParams();

	const {
		setDocuments,
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		onAdd,
		onNodeDragStop,
		onEdgesDelete,
		unlockGraph,
		reactFlowInstance,
		setReactFlowInstance,
		currentWorkflow,
		setCurrentWorkflow,
		setUiErrorMessage,
		setNodes,
		setEdges,
		workflows,
		setWorkflows,
		setChatApp,
		setGlobalVariables,
		setUsername,
	} = useStore(selector, shallow);
	const { session, setSession, setOpenAiKey } = useStoreSecret(selectorSecret, shallow);

	const [settingsView, setSettingsView] = useState(true);
	const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	const supabase = useSupabase();

	useDebouncedEffect(
		() => {
			(async () => {
				if (!session) {
					return;
				}
				await syncDataToSupabase(
					nodes,
					edges,
					currentWorkflow,
					workflows,
					setWorkflows,
					session,
					params,
					supabase,
				);
			})();
		},
		[session, nodes, edges, workflows],
		3000,
	);

	// set profile
	useEffect(() => {
		// get user profile from profile tablee where user id = current user id
		// if first_name is null and profile exists, ask user for firstname
		const getProfile = async (session: Session) => {
			const { data: profile, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', session?.user?.id)
				.single();
			if (error) {
				setUiErrorMessage(error.message);
			}
			if (profile) {
				if (!profile.first_name) {
					setShowUsernamePrompt(true);
				} else {
					setUsername(profile.first_name);
				}
			}
		};

		if (session) {
			getProfile(session);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	// init sandbox phase
	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const sessionResponse = await supabase.auth.getSession();
			const currentSession = sessionResponse.data.session;
			setSession(currentSession);

			// // TODO: don't need to null workflow.
			// setCurrentWorkflow(null);

			await populateUserWorkflows(setWorkflows, setUiErrorMessage, currentSession, supabase);
			// await populateUserDocuments(setDocuments, setUiErrorMessage, currentSession, supabase);
			if (currentSession?.user) {
				const { data, error } = await supabase.functions.invoke('get-api-key');
				if (error) {
					setUiErrorMessage(error.message);
				}
				if (data) {
					setOpenAiKey(data);
				}
			}
			if (params && params.id) {
				await selectWorkflow(
					params.id,
					nodes,
					edges,
					currentWorkflow,
					setUiErrorMessage,
					setCurrentWorkflow,
					setGlobalVariables,
					setNodes,
					setEdges,
					supabase,
				);
			} else if (currentSession?.user && currentWorkflow) {
				await selectWorkflow(
					currentWorkflow.id,
					nodes,
					edges,
					currentWorkflow,
					setUiErrorMessage,
					setCurrentWorkflow,
					setGlobalVariables,
					setNodes,
					setEdges,
					supabase,
				);
			}
			setIsLoading(false);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params]);

	const { length: SettingsPanelWidth, handleMouseDown } = useResize(300);

	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			if (
				!(
					reactFlowWrapper &&
					reactFlowWrapper.current &&
					reactFlowInstance &&
					'project' in reactFlowInstance
				)
			) {
				return;
			}

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData('application/reactflow');

			// check if the dropped element is valid
			if (typeof type === 'undefined' || !type) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			const nodeTypeEnum = type as NodeTypesEnum;
			onAdd(nodeTypeEnum, position);
		},
		[onAdd, reactFlowInstance],
	);

	const onInit = useCallback(
		(reactFlowInstance: ReactFlowInstance) => {
			reactFlowInstance.fitView();
			setReactFlowInstance(reactFlowInstance);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[reactFlowInstance],
	);

	return (
		<div
			style={{
				height: '95vh',
				width: '100vw',
			}}
			className="flex"
		>
			<UsernamePrompt
				open={showUsernamePrompt}
				setShowUsernamePrompt={setShowUsernamePrompt}
				supabase={supabase}
				session={session}
				setUsername={setUsername}
			/>
			<LoadingOverlay open={isLoading} />
			<div className="absolute flex w-full justify-center p-4">
				<SandboxExecutionPanel nodes={nodes} setNodes={setNodes} setChatApp={setChatApp} />
			</div>

			<div
				className="grid grid-cols-2"
				style={{
					gridTemplateColumns: '1fr auto',
					height: '95vh',
					width: '100vw',
				}}
			>
				<div ref={reactFlowWrapper}>
					<ReactFlow
						multiSelectionKeyCode="Shift"
						onDrop={handleDrop}
						nodesDraggable={unlockGraph && isWorkflowOwnedByUser(session, params)}
						nodesConnectable={unlockGraph && isWorkflowOwnedByUser(session, params)}
						nodesFocusable={unlockGraph && isWorkflowOwnedByUser(session, params)}
						edgesFocusable={unlockGraph && isWorkflowOwnedByUser(session, params)}
						elementsSelectable={unlockGraph && isWorkflowOwnedByUser(session, params)}
						onInit={(reactFlowInstance: ReactFlowInstance) => onInit(reactFlowInstance)}
						onDragOver={(e) => e.preventDefault()}
						nodes={nodes}
						edges={edges}
						minZoom={0.3}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						nodeTypes={nodeTypes}
						snapGrid={[100, 100]}
						snapToGrid={true}
						// edgeTypes={edgeTypes}
						connectionLineComponent={ConnectionLine}
						onNodeDragStart={onNodeDragStop}
						onNodeClick={onNodeDragStop}
						onEdgesDelete={onEdgesDelete}
						defaultEdgeOptions={{
							type: 'default',
							style: {
								strokeWidth: 10,
								stroke: '#002',
							},
							// markerEnd: {
							// 	type: MarkerType.ArrowClosed,
							// },
						}}
					>
						{settingsView ? (
							<div
								className="z-10 bg-slate-50"
								style={{
									height: '95vh',
									width: `${SettingsPanelWidth}px`,
									position: 'relative',
								}}
							>
								<SettingsPanel
									reactFlowWrapper={reactFlowWrapper}
									reactFlowInstance={reactFlowInstance}
									supabase={supabase}
								/>
								<div
									// animate on hover to show that it's resizable
									className="absolute -right-2 top-0 bottom-0 cursor-col-resize bg-blue-200 opacity-0 transition-opacity duration-300 hover:opacity-80"
									style={{
										width: '10px',
									}}
									onMouseDown={handleMouseDown}
								/>
							</div>
						) : (
							<div
								// animate on hover to show that it's resizable
								className="relative z-40 border-1 border-slate-300 bg-slate-200 shadow-xl"
								style={{
									width: '10px',
									height: '95vh',
								}}
								onMouseDown={handleMouseDown}
							/>
						)}
						<div
							style={{
								top: 0,
								margin: 0,
								left: settingsView ? `${SettingsPanelWidth}px` : 10,
							}}
							className="absolute z-20 cursor-pointer border-b-1 border-r-1 border-slate-300 bg-slate-200 shadow-lg"
							onClick={() => {
								setSettingsView(!settingsView);
							}}
						>
							<ChevronDoubleRightIcon
								style={{
									height: '30px',
									width: '20px',
									transform: `rotate(${settingsView ? 180 : 0}deg)`,
								}}
								className={
									'mx-auto h-full text-slate-800 group-hover:text-slate-500'
								}
								aria-hidden="true"
							/>
						</div>
						<MiniMap
							position="top-right"
							pannable={true}
							className="rounded-lg shadow-lg ring-1 ring-slate-200"
							nodeColor={(node) => {
								if (node.type === NodeTypesEnum.classify) {
									return 'rgb(254 205 211)';
								} else if (node.type === NodeTypesEnum.classifyCategories) {
									return 'rgb(254 205 211)';
								} else if (node.type === NodeTypesEnum.llmPrompt) {
									return 'rgb(253 230 138)';
								} else if (node.type === NodeTypesEnum.text) {
									return 'rgb(167 243 208)';
								} else if (node.type === NodeTypesEnum.inputText) {
									return 'rgb(167 243 208)';
								} else if (node.type === NodeTypesEnum.outputText) {
									return 'rgb(167 243 208)';
								} else if (node.type === NodeTypesEnum.loop) {
									return 'rgb(167 243 208)';
								} else if (node.type === NodeTypesEnum.conditional) {
									return 'rgb(167 243 208)';
								} else if (node.type === NodeTypesEnum.counter) {
									return 'rgb(167 243 208)';
								} else if (node.type === NodeTypesEnum.chatPrompt) {
									return 'rgb(233 213 255)';
								} else if (node.type === NodeTypesEnum.singleChatPrompt) {
									return 'rgb(233 213 255)';
								} else if (node.type === NodeTypesEnum.chatMessage) {
									return 'rgb(233 213 255)';
								} else if (node.type === NodeTypesEnum.fileText) {
									return 'rgb(186 230 253)';
								} else if (node.type === NodeTypesEnum.search) {
									return 'rgb(186 230 253)';
								} else if (node.type === NodeTypesEnum.combine) {
									return 'rgb(186 230 253)';
								} else if (node.type === NodeTypesEnum.globalVariable) {
									return 'rgb(226 232 240)';
								} else if (node.type === NodeTypesEnum.setVariable) {
									return 'rgb(226 232 240)';
								}
								return 'rgb(230,230,230)';
							}}
						/>
						<Background
							variant={BackgroundVariant.Dots}
							gap={14}
							size={2}
							color={'#8E8E8E'}
						/>
						<Panel position="top-right" className="z-12">
							<Notification />
						</Panel>
					</ReactFlow>
				</div>
			</div>
			<ChatPanel />
		</div>
	);
}
