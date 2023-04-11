import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
	MiniMap,
	Background,
	BackgroundVariant,
	Panel,
	MarkerType,
	ReactFlowInstance,
	Controls,
} from 'reactflow';
import { shallow } from 'zustand/shallow';

import 'reactflow/dist/base.css';

import useSupabase from '../../auth/supabaseClient';
import LoadingOverlay from '../../components/LoadingOverlay';
import Notification from '../../components/Notification';
import RunFromStart from '../../components/RunFromStart';
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
import FileNode from '../../nodes/FileTextNode';
import GlobalVariableNode from '../../nodes/GlobalVariableNode';
import InputTextNode from '../../nodes/InputTextNode';
import LLMPromptNode from '../../nodes/LLMPromptNode';
import LoopNode from '../../nodes/LoopNode';
import OutputTextNode from '../../nodes/OutputTextNode';
import PlaceholderNode from '../../nodes/PlaceholderNode';
import SearchNode from '../../nodes/SearchNode';
import SetVariableNode from '../../nodes/SetVariableNode';
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
	chatPrompt: ChatPromptNode,
	chatMessage: ChatMessageNode,
	loop: LoopNode,
	fileText: FileNode,
	search: SearchNode,
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
	} = useStore(selector, shallow);
	const { session, setSession, setOpenAiKey } = useStoreSecret(selectorSecret, shallow);

	const [settingsView, setSettingsView] = useState(true);

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

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const sessionResponse = await supabase.auth.getSession();
			const currentSession = sessionResponse.data.session;
			setSession(currentSession);
			setCurrentWorkflow(null);
			await populateUserWorkflows(setWorkflows, setUiErrorMessage, currentSession, supabase);
			await populateUserDocuments(setDocuments, setUiErrorMessage, currentSession, supabase);
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
			<LoadingOverlay open={isLoading} />
			<div className="absolute p-4 flex w-full justify-center">
				<div className="flex gap-4 items-center z-10">
					<RunFromStart />
					<button
						className="bg-red-500 hover:bg-red-600 text-white text-md font-semibold py-1 h-full px-2  rounded flex items-center"
						onClick={() => {
							// Are you sure prompt
							if (window.confirm('Are you sure you want to clear the responses?')) {
								const clearedNodes = nodes.map((node) => {
									return {
										...node,
										data: {
											...node.data,
											response: '',
											isLoading: false,
										},
									};
								});
								setNodes(clearedNodes);
								setChatApp([]);
								setIsLoading(false);
							}
						}}
					>
						<span>Clear Run</span>
					</button>
				</div>
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
						edgeTypes={edgeTypes}
						connectionLineComponent={ConnectionLine}
						onNodeDragStart={onNodeDragStop}
						onNodeClick={onNodeDragStop}
						onEdgesDelete={onEdgesDelete}
						defaultEdgeOptions={{
							type: 'smart',
							// animated: true,
							style: {
								strokeWidth: 10,
								stroke: '#002',
							},
							markerEnd: {
								type: MarkerType.ArrowClosed,
								width: 10,
								height: 10,
								color: '#002',
							},
						}}
					>
						{settingsView ? (
							<div
								className="z-10"
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
									className="absolute -right-2 top-0 bottom-0 bg-blue-200 cursor-col-resize opacity-0 hover:opacity-80 transition-opacity duration-300"
									style={{
										width: '10px',
									}}
									onMouseDown={handleMouseDown}
								/>
							</div>
						) : (
							<div
								// animate on hover to show that it's resizable
								className="bg-slate-200 shadow-xl border-1 border-slate-300"
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
							className="cursor-pointer shadow-lg bg-slate-200 border-b-1 border-r-1 border-slate-300 absolute z-20"
							onClick={() => {
								setSettingsView(!settingsView);
							}}
						>
							<ChevronDoubleRightIcon
								style={{
									height: '30px',
									width: '20px',
								}}
								className={
									'text-slate-800 group-hover:text-slate-500 h-full mx-auto'
								}
								aria-hidden="true"
							/>
						</div>
						<MiniMap position="top-right" pannable={true} />
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
