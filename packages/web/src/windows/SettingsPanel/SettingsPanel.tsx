import { Database } from '@chatbutler/shared';
import { Switch } from '@headlessui/react';
import { Cog6ToothIcon, BeakerIcon, AcademicCapIcon, TrashIcon } from '@heroicons/react/20/solid';
import { SupabaseClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { ReactFlowInstance, Node } from 'reactflow';
import { shallow } from 'zustand/shallow';

import ChatMessageTabs from './nodeSettings/chatMessage/tabs';
import ChatPromptTabs from './nodeSettings/chatPromptNode/tabs';
import ClassifyTabs from './nodeSettings/classifyNode/tabs';
import LLMPromptTabs from './nodeSettings/llmPromptNode/tabs';
import SearchTabs from './nodeSettings/searchNode/tabs';
import SingleChatPromptTabs from './nodeSettings/singleChatPromptNode/tabs';
import TabsTemplate from './nodeSettings/TabsTemplate';
import TextTabs from './nodeSettings/textNode/tabs';
import NodesList from './NodesList';
import SandboxSettings from './SandboxSettings';
import {
	ChatPromptNodeDataType,
	ClassifyNodeDataType,
	CustomNode,
	LLMPromptNodeDataType,
	NodeTypesEnum,
	SearchDataType,
	SingleChatPromptDataType,
} from '../../nodes/types/NodeTypes';
import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import { conditionalClassNames } from '../../utils/classNames';
import Tutorial from '../Tutorial';
import UserWorkflows from '../UserWorkflows';

export default function LeftSidePanel({
	reactFlowWrapper,
	reactFlowInstance,
	supabase,
}: {
	reactFlowWrapper: React.MutableRefObject<HTMLDivElement | null>;
	reactFlowInstance: ReactFlowInstance<any, any> | null;
	supabase: SupabaseClient<Database>;
}) {
	const {
		setUiErrorMessage,
		setWorkflows,
		currentWorkflow,
		setCurrentWorkflow,
		selectedNode,
		updateNode,
		clearGraph,
		setIsDetailMode,
	} = useStore(selector, shallow);
	const { session, openAiKey, setOpenAiKey } = useStoreSecret(selectorSecret, shallow);

	const [openWorkflows, setOpenWorkflows] = useState(!currentWorkflow);
	const [openTutorials, setOpenTutorials] = useState(false);

	const [currentPage, setCurrentPage] = useState('Blocks');

	const [isDetailModeAll, setIsDetailModeAll] = useState(false);

	function prettyPrintType(selectedNode: Node | null) {
		if (!selectedNode) return;
		if (selectedNode.type === NodeTypesEnum.llmPrompt) {
			return ': LLM Prompt';
		} else if (selectedNode.type === NodeTypesEnum.text) {
			return ': Input Text';
		} else if (selectedNode.type === NodeTypesEnum.chatPrompt) {
			return ': Chat Prompt';
		} else if (selectedNode.type === NodeTypesEnum.chatMessage) {
			return ': Chat Message';
		} else if (selectedNode.type === NodeTypesEnum.classify) {
			return ': Classify';
		} else if (selectedNode.type === NodeTypesEnum.fileText) {
			return ': File Text';
		} else if (selectedNode.type === NodeTypesEnum.search) {
			return ': File Search';
		} else {
			return ``;
		}
	}

	return (
		<aside className="h-full w-full overflow-auto border-r-1 border-slate-400 bg-slate-50 shadow-lg">
			{/* {session && (
				<UserWorkflows
					currentWorkflow={currentWorkflow}
					setCurrentWorkflow={setCurrentWorkflow}
					setWorkflows={setWorkflows}
					open={openWorkflows}
					setOpen={setOpenWorkflows}
					reactFlowInstance={reactFlowInstance}
				/>
			)} */}
			<Tutorial open={openTutorials} setOpen={setOpenTutorials} />

			<div className="flex h-full flex-col justify-start border-1 ">
				<div className="flex flex-col bg-slate-50">
					{/* <div className="">
						<a
							className="bg group flex cursor-pointer items-center justify-start px-2 py-1 text-sm 
											font-medium text-slate-700 hover:bg-slate-100 hover:font-bold hover:text-slate-900"
							onClick={async () => {
								if (session) {
									setOpenWorkflows(true);
								} else {
									setUiErrorMessage('Please login to save sandboxes');
								}
							}}
						>
							<BeakerIcon
								className={
									'mr-3 h-6 w-6 flex-shrink-0 text-slate-500 group-hover:text-slate-600'
								}
								aria-hidden="true"
							/>
							<span className="truncate">My Chatbots</span>
						</a>
					</div> */}
					<div className="">
						<a
							className="bg group flex cursor-pointer items-center justify-start px-2 py-1 text-sm 
											font-medium text-slate-700 hover:bg-slate-100 hover:font-bold hover:text-slate-900"
							onClick={async () => {
								setOpenTutorials(true);
							}}
						>
							<AcademicCapIcon
								className={
									'mr-3 h-6 w-6 flex-shrink-0 text-slate-500 group-hover:text-slate-600'
								}
								aria-hidden="true"
							/>
							<span className="truncate">Tutorial</span>
						</a>
					</div>
					<div className="">
						<a
							className="bg group flex cursor-pointer items-center justify-start px-2 py-1 text-sm 
							font-medium text-slate-700 hover:bg-slate-100 hover:font-bold hover:text-slate-900"
							onClick={async () => {
								const currentKey = openAiKey || '';
								const newOpenAIKey = window.prompt(
									'Enter your OpenAI Key here',
									currentKey,
								);

								if (newOpenAIKey === null) {
									return;
								}

								if (newOpenAIKey === '') {
									console.log('No key entered');
								} else {
									if (session) {
										await supabase.functions.invoke('insert-api-key', {
											body: {
												api_key: newOpenAIKey,
											},
										});
									}
									setOpenAiKey(newOpenAIKey);
								}
							}}
						>
							<Cog6ToothIcon
								className={
									'mr-3  h-6 w-6 flex-shrink-0 text-slate-500 group-hover:text-slate-900'
								}
								aria-hidden="true"
							/>
							<span className="truncate">OpenAI Key</span>
						</a>
					</div>
					<div className="flex items-center justify-evenly gap-2 py-2">
						<button
							className="flex items-center rounded bg-red-500 px-2 py-1 text-sm font-semibold text-white hover:bg-red-600"
							onClick={() => {
								// Are you sure prompt
								if (window.confirm('Are you sure you want to clear the graph?')) {
									clearGraph();
								}
							}}
						>
							<TrashIcon
								className={' mx-auto h-5 w-5 group-hover:text-slate-500'}
								aria-hidden="true"
							/>
							<span>Clear graph</span>
						</button>
						<Switch.Group as="div" className="flex items-center">
							<Switch
								checked={isDetailModeAll}
								onChange={() => {
									setIsDetailMode(!isDetailModeAll);
									setIsDetailModeAll((prev) => !prev);
								}}
								className={conditionalClassNames(
									isDetailModeAll ? 'bg-green-600' : 'bg-gray-200',
									'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
								)}
							>
								<span
									aria-hidden="true"
									className={conditionalClassNames(
										isDetailModeAll ? 'translate-x-5' : 'translate-x-0',
										'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
									)}
								/>
							</Switch>
							<Switch.Label as="span" className="ml-1 text-sm">
								<span className="font-medium text-slate-700">Detail Mode</span>
							</Switch.Label>
						</Switch.Group>
					</div>
				</div>
				<div className="flex w-full flex-col justify-start bg-slate-50">
					<div className="mb-1 flex w-full bg-slate-100 pt-1 text-sm">
						<div className="w-[0.10rem] border-b-1 border-slate-500" />
						<button
							className={conditionalClassNames(
								currentPage === 'Blocks'
									? 'border-b-0 bg-slate-50'
									: 'border-b-1 bg-slate-100 text-slate-600 hover:bg-slate-50',
								'rounded-t-md  border-1 border-slate-500 px-2 pt-1',
							)}
							onClick={() => {
								setCurrentPage('Blocks');
							}}
						>
							Blocks
						</button>
						<div className="w-[0.10rem] border-b-1 border-slate-500" />
						<button
							className={conditionalClassNames(
								currentPage === 'Current'
									? 'border-b-0 bg-slate-50'
									: 'border-b-1 bg-slate-100 text-slate-600 hover:bg-slate-50',
								'rounded-t-md  border-1 border-slate-500 px-2 pt-1 text-xs',
							)}
							onClick={() => {
								setCurrentPage('Current');
							}}
						>
							Settings<span className="">{prettyPrintType(selectedNode)}</span>
						</button>

						{session && (
							<>
								<div className="w-[0.10rem] border-b-1 border-slate-500" />
								<button
									className={conditionalClassNames(
										currentPage === 'Project'
											? 'border-b-0 bg-slate-50'
											: 'border-b-1 bg-slate-100 text-slate-600 hover:bg-slate-50',
										'rounded-t-md  border-1 border-slate-500 px-2 pt-1 text-xs',
									)}
									onClick={() => {
										setCurrentPage('Project');
									}}
								>
									Project
								</button>
							</>
						)}
						<div className="flex-grow border-b-1 border-slate-500" />
					</div>
				</div>
				<div className="flex grow flex-col rounded-tr-lg">
					{currentPage === 'Blocks' && (
						<NodesList
							reactFlowWrapper={reactFlowWrapper}
							reactFlowInstance={reactFlowInstance}
						/>
					)}
					{currentPage === 'Current' && (
						<>
							{selectedNode && (
								<div className="relative ml-2 h-full">
									<div className="absolute h-full w-full">
										<NodeTabs
											selectedNode={selectedNode}
											updateNode={updateNode}
										/>
									</div>
								</div>
							)}
						</>
					)}
					{currentPage === 'Project' && (
						<SandboxSettings
							currentWorkflow={currentWorkflow}
							setCurrentWorkflow={setCurrentWorkflow}
						/>
					)}
				</div>
			</div>
		</aside>
	);
}
function NodeTabs({ selectedNode, updateNode }: { selectedNode: CustomNode; updateNode: any }) {
	switch (selectedNode.type) {
		case NodeTypesEnum.llmPrompt:
			return (
				<LLMPromptTabs
					selectedNode={selectedNode as Node<LLMPromptNodeDataType>}
					updateNode={updateNode}
				/>
			);
		case NodeTypesEnum.text:
			return <TextTabs selectedNode={selectedNode} updateNode={updateNode} />;
		case NodeTypesEnum.chatPrompt:
			return (
				<ChatPromptTabs
					selectedNode={selectedNode as Node<ChatPromptNodeDataType>}
					updateNode={updateNode}
				/>
			);
		case NodeTypesEnum.chatMessage:
			return <ChatMessageTabs selectedNode={selectedNode} updateNode={updateNode} />;
		case NodeTypesEnum.classify:
			return (
				<ClassifyTabs
					selectedNode={selectedNode as Node<ClassifyNodeDataType>}
					updateNode={updateNode}
				/>
			);
		case NodeTypesEnum.search:
			return (
				<SearchTabs
					selectedNode={selectedNode as Node<SearchDataType>}
					updateNode={updateNode}
				/>
			);
		case NodeTypesEnum.singleChatPrompt:
			return (
				<SingleChatPromptTabs
					selectedNode={selectedNode as Node<SingleChatPromptDataType>}
					updateNode={updateNode}
				/>
			);
		// case NodeTypesEnum.classifyCategories:
		// 	return;
		// case NodeTypesEnum.fileText:
		// 	return;
		// case NodeTypesEnum.combine:
		// 	return;
		// case NodeTypesEnum.loop:
		// 	return;
		// case NodeTypesEnum.conditional:
		// 	return;
		// case NodeTypesEnum.counter:
		// 	return;
		// case NodeTypesEnum.inputText:
		// 	return;
		// case NodeTypesEnum.outputText:
		// 	return;
		// case NodeTypesEnum.globalVariable:
		// 	return;
		// case NodeTypesEnum.setVariable:
		// 	return;

		default:
			return <TabsTemplate selectedNode={selectedNode} updateNode={updateNode} tabs={[]} />;
	}
}
