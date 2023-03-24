import {
	Cog6ToothIcon,
	Bars3CenterLeftIcon,
	ChatBubbleLeftEllipsisIcon,
	DocumentTextIcon,
	ChatBubbleLeftRightIcon,
	ShareIcon,
} from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';
import useStore, { selector } from '../store/useStore';
import { NodeTypesEnum } from '../nodes/types/NodeTypes';
import { FC, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
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
	const { setOpenAiKey } = useStore(selector, shallow);

	const [dragging, setDragging] = useState(false);

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

	return (
		<aside
			style={{
				height: '100vh',
			}}
			className="bg-slate-50 w-full shadow-lg"
		>
			<div className="flex flex-col justify-between h-full py-1 border-1">
				<div className="space-y-1">
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
				<div className="px-2 pb-4">
					<div className="mt-1 space-y-1" aria-labelledby="projects-headline">
						<a
							className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:text-slate-900 cursor-pointer border-2 border-slate-400"
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
									'text-slate-400 group-hover:text-slate-500 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
								}
								aria-hidden="true"
							/>
							<span className="truncate">OpenAI Key</span>
						</a>
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
