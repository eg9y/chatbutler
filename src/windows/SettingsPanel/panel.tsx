import { useState } from 'react';

import { shallow } from 'zustand/shallow';
import { Node } from 'reactflow';

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

import useStore, { selector } from '../../store/useStore';

import LLMPromptTabs from './nodeSettings/llmPromptNode/tabs';
import TextInputTabs from './nodeSettings/textInputNode/tabs';
import { LLMPromptNodeDataType, NodeTypesEnum } from '../../nodes/types/NodeTypes';
import NodesPanel from './NodesPanel';
import ChatMessageTabs from './nodeSettings/chatMessage/tabs';

export default function SettingsPanel() {
	const { selectedNode, updateNode } = useStore(selector, shallow);
	const [topDivCollapsed, setTopDivCollapsed] = useState(false);
	const [bottomDivCollapsed, setBottomDivCollapsed] = useState(false);

	function prettyPrintType(selectedNode: Node | null) {
		if (!selectedNode) return;
		if (selectedNode.type === NodeTypesEnum.llmPrompt) {
			return 'LLM Prompt';
		} else if (selectedNode.type === NodeTypesEnum.textInput) {
			return 'Input Text';
		} else if (selectedNode.type === NodeTypesEnum.chatPrompt) {
			return 'Chat Prompt';
		} else if (selectedNode.type === NodeTypesEnum.chatMessage) {
			return 'Chat Message';
		}
	}

	return (
		<div
			style={{ height: '100vh' }}
			className="bg-slate-50 shadow-xl flex flex-col w-full border-1"
		>
			<div
				className="bg-slate-200 flex justify-between cursor-pointer"
				onClick={() => setTopDivCollapsed(!topDivCollapsed)}
			>
				<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4 py-1">
					{prettyPrintType(selectedNode)}
				</p>
				<button className=" text-slate-900 font-semibold text-md px-2 py-1">
					{topDivCollapsed ? (
						<ChevronUpIcon
							className={'text-slate-600 group-hover:text-gray-500 h-full mx-auto'}
							aria-hidden="true"
						/>
					) : (
						<ChevronDownIcon
							className={'text-slate-600 group-hover:text-gray-500 h-full mx-auto'}
							aria-hidden="true"
						/>
					)}
				</button>
			</div>
			<div
				style={{
					height: topDivCollapsed ? '1%' : '60%',
					flexGrow: bottomDivCollapsed ? '1' : 0,
				}}
				className="flex flex-col overflow-hidden"
			>
				{!topDivCollapsed && selectedNode && (
					<div className="ml-2 h-full">
						{selectedNode.type === NodeTypesEnum.llmPrompt && (
							<LLMPromptTabs
								selectedNode={selectedNode as Node<LLMPromptNodeDataType>}
								updateNode={updateNode}
							/>
						)}
						{selectedNode.type === NodeTypesEnum.textInput && (
							<TextInputTabs selectedNode={selectedNode} updateNode={updateNode} />
						)}
						{selectedNode.type === NodeTypesEnum.chatMessage && (
							<ChatMessageTabs selectedNode={selectedNode} updateNode={updateNode} />
						)}
					</div>
				)}
			</div>
			<div
				style={{
					height: bottomDivCollapsed ? '5%' : '40%',
				}}
				className=" bg-white flex flex-col"
			>
				<div
					className="bg-slate-200 flex gap-1 justify-between cursor-pointer"
					onClick={() => setBottomDivCollapsed(!bottomDivCollapsed)}
				>
					<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4 py-1">
						Nodes
					</p>
					<button className="text-slate-900 font-semibold text-md px-2 py-1">
						{bottomDivCollapsed ? (
							<ChevronDownIcon
								className={
									'text-slate-600 group-hover:text-gray-500 h-full mx-auto'
								}
								aria-hidden="true"
							/>
						) : (
							<ChevronUpIcon
								className={
									'text-slate-600 group-hover:text-gray-500 h-full mx-auto'
								}
								aria-hidden="true"
							/>
						)}
					</button>
				</div>
				{!bottomDivCollapsed && (
					<div className="">
						<NodesPanel selectedNode={selectedNode} />
					</div>
				)}
			</div>
		</div>
	);
}
