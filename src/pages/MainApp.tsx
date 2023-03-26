import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/20/solid';
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
import { DefaultParams } from 'wouter';
import { shallow } from 'zustand/shallow';
import 'reactflow/dist/base.css';

import LoadingOverlay from '../components/LoadingOverlay';
import Notification from '../components/Notification';
import RunFromStart from '../components/RunFromStart';
import ConnectionLine from '../connection/ConnectionLine';
import populateUserWorkflows from '../db/populateUserWorkflows';
import selectWorkflow from '../db/selectWorkflow';
import syncDataToSupabase from '../db/syncToSupabase';
import CustomEdge from '../edges/CustomEdgeType';
import ChatMessageNode from '../nodes/ChatMessageNode';
import ChatPromptNode from '../nodes/ChatPromptNode';
import ClassifyCategoriesNode from '../nodes/ClassifyCategoriesNode';
import ClassifyNode from '../nodes/ClassifyNode';
import LLMPromptNode from '../nodes/LLMPromptNode';
import PlaceholderNode from '../nodes/PlaceholderNode';
import TextInputNode from '../nodes/TextInputNode';
import { NodeTypesEnum } from '../nodes/types/NodeTypes';
import useStore, { selector } from '../store/useStore';
import isWorkflowOwnedByUser from '../utils/isWorkflowOwnedByUser';
import { useDebouncedEffect } from '../utils/useDebouncedEffect';
import LeftSidePanel from '../windows/LeftSidePanel';
import SettingsPanel from '../windows/SettingsPanel/panel';

const nodeTypes = {
	classify: ClassifyNode,
	classifyCategories: ClassifyCategoriesNode,
	llmPrompt: LLMPromptNode,
	textInput: TextInputNode,
	chatPrompt: ChatPromptNode,
	chatMessage: ChatMessageNode,
	placeholder: PlaceholderNode,
};

const edgeTypes = {
	custom: CustomEdge,
};

export default function MainApp({ params }: { params: DefaultParams | null }) {
	const {
		session,
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
	} = useStore(selector, shallow);

	const [settingsView, setSettingsView] = useState(true);
	const [nodeView, setNodeView] = useState(true);

	const [settingsPanelWidth, setSettingsPanelWidth] = useState(300); // Initial width

	const [isResizing, setIsResizing] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

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
				);
			})();
		},
		[session, nodes, edges],
		3000,
	);

	useEffect(() => {
		(async () => {
			if (!session) {
				setTimeout(() => {
					setIsLoading(false);
				}, 500);
				return;
			}
			setIsLoading(true);
			await populateUserWorkflows(setWorkflows, setUiErrorMessage, session);
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
				);
			}
			setIsLoading(false);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleMouseDown = (e: any) => {
		e.preventDefault();
		setIsResizing(true);
	};

	const handleMouseUp = () => {
		setIsResizing(false);
	};

	useEffect(() => {
		const handleMouseMove = (e: any) => {
			if (!isResizing) return;
			const newWidth = window.innerWidth - e.clientX;
			setSettingsPanelWidth(newWidth);
		};

		if (isResizing) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		} else {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isResizing]);

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

			let nodeTypeEnum = NodeTypesEnum.llmPrompt;
			if (type === 'llmPrompt') {
				nodeTypeEnum = NodeTypesEnum.llmPrompt;
			} else if (type === 'textInput') {
				nodeTypeEnum = NodeTypesEnum.textInput;
			} else if (type === 'chatPrompt') {
				nodeTypeEnum = NodeTypesEnum.chatPrompt;
			} else if (type === 'chatMessage') {
				nodeTypeEnum = NodeTypesEnum.chatMessage;
			} else if (type === 'classify') {
				nodeTypeEnum = NodeTypesEnum.classify;
			}

			onAdd(nodeTypeEnum, position);
		},
		[onAdd, reactFlowInstance],
	);

	const onInit = (reactFlowInstance: ReactFlowInstance) => {
		reactFlowInstance.fitView();
		setReactFlowInstance(reactFlowInstance);
	};

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
				<div className="flex gap-4 items-center">
					<RunFromStart />
				</div>
			</div>
			<div
				style={{
					height: '95vh',
					width: nodeView ? '15vw' : 0,
					maxWidth: '200px',
					minWidth: '180px',
				}}
				className="absolute z-10 flex max-w-sm"
			>
				{nodeView && (
					<LeftSidePanel
						onAdd={onAdd}
						reactFlowWrapper={reactFlowWrapper}
						reactFlowInstance={reactFlowInstance}
					/>
				)}
				<div
					style={{
						height: '30px',
						width: '20px',
					}}
					className="m-0 cursor-pointer shadow-lg bg-slate-200 border-b-1 border-r-1 border-slate-300 flex gap-10 item-center"
				>
					<div
						className="grow"
						onClick={() => {
							setNodeView(!nodeView);
						}}
					>
						{nodeView ? (
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
						) : (
							<ChevronDoubleLeftIcon
								style={{
									height: '30px',
									width: '20px',
								}}
								className={
									'text-slate-800 group-hover:text-slate-500 h-full mx-auto'
								}
								aria-hidden="true"
							/>
						)}
					</div>
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
							type: 'default',
							animated: true,
							style: {
								strokeWidth: 2,
								stroke: '#002',
							},
							markerEnd: {
								type: MarkerType.ArrowClosed,
								width: 25,
								height: 25,
								color: '#002',
							},
						}}
					>
						<Controls className="ml-52" />
						<MiniMap pannable={true} />
						<Background
							variant={BackgroundVariant.Dots}
							gap={14}
							size={2}
							color={'#8E8E8E'}
						/>
						<Panel position="top-center">
							<Notification />
						</Panel>
						<Panel
							position="top-right"
							className="m-0 cursor-pointer shadow-lg bg-slate-200 border-b-1 border-l-1 border-slate-300"
							onClick={() => {
								setSettingsView(!settingsView);
							}}
						>
							{settingsView ? (
								<ChevronDoubleLeftIcon
									style={{
										height: '30px',
										width: '20px',
									}}
									className={
										'text-slate-800 group-hover:text-slate-500 h-full mx-auto'
									}
									aria-hidden="true"
								/>
							) : (
								<ChevronDoubleRightIcon
									style={{
										height: '30px',
										width: '20px',
									}}
									className={' group-hover:text-slate-500 h-full mx-auto'}
									aria-hidden="true"
								/>
							)}
						</Panel>
					</ReactFlow>
				</div>

				{settingsView ? (
					<div
						className=""
						style={{
							width: `${settingsPanelWidth}px`,
							position: 'relative',
						}}
					>
						<div
							// animate on hover to show that it's resizable
							className="absolute -left-2 top-0 bottom-0 bg-blue-200 cursor-col-resize opacity-0 hover:opacity-80 transition-opacity duration-300"
							style={{
								width: '10px',
							}}
							onMouseDown={handleMouseDown}
						/>
						<SettingsPanel />
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
			</div>
		</div>
	);
}
