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
	Edge,
} from 'reactflow';
import { shallow } from 'zustand/shallow';

import supabase from '../auth/supabaseClient';
import Notification from '../components/Notification';
import RunFromStart from '../components/RunFromStart';
import ConnectionLine from '../connection/ConnectionLine';
import syncDataToSupabase from '../db/syncToSupabase';
import CustomEdge from '../edges/CustomEdgeType';
import ChatMessageNode from '../nodes/ChatMessageNode';
import ChatPromptNode from '../nodes/ChatPromptNode';
import ClassifyCategoriesNode from '../nodes/ClassifyCategoriesNode';
import ClassifyNode from '../nodes/ClassifyNode';
import LLMPromptNode from '../nodes/LLMPromptNode';
import PlaceholderNode from '../nodes/PlaceholderNode';
import TextInputNode from '../nodes/TextInputNode';
import { Inputs } from '../nodes/types/Input';
import { CustomNode, NodeTypesEnum } from '../nodes/types/NodeTypes';
import useStore, { selector } from '../store/useStore';
import { useDebouncedEffect } from '../utils/useDebouncedEffect';
import LeftSidePanel from '../windows/LeftSidePanel';
import SettingsPanel from '../windows/SettingsPanel/panel';
import 'reactflow/dist/base.css';

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

export default function MainApp() {
	const {
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
		workflowId,
		setWorkflowId,
		workflowName,
		setWorkflowName,
		setNodes,
		setEdges,
		workflows,
		setWorkflows,
		setUiErrorMessage,
	} = useStore(selector, shallow);

	const [settingsView, setSettingsView] = useState(true);
	const [nodeView, setNodeView] = useState(true);

	const [settingsPanelWidth, setSettingsPanelWidth] = useState(300); // Initial width

	const [isResizing, setIsResizing] = useState(false);

	useEffect(() => {
		(async () => {
			const { data, error } = await supabase.from('workflows').select();
			if (data) {
				setWorkflows(data);
			} else if (error) {
				setUiErrorMessage(error.message);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useDebouncedEffect(
		() => {
			(async () => {
				const isLoggedIn = await supabase.auth.getSession();
				if (!isLoggedIn.data.session) {
					return;
				}
				await syncDataToSupabase(
					nodes,
					edges,
					setWorkflowName,
					workflowName,
					setWorkflows,
					workflowId,
					setWorkflowId,
				);
			})();
		},
		[nodes, edges, workflowId, workflowName, workflows],
		3000,
	);

	useEffect(() => {
		(async () => {
			const isLoggedIn = await supabase.auth.getSession();
			if (!isLoggedIn.data.session) {
				return;
			}
			const user = await supabase.auth.getUser();
			if (user) {
				if (user.error) {
					console.error('Error fetching user from Supabase:', user.error);
					return;
				}
				const { data: workflowEntry, error: workflowError } = await supabase
					.from('workflows')
					.select('id')
					.order('created_at', { ascending: false });

				if (workflowError) {
					console.error('Error fetching workflows from Supabase:', workflowError);
					return;
				}

				// user just signs up and has a workflow in the db, fetch the latest one
				if (workflowEntry.length) {
					const { data: latestWorkflow, error: latestWorkflowError } = await supabase
						.from('workflows')
						.select('name, nodes, edges, id')
						.eq('id', workflowEntry[0].id)
						.order('created_at', { ascending: false })
						.single();
					if (latestWorkflowError) {
						console.error(
							'Error fetching latest workflow from Supabase:',
							latestWorkflowError,
						);
						return;
					}
					if (latestWorkflow) {
						const name = latestWorkflow.name;
						let nodes: any = latestWorkflow.nodes;
						const edges: Edge<any>[] = latestWorkflow.edges as any;

						if (nodes && edges) {
							nodes = nodes.map((node: CustomNode) => {
								if ('inputs' in node.data) {
									return {
										...node,
										data: {
											...node.data,
											inputs: new Inputs(
												node.data.inputs.inputs,
												node.data.inputs.inputExamples,
											),
										},
									};
								}
								return {
									...node,
								};
							});
							setNodes(nodes);
							setEdges(edges);
							setWorkflowId(latestWorkflow.id);
							setWorkflowName(name);
						}
					}
				}
			}
		})();
	}, [setEdges, setNodes, setWorkflowId, setWorkflowName]);

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
				height: '100vh',
				width: '100vw',
			}}
			className="flex"
		>
			<div
				style={{
					height: '100vh',
					width: nodeView ? '15vw' : 0,
					maxWidth: '200px',
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
					height: '100vh',
					width: '100vw',
				}}
			>
				<div style={{}} ref={reactFlowWrapper}>
					<ReactFlow
						multiSelectionKeyCode="Shift"
						onDrop={handleDrop}
						nodesDraggable={unlockGraph}
						nodesConnectable={unlockGraph}
						nodesFocusable={unlockGraph}
						edgesFocusable={unlockGraph}
						elementsSelectable={unlockGraph}
						onInit={(reactFlowInstance: ReactFlowInstance) => onInit(reactFlowInstance)}
						onDragOver={(e) => e.preventDefault()}
						nodes={nodes}
						edges={edges}
						defaultViewport={{
							x: 0,
							y: 0,
							zoom: 0.3,
						}}
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
						<Panel position="top-center" aria-label="graph-runner">
							<div className="flex gap-4">
								<RunFromStart />
							</div>
						</Panel>
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
							height: '100vh',
						}}
						onMouseDown={handleMouseDown}
					/>
				)}
			</div>
		</div>
	);
}
