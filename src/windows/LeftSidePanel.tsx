import { FC, useEffect, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
import {
	Cog6ToothIcon,
	Bars3CenterLeftIcon,
	ChatBubbleLeftEllipsisIcon,
	DocumentTextIcon,
	ChatBubbleLeftRightIcon,
	ShareIcon,
	UserCircleIcon,
	PlusIcon,
} from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import { useLocation } from 'wouter';

import useStore, { selector } from '../store/useStore';
import { NodeTypesEnum } from '../nodes/types/NodeTypes';
import { conditionalClassNames } from '../utils/classNames';
import supabase from '../auth/supabaseClient';
import { Database } from '../schema';

type WorkflowSchema = Database['public']['Tables']['workflows']['Row'];

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
	const { setOpenAiKey, setUiErrorMessage } = useStore(selector, shallow);
	const [workflows, setWorkflows] = useState<WorkflowSchema[]>([]);

	const [dragging, setDragging] = useState(false);

	const [, setLocation] = useLocation();

	const goToLogin = () => {
		setLocation('/auth');
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

	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		checkLoggedIn();
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN') {
				setLoggedIn(true);
			} else if (event === 'INITIAL_SESSION') {
				setLoggedIn(!!session);
			} else {
				setLoggedIn(false);
			}
		});

		// Clean up the listener when the component is unmounted
		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	const checkLoggedIn = async () => {
		const user = supabase.auth.getUser();
		setLoggedIn(!!user);
	};

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

	return (
		<aside
			style={{
				height: '100vh',
			}}
			className="bg-slate-50 w-full shadow-lg"
		>
			<div className="flex flex-col justify-between h-full py-1 border-1">
				<div className="space-y-1 flex flex-col gap-4">
					<div className="pb-4 px-2">
						<h1 className="font-bold text-lg">PromptSandbox.io</h1>
						<p className="text-xs text-slate-700">
							Free visual programming tool that makes it easy to work with OpenAI APIs
							like GPT-4, allowing you to create and link nodes to generate complex
							outputs with ease.
						</p>
						<a
							className="text-xs text-blue-600 cursor-pointer"
							href="https://github.com/eg9y/promptsandbox.io"
							target="_blank"
							rel="noreferrer"
						>
							more info
						</a>
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
									if (loggedIn) {
										supabase.auth.signOut();
										setWorkflows([]);
									} else {
										goToLogin();
									}
								}}
							>
								{loggedIn ? (
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
								{workflows.map((workflow) => {
									return (
										<div key={workflow.id}>
											<a
												className={`text-slate-600 hover:bg-slate-100 hover:text-slate-900 group flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer ring-2 ring-inset`}
												onClick={() => {
													console.log('placeholder');
												}}
											>
												<span className="truncate">{workflow.name}</span>
											</a>
										</div>
									);
								})}
								{workflows.length === 0 && <p>No workflows yet</p>}
							</div>
							<a
								className="group p-2 flex items-center rounded-md text-sm font-medium text-slate-700 
									bg-slate-300 hover:text-slate-900 hover:font-bold cursor-pointer "
								onClick={async () => {
									const { data, error } = await supabase
										.from('workflows')
										.insert({
											name: 'New Workflow',
											nodes: [],
											edges: [],
										})
										.returns<WorkflowSchema>();
									if (data) {
										setWorkflows((prev) => [...prev, data]);
									} else if (error) {
										setUiErrorMessage(error.message);
									}
								}}
							>
								<PlusIcon
									className={
										'text-slate-500  group-hover:text-slate-900 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
									}
									aria-hidden="true"
								/>
								<span className="truncate">Add workflow</span>
							</a>
						</div>
					</div>
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
							<div className="pl-4">
								<NodeType
									name="Chat Message"
									nodeType={NodeTypesEnum.chatMessage}
									handleDrag={handleDrag}
									addNodeToCenter={addNodeToCenter}
									Icon={ChatBubbleLeftEllipsisIcon}
								/>
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
