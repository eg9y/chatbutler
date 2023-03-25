import {
	Cog6ToothIcon,
	Bars3CenterLeftIcon,
	ChatBubbleLeftEllipsisIcon,
	DocumentTextIcon,
	ChatBubbleLeftRightIcon,
	ShareIcon,
	UserCircleIcon,
	PhotoIcon,
	BeakerIcon,
} from '@heroicons/react/20/solid';
import { nanoid } from 'nanoid';
import { FC, useEffect, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { useLocation } from 'wouter';
import { shallow } from 'zustand/shallow';

const rightAngleSvg = new URL('../assets/right-angle.svg', import.meta.url).href;
import UserWorkflows from './UserWorkflows';
import supabase from '../auth/supabaseClient';
import EditableText from '../components/EditableText';
import { NodeTypesEnum } from '../nodes/types/NodeTypes';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

export default function LeftSidePanel({
	onAdd,
	reactFlowWrapper,
	reactFlowInstance,
}: {
	onAdd: (
		type: NodeTypesEnum,
		position: {
			x: number;
			y: number;
		},
	) => void;
	reactFlowWrapper: React.MutableRefObject<HTMLDivElement | null>;
	reactFlowInstance: ReactFlowInstance<any, any> | null;
}) {
	const {
		setOpenAiKey,
		setUiErrorMessage,
		clearGraph,
		setWorkflowId,
		setWorkflows,
		workflowName,
		setWorkflowName,
	} = useStore(selector, shallow);
	const [dragging, setDragging] = useState(false);
	const [openWorkflows, setOpenWorkflows] = useState(true);

	const [, setLocation] = useLocation();

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		(async () => {
			const session = await supabase.auth.getSession();
			if (session.data.session) {
				setIsLoggedIn(true);
			}
		})();
	}, []);

	const goToLogin = () => {
		setLocation('/auth');
	};

	const goToGallery = () => {
		setLocation('/gallery');
	};

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(true);
	};

	const addNodeToCenter = (type: NodeTypesEnum) => {
		if (!(reactFlowWrapper && reactFlowWrapper.current && reactFlowInstance)) {
			return;
		}
		const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

		const position = reactFlowInstance.project({
			x: reactFlowBounds.left + reactFlowBounds.right / 2,
			y: reactFlowBounds.top + reactFlowBounds.bottom / 2,
		});

		onAdd(type, position);
	};

	useEffect(() => {
		if (!openWorkflows && reactFlowInstance && 'fitView' in reactFlowInstance) {
			reactFlowInstance.fitView();
			reactFlowInstance.zoomOut();
		}
	}, [openWorkflows, reactFlowInstance]);

	return (
		<aside
			style={{
				height: '100vh',
			}}
			className="bg-slate-50 w-full shadow-lg border-r-1 border-slate-400"
		>
			<div className="flex flex-col justify-between h-full py-1 border-1">
				<div className="space-y-1 flex flex-col gap-4">
					<div className="flex flex-col justify-between px-2">
						<div className="flex flex-col border-b-1 pb-2 border-slate-300">
							<h1 className="font-bold text-lg">PromptSandbox.io</h1>
							<ul className="list-disc list-inside">
								<a
									className="list-item text-xs text-slate-600 underline hover:font-semibold cursor-pointer"
									href="https://github.com/eg9y/promptsandbox.io"
									target="_blank"
									rel="noreferrer"
								>
									more info
								</a>
								<a
									className="list-item text-xs text-slate-600 underline hover:font-semibold cursor-pointer"
									href="https://github.com/eg9y/promptsandbox.io"
									target="_blank"
									rel="noreferrer"
								>
									tutorial
								</a>
							</ul>
						</div>
						{isLoggedIn ? (
							<EditableText
								text={workflowName}
								setText={setWorkflowName}
								setWorkflows={setWorkflows}
							/>
						) : (
							<div className="pb-1  py-1">
								<p className="text-xs text-slate-700">
									Welcome to promptsandbox.io, a free visual programming tool that
									makes it easy to work with OpenAI APIs like GPT-4, allowing you
									to create and link nodes to generate complex outputs with ease.
								</p>
							</div>
						)}
					</div>

					<div>
						<div className="bg-slate-200 flex justify-between">
							<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4 py-1">
								Settings
							</p>
						</div>
						<div className="mt-1 px-2 space-y-1" aria-labelledby="projects-headline">
							<a
								className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 
								bg-slate-300 hover:text-slate-900 hover:font-bold cursor-pointer "
								onClick={async () => {
									const currentKey = localStorage.getItem('openAIKey') || '';
									const newOpenAIKey = window.prompt(
										"Enter your OpenAI Key here (It'll be saved in your browser)",
										currentKey,
									);

									if (newOpenAIKey === null) {
										return;
									}

									if (newOpenAIKey === '') {
										console.log('No key entered');
									}
									setOpenAiKey(newOpenAIKey);
								}}
							>
								<Cog6ToothIcon
									className={
										'text-slate-500  group-hover:text-slate-900 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
									}
									aria-hidden="true"
								/>
								<span className="truncate">OpenAI Key</span>
							</a>
						</div>
						<div className="mt-1 px-2 space-y-1" aria-labelledby="projects-headline">
							<a
								className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 
								bg-slate-300 hover:text-slate-900 hover:font-bold cursor-pointer "
								onClick={() => {
									if (isLoggedIn) {
										supabase.auth.signOut();
										setIsLoggedIn(false);
										setWorkflows([]);
										// clear graph;
										clearGraph();
										// set new workflowId;
										setWorkflowId(nanoid());
									} else {
										goToLogin();
									}
								}}
							>
								{isLoggedIn ? (
									<>
										<UserCircleIcon
											className={
												'text-slate-500  group-hover:text-slate-900 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
											}
											aria-hidden="true"
										/>
										<span className="truncate">Logout</span>
									</>
								) : (
									<>
										<UserCircleIcon
											className={
												'text-slate-500  group-hover:text-slate-900 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
											}
											aria-hidden="true"
										/>
										<span className="truncate">Login</span>
									</>
								)}
							</a>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<div className="bg-slate-200 flex justify-between ">
							<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4 py-1">
								Workflows
							</p>
						</div>
						<div className="flex flex-col justify-between gap-4  px-2 py-2 ">
							<div className="flex flex-col gap-2">
								<a
									className="group p-2 flex items-center rounded-md text-sm font-medium text-slate-700 
									bg-slate-300 hover:text-slate-900 hover:font-bold cursor-pointer "
									onClick={async () => {
										if (isLoggedIn) {
											setOpenWorkflows(true);
										} else if (!isLoggedIn) {
											setUiErrorMessage('Please login to save workflows');
										}
									}}
								>
									<BeakerIcon
										className={
											'text-slate-500 group-hover:text-slate-600 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
										}
										aria-hidden="true"
									/>
									<span className="truncate">Your Workflows</span>
								</a>
								<a
									className="group p-2 flex items-center rounded-md text-sm font-medium text-slate-700 
									bg-slate-300 hover:text-slate-900 hover:font-bold cursor-pointer "
									onClick={async () => {
										goToGallery();
									}}
								>
									<PhotoIcon
										className={
											'text-slate-500 group-hover:text-slate-600 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
										}
										aria-hidden="true"
									/>
									<span>Gallery</span>
								</a>
							</div>
						</div>
					</div>
					<UserWorkflows
						setWorkflowId={setWorkflowId}
						setWorkflows={setWorkflows}
						open={openWorkflows}
						setOpen={setOpenWorkflows}
					/>
					<div>
						<div className="bg-slate-200 flex justify-between">
							<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4 py-1">
								Add Nodes
							</p>
						</div>
						<div className="flex flex-col gap-1 px-2 py-2">
							{/* TODO: Refactor node blocks */}
							<NodeType
								name="Chat API"
								nodeType={NodeTypesEnum.chatPrompt}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ChatBubbleLeftRightIcon}
							/>
							<div className="px-1 mr-1 flex">
								<img src={rightAngleSvg} alt="SVG as an image" />
								<div>
									<NodeType
										name="Chat Message"
										nodeType={NodeTypesEnum.chatMessage}
										handleDrag={handleDrag}
										addNodeToCenter={addNodeToCenter}
										Icon={ChatBubbleLeftEllipsisIcon}
									/>
								</div>
							</div>

							<NodeType
								name="Text"
								nodeType={NodeTypesEnum.textInput}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={Bars3CenterLeftIcon}
							/>
							<NodeType
								name="Complete API"
								nodeType={NodeTypesEnum.llmPrompt}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={DocumentTextIcon}
							/>
							<NodeType
								name="Classify"
								nodeType={NodeTypesEnum.classify}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ShareIcon}
							/>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
const NodeType: FC<{
	name: string;
	nodeType: NodeTypesEnum;
	handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
	addNodeToCenter: (type: NodeTypesEnum) => void;
	Icon: React.ForwardRefExoticComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
			titleId?: string | undefined;
		}
	>;
}> = ({ name, handleDrag, addNodeToCenter, nodeType, Icon }) => {
	const colorClassName = conditionalClassNames(
		nodeType === NodeTypesEnum.chatMessage && `ring-indigo-300`,
		nodeType === NodeTypesEnum.chatPrompt && `ring-indigo-300`,
		nodeType === NodeTypesEnum.llmPrompt && `ring-amber-400`,
		nodeType === NodeTypesEnum.classify && `ring-rose-300`,
		nodeType === NodeTypesEnum.textInput && `ring-emerald-400`,
		`text-slate-600 hover:bg-slate-100 hover:text-slate-900 group flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer ring-2 ring-inset`,
	);
	return (
		<div
			draggable="true"
			onDrag={handleDrag}
			onDragStart={(e) => {
				e.dataTransfer.setData('application/reactflow', nodeType);
			}}
		>
			<a className={colorClassName} onClick={() => addNodeToCenter(nodeType)}>
				<Icon
					className={
						'text-slate-400 group-hover:text-slate-500 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
					}
					aria-hidden="true"
				/>
				<span className="truncate">{name}</span>
			</a>
		</div>
	);
};
