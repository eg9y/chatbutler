import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Node } from 'reactflow';
import { shallow } from 'zustand/shallow';

import ChatPanel from './ChatPanel';
import ChatMessageTabs from './nodeSettings/chatMessage/tabs';
import ChatPromptTabs from './nodeSettings/chatPromptNode/tabs';
import ClassifyTabs from './nodeSettings/classifyNode/tabs';
import LLMPromptTabs from './nodeSettings/llmPromptNode/tabs';
import SearchTabs from './nodeSettings/searchNode/tabs';
import TextTabs from './nodeSettings/textNode/tabs';
import {
	ChatPromptNodeDataType,
	ClassifyNodeDataType,
	LLMPromptNodeDataType,
	NodeTypesEnum,
	SearchDataType,
} from '../../nodes/types/NodeTypes';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';

export default function SettingsPanel() {
	const { selectedNode, updateNode } = useStore(selector, shallow);

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
		<div
			style={{ height: '95vh' }}
			className="bg-slate-50 shadow-xl flex flex-col w-full border-l-1 border-slate-400"
		>
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="bg-slate-300 flex justify-between border-b-1 border-slate-400">
							<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4">
								{prettyPrintType(selectedNode)}
							</p>
							<ChevronRightIcon
								className={conditionalClassNames(
									open ? 'rotate-90 transform' : '',
									'w-5 text-slate-500',
								)}
							/>
						</Disclosure.Button>
						<Disclosure.Panel
							style={{
								height: '50vh',
							}}
							className="flex flex-col gap-1 px-2"
						>
							{selectedNode && (
								<div className="ml-2 h-full relative overflow-y-scroll">
									<div className="absolute w-full">
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
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<div className="grow flex flex-col">
						<Disclosure.Button className="bg-slate-300 flex justify-between w-full  border-b-1 border-slate-400">
							<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4">
								Chat
							</p>
							<ChevronRightIcon
								className={conditionalClassNames(
									open ? 'rotate-90 transform' : '',
									'w-5 text-slate-500',
								)}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="flex flex-col gap-1 px-2 grow">
							<ChatPanel selectedNode={selectedNode} />
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>
		</div>
	);
}
