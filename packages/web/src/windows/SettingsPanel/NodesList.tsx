import { Disclosure } from '@headlessui/react';
import {
	ChevronRightIcon,
	ChatBubbleLeftRightIcon,
	ChatBubbleLeftEllipsisIcon,
	PencilIcon,
	Bars3CenterLeftIcon,
	ArrowLeftOnRectangleIcon,
	ArrowRightOnRectangleIcon,
	ShareIcon,
	DocumentTextIcon,
	MagnifyingGlassIcon,
	WrenchIcon,
	ArrowPathIcon,
	PlusIcon,
} from '@heroicons/react/20/solid';
import { FC, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { NodeTypesEnum } from '../../nodes/types/NodeTypes';
import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import { RFStateSecret } from '../../store/useStoreSecret';
import { conditionalClassNames } from '../../utils/classNames';
const rightAngleSvg = new URL('../../assets/right-angle.svg', import.meta.url).href;

const NodesList = ({
	reactFlowWrapper,
	reactFlowInstance,
}: {
	reactFlowWrapper: React.MutableRefObject<HTMLDivElement | null>;
	reactFlowInstance: ReactFlowInstance<any, any> | null;
}) => {
	const { onAdd } = useStore(selector, shallow);
	const { session } = useStoreSecret(selectorSecret, shallow);
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
		<div className="w-full">
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between border-b-1 border-slate-400 bg-slate-300">
							<p className="text-md pl-4 pr-2 text-start font-semibold text-slate-900">
								GPT
							</p>
							<ChevronRightIcon
								className={conditionalClassNames(
									open ? 'rotate-90 transform' : '',
									'w-5 text-slate-500',
								)}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="flex flex-col gap-1 px-2 py-2">
							<NodeType
								name="Single Chat"
								nodeType={NodeTypesEnum.singleChatPrompt}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ChatBubbleLeftRightIcon}
							/>
							<NodeType
								name="Chat"
								nodeType={NodeTypesEnum.chatPrompt}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ChatBubbleLeftRightIcon}
							/>
							<div className="flex">
								<img src={rightAngleSvg} alt="SVG as an image" />
								<div className="grow">
									<NodeType
										name="Message"
										nodeType={NodeTypesEnum.chatMessage}
										handleDrag={handleDrag}
										addNodeToCenter={addNodeToCenter}
										Icon={ChatBubbleLeftEllipsisIcon}
									/>
								</div>
							</div>
							<NodeType
								name="Complete"
								nodeType={NodeTypesEnum.llmPrompt}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={PencilIcon}
							/>
							<NodeType
								name="Classify"
								nodeType={NodeTypesEnum.classify}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ShareIcon}
							/>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between border-b-1 border-slate-400 bg-slate-300">
							<p className="text-md pl-4 pr-2 text-start font-semibold text-slate-900">
								Helper
							</p>
							<ChevronRightIcon
								className={conditionalClassNames(
									open ? 'rotate-90 transform' : '',
									'w-5 text-slate-500',
								)}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="flex flex-col gap-1 px-2 py-2">
							<NodeType
								name="Text"
								nodeType={NodeTypesEnum.text}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={Bars3CenterLeftIcon}
							/>
							<NodeType
								name="User Input"
								nodeType={NodeTypesEnum.inputText}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ArrowLeftOnRectangleIcon}
							/>
							<NodeType
								name="User Output"
								nodeType={NodeTypesEnum.outputText}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ArrowRightOnRectangleIcon}
							/>
							<NodeType
								name="Loop"
								nodeType={NodeTypesEnum.loop}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ArrowPathIcon}
							/>
							<NodeType
								name="Conditional"
								nodeType={NodeTypesEnum.conditional}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ArrowRightOnRectangleIcon}
							/>
							<NodeType
								name="New Variable"
								nodeType={NodeTypesEnum.globalVariable}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ArrowRightOnRectangleIcon}
							/>
							{/* <NodeType
								name="Counter"
								nodeType={NodeTypesEnum.counter}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={PlusIcon}
							/> */}
							<NodeType
								name="Set Variable"
								nodeType={NodeTypesEnum.setVariable}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={ArrowRightOnRectangleIcon}
							/>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			{/* <Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="bg-slate-300 flex justify-between border-b-1 border-slate-400 w-full">
							<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4">
								Embeddings
							</p>
							<ChevronRightIcon
								className={conditionalClassNames(
									open ? 'rotate-90 transform' : '',
									'w-5 text-slate-500',
								)}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="flex flex-col gap-1 px-2 py-2">
							<NodeType
								name="Index Entry"
								nodeType={NodeTypesEnum.text}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={Bars3CenterLeftIcon}
							/>
							<NodeType
								name="Query Index"
								nodeType={NodeTypesEnum.text}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={Bars3CenterLeftIcon}
							/>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure> */}
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between border-b-1 border-slate-400 bg-slate-300">
							<p className="text-md pl-4 pr-2 text-start font-semibold text-slate-900">
								Docs
							</p>
							<ChevronRightIcon
								className={conditionalClassNames(
									open ? 'rotate-90 transform' : '',
									'w-5 text-slate-500',
								)}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="flex flex-col gap-1 px-2 py-2">
							{/* <NodeType
								name="File Text"
								nodeType={NodeTypesEnum.fileText}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={DocumentTextIcon}
								session={session}
								needAuth={true}
							/> */}
							<NodeType
								name="Document Load"
								nodeType={NodeTypesEnum.docsLoader}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={MagnifyingGlassIcon}
								session={session}
								needAuth={true}
							/>
							<NodeType
								name="Search"
								nodeType={NodeTypesEnum.search}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={MagnifyingGlassIcon}
								session={session}
								needAuth={true}
							/>
							{/* <NodeType
								name="Combine File(s)"
								nodeType={NodeTypesEnum.combine}
								handleDrag={handleDrag}
								addNodeToCenter={addNodeToCenter}
								Icon={WrenchIcon}
								// session={session}
								// needAuth={true}
							/> */}
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</div>
	);
};

const NodeType: FC<{
	name: string;
	nodeType: NodeTypesEnum;
	handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
	addNodeToCenter: (type: NodeTypesEnum) => void;
	session?: RFStateSecret['session'];
	needAuth?: boolean;
	Icon: React.ForwardRefExoticComponent<
		Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
			title?: string | undefined;
			titleId?: string | undefined;
		} & React.RefAttributes<SVGSVGElement>
	>;
}> = ({ name, handleDrag, addNodeToCenter, nodeType, session, Icon, needAuth = false }) => {
	const colorClassName = conditionalClassNames(
		nodeType === NodeTypesEnum.singleChatPrompt && `bg-indigo-200 border-1 border-indigo-400`,
		nodeType === NodeTypesEnum.chatMessage && `bg-indigo-200 border-1 border-indigo-400`,
		nodeType === NodeTypesEnum.chatPrompt && `bg-indigo-200 border-1 border-indigo-400`,
		nodeType === NodeTypesEnum.llmPrompt && `bg-amber-200 border-1 border-amber-400`,
		nodeType === NodeTypesEnum.classify && `bg-rose-200 border-1 border-rose-400`,
		nodeType === NodeTypesEnum.loop && `bg-emerald-200 border-1 border-emerald-400`,
		nodeType === NodeTypesEnum.globalVariable && `bg-slate-200 border-1 border-slate-400`,
		nodeType === NodeTypesEnum.setVariable && `bg-slate-200 border-1 border-slate-400`,
		nodeType === NodeTypesEnum.counter && `bg-emerald-200 border-1 border-emerald-400`,
		nodeType === NodeTypesEnum.text && `bg-emerald-200 border-1 border-emerald-400`,
		nodeType === NodeTypesEnum.conditional && `bg-emerald-200 border-1 border-emerald-400`,
		nodeType === NodeTypesEnum.inputText && `bg-emerald-200 border-1 border-emerald-400`,
		nodeType === NodeTypesEnum.outputText && `bg-emerald-200 border-1 border-emerald-400`,
		nodeType === NodeTypesEnum.docsLoader && `bg-sky-200 border-1 border-sky-400`,
		nodeType === NodeTypesEnum.fileText && `bg-sky-200 border-1 border-sky-400`,
		nodeType === NodeTypesEnum.search && `bg-sky-200 border-1 border-sky-400`,
		nodeType === NodeTypesEnum.combine && `bg-sky-200 border-1 border-sky-400`,
		needAuth && !session && `opacity-50 pointer-events-none`,
		`text-slate-600 group flex items-center justify-between rounded-sm px-2 py-1 text-xs cursor-pointer`,
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
				<span className="truncate">{name}</span>
				<Icon
					className={
						'-ml-1 mr-1 h-4 w-4 flex-shrink-0 text-slate-500 group-hover:text-slate-500'
					}
					aria-hidden="true"
				/>
			</a>
		</div>
	);
};

export default NodesList;
