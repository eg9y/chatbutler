import { Switch } from '@headlessui/react';
import {
	Cog6ToothIcon,
	BeakerIcon,
	AcademicCapIcon,
	TrashIcon,
	DocumentMagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { SupabaseClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { ReactFlowInstance, Node } from 'reactflow';
import { shallow } from 'zustand/shallow';

import ChatMessageTabs from './nodeSettings/chatMessage/tabs';
import ChatPromptTabs from './nodeSettings/chatPromptNode/tabs';
import ClassifyTabs from './nodeSettings/classifyNode/tabs';
import LLMPromptTabs from './nodeSettings/llmPromptNode/tabs';
import SearchTabs from './nodeSettings/searchNode/tabs';
import TextTabs from './nodeSettings/textNode/tabs';
import NodesList from './NodesList';
import {
	ChatPromptNodeDataType,
	ClassifyNodeDataType,
	LLMPromptNodeDataType,
	NodeTypesEnum,
	SearchDataType,
} from '../../nodes/types/NodeTypes';
import { Database } from '../../schema';
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

	const [currentPage, setCurrentPage] = useState('Nodes');

	const [isDetailModeAll, setIsDetailModeAll] = useState(false);

	function prettyPrintType(selectedNode: Node | null) {
		if (!selectedNode) return;
		if (selectedNode.type === NodeTypesEnum.llmPrompt) {
			return 'LLM Prompt';
		} else if (selectedNode.type === NodeTypesEnum.text) {
			return 'Input Text';
		} else if (selectedNode.type === NodeTypesEnum.chatPrompt) {
			return 'Chat Prompt';
		} else if (selectedNode.type === NodeTypesEnum.chatMessage) {
			return 'Chat Message';
		} else if (selectedNode.type === NodeTypesEnum.classify) {
			return 'Classify';
		} else if (selectedNode.type === NodeTypesEnum.fileText) {
			return 'File Text';
		} else if (selectedNode.type === NodeTypesEnum.search) {
			return 'File Search';
		} else {
			return 'TBD';
		}
	}

	return (
		<aside className="bg-slate-50 w-full h-full overflow-auto shadow-lg border-r-1 border-slate-400">
			{session && (
				<UserWorkflows
					currentWorkflow={currentWorkflow}
					setCurrentWorkflow={setCurrentWorkflow}
					setWorkflows={setWorkflows}
					open={openWorkflows}
					setOpen={setOpenWorkflows}
					reactFlowInstance={reactFlowInstance}
				/>
			)}
			<Tutorial open={openTutorials} setOpen={setOpenTutorials} />

			<div className="flex flex-col justify-start h-full border-1 ">
				<div className="flex flex-col bg-slate-50">
					<div className="">
						<a
							className="group px-2 py-1 flex items-center justify-start text-sm font-medium text-slate-700 
											bg hover:text-slate-900 hover:font-bold cursor-pointer hover:bg-slate-100"
							onClick={async () => {
								if (session) {
									setOpenWorkflows(true);
								} else {
									setUiErrorMessage('Please login to save workflows');
								}
							}}
						>
							<BeakerIcon
								className={
									'text-slate-500 group-hover:text-slate-600 mr-3 h-6 w-6 flex-shrink-0'
								}
								aria-hidden="true"
							/>
							<span className="truncate">My Workflows</span>
						</a>
					</div>
					<div className="">
						<a
							className="group px-2 py-1 flex items-center justify-start text-sm font-medium text-slate-700 
											bg hover:text-slate-900 hover:font-bold cursor-pointer hover:bg-slate-100"
							onClick={async () => {
								setOpenTutorials(true);
							}}
						>
							<AcademicCapIcon
								className={
									'text-slate-500 group-hover:text-slate-600 mr-3 h-6 w-6 flex-shrink-0'
								}
								aria-hidden="true"
							/>
							<span className="truncate">Tutorial</span>
						</a>
					</div>
					<div className="">
						<a
							className="group px-2 py-1 flex items-center justify-start text-sm font-medium text-slate-700 
							bg hover:text-slate-900 hover:font-bold cursor-pointer hover:bg-slate-100"
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
									'text-slate-500  group-hover:text-slate-900 mr-3 h-6 w-6 flex-shrink-0'
								}
								aria-hidden="true"
							/>
							<span className="truncate">OpenAI Key</span>
						</a>
					</div>
					<div className="flex items-center gap-2 justify-evenly py-2">
						<button
							className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded flex items-center"
							onClick={() => {
								// Are you sure prompt
								if (window.confirm('Are you sure you want to clear the graph?')) {
									clearGraph();
								}
							}}
						>
							<TrashIcon
								className={' group-hover:text-slate-500 mx-auto h-5 w-5'}
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
							<Switch.Label as="span" className="ml-3 text-sm">
								<span className="font-medium text-gray-900">Detail Mode</span>
							</Switch.Label>
						</Switch.Group>
					</div>
				</div>
				<div className="flex flex-col justify-start bg-slate-50 w-full">
					<div className="w-full flex mb-1 text-sm bg-slate-100 pt-1">
						<div className="w-[0.10rem] border-b-1 border-slate-500" />
						<button
							className={conditionalClassNames(
								currentPage === 'Nodes'
									? 'border-b-0 bg-slate-50'
									: 'border-b-1 bg-slate-100 text-slate-600 hover:bg-slate-50',
								'border-1  border-slate-500 px-2 pt-1 rounded-t-md',
							)}
							onClick={() => {
								setCurrentPage('Nodes');
							}}
						>
							Nodes
						</button>
						<div className="w-[0.10rem] border-b-1 border-slate-500" />
						<button
							className={conditionalClassNames(
								currentPage === 'Current'
									? 'border-b-0 bg-slate-50'
									: 'border-b-1 bg-slate-100 text-slate-600 hover:bg-slate-50',
								'border-1  border-slate-500 px-2 pt-1 rounded-t-md text-xs',
							)}
							onClick={() => {
								setCurrentPage('Current');
							}}
						>
							Settings<span className="">: {prettyPrintType(selectedNode)}</span>
						</button>
						<div className="flex-grow border-b-1 border-slate-500" />
					</div>
				</div>
				<div className="grow flex flex-col rounded-tr-lg">
					{currentPage === 'Nodes' && (
						<NodesList
							reactFlowWrapper={reactFlowWrapper}
							reactFlowInstance={reactFlowInstance}
						/>
					)}
					{currentPage === 'Current' && (
						<>
							{selectedNode && (
								<div className="ml-2 h-full relative">
									<div className="absolute w-full h-full">
										{selectedNode.type === NodeTypesEnum.llmPrompt && (
											<LLMPromptTabs
												selectedNode={
													selectedNode as Node<LLMPromptNodeDataType>
												}
												updateNode={updateNode}
											/>
										)}
										{selectedNode.type === NodeTypesEnum.text && (
											<TextTabs
												selectedNode={selectedNode}
												updateNode={updateNode}
											/>
										)}
										{selectedNode.type === NodeTypesEnum.chatMessage && (
											<ChatMessageTabs
												selectedNode={selectedNode}
												updateNode={updateNode}
											/>
										)}
										{selectedNode.type === NodeTypesEnum.chatPrompt && (
											<ChatPromptTabs
												selectedNode={
													selectedNode as Node<ChatPromptNodeDataType>
												}
												updateNode={updateNode}
											/>
										)}
										{selectedNode.type === NodeTypesEnum.classify && (
											<ClassifyTabs
												selectedNode={
													selectedNode as Node<ClassifyNodeDataType>
												}
												updateNode={updateNode}
											/>
										)}
										{selectedNode.type === NodeTypesEnum.search && (
											<SearchTabs
												selectedNode={selectedNode as Node<SearchDataType>}
												updateNode={updateNode}
											/>
										)}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</aside>
	);
}
