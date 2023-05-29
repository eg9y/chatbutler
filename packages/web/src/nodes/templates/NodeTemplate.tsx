import { NodeTypesEnum, DefaultNodeDataType, OpenAIAPIRequest } from '@chatbutler/shared/src/index';
import {
	ArrowPathIcon,
	ArrowsPointingOutIcon,
	ClipboardIcon,
	PlusCircleIcon,
	SignalIcon,
} from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { NodeProps, NodeToolbar, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../../assets/loading.svg';
import FullScreenEditor from '../../components/FullScreenEditor';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import { calculateCreditsRequired } from '../../utils/userCredits';

interface NodeTemplateInterface {
	title: string;
	fieldName: string;
	color?: string;
	labelComponent?: (updateNode: any) => React.ReactNode;
	selected: boolean;
}

function getBackgroundColor(color: string) {
	if (color === 'green') {
		return `bg-green-200`;
	} else if (color === 'emerald') {
		return `bg-emerald-200`;
	} else if (color === 'amber') {
		return `bg-amber-200`;
	} else if (color === 'purple') {
		return `bg-purple-200`;
	} else if (color === 'indigo') {
		return `bg-indigo-200`;
	} else if (color === 'sky') {
		return `bg-sky-200`;
	} else if (color === 'slate') {
		return `bg-slate-200`;
	} else if (color === 'rose') {
		return `bg-rose-200`;
	}
	return `bg-rose-200`;
}

function getBorderColor(color: string) {
	if (color === 'green') {
		return `border-green-400`;
	} else if (color === 'emerald') {
		return `border-emerald-400`;
	} else if (color === 'amber') {
		return `border-amber-400`;
	} else if (color === 'purple') {
		return `border-purple-400`;
	} else if (color === 'indigo') {
		return `border-indigo-400`;
	} else if (color === 'sky') {
		return `border-sky-400`;
	} else if (color === 'slate') {
		return `border-slate-400`;
	} else if (color === 'rose') {
		return `border-rose-400`;
	}
	return `border-rose-400`;
}

function tabSupportedBlocks(type: string) {
	if (
		[
			// NodeTypesEnum.classify,
			NodeTypesEnum.loop,
		].includes(type as NodeTypesEnum)
	) {
		return false;
	}
	return true;
}

const NodeTemplate: FC<
	NodeProps<DefaultNodeDataType> &
		NodeTemplateInterface & {
			showFullScreen: boolean;
			setShowFullScreen: (show: boolean) => void;
			children: (updateNode: any) => React.ReactNode;
		}
> = ({
	id,
	type,
	data,
	title,
	fieldName,
	color = 'yellow',
	showFullScreen,
	setShowFullScreen,
	labelComponent,
	children,
	selected,
}) => {
	const { updateNode, getNodes } = useStore(selector, shallow);
	const [currentPage, setCurrentPage] = useState('Block');

	return (
		<div
			className={conditionalClassNames(
				data.isDetailMode && '35rem',

				'flex h-full flex-col rounded-xl',
			)}
		>
			<NodeToolbar position={Position.Top} isVisible={data.isLoading}>
				<Loading className="h-12 w-12 animate-spin text-green-500" />
			</NodeToolbar>
			<NodeToolbar
				position={Position.Bottom}
				isVisible={
					!!type &&
					[
						NodeTypesEnum.chatPrompt,
						NodeTypesEnum.singleChatPrompt,
						NodeTypesEnum.classify,
						NodeTypesEnum.llmPrompt,
						NodeTypesEnum.search,
					].includes(type as NodeTypesEnum)
				}
			>
				{(data as DefaultNodeDataType & OpenAIAPIRequest).model && data.text.length > 0 && (
					<div className="flex gap-2">
						<p className="text-slate-600">
							{'>'}
							{calculateCreditsRequired(data, data.text)} credit
						</p>
					</div>
				)}
			</NodeToolbar>
			<NodeToolbar
				position={Position.Right}
				isVisible={!!data.loopId && data.children.length === 0}
				className="flex grow items-center"
			>
				<ArrowPathIcon className="mx-auto h-20 w-20 text-slate-700/80" />
			</NodeToolbar>
			{data.isDetailMode && tabSupportedBlocks(type) && (
				<Tabs
					selected={selected}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					bgColor={getBackgroundColor(color)}
					borderColor={getBorderColor(color)}
					response={data.response}
					title={title}
				/>
			)}
			<div
				className={conditionalClassNames(
					selected
						? `${getBorderColor(color)} border-8 border-t-8`
						: 'border-2 border-slate-400',
					'flex grow flex-col bg-slate-50',
				)}
			>
				<div
					className={conditionalClassNames(
						getBackgroundColor(color),

						data.isDetailMode ? 'p-4' : 'px-10 pb-5 pt-10',
						`flex items-center justify-between gap-2 rounded-t-lg border-b-0 border-slate-400 p-4 text-3xl `,
					)}
				>
					<div className="flex items-center gap-2 ">
						<h1 className={conditionalClassNames(!data.isDetailMode && 'text-4xl')}>
							{(!tabSupportedBlocks(type) || !data.isDetailMode) && (
								<span className="font-semibold opacity-70">{title}</span>
							)}
							{data.isDetailMode && ` ${data.name}`}
						</h1>
					</div>

					<button
						type="button"
						className=" text-slate-700/70 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
						onClick={(e) => {
							e.preventDefault();
							const node = getNodes([id])[0];
							updateNode(
								id,
								{
									...data,
									isDetailMode: !data.isDetailMode,
								},
								{
									x: data.isDetailMode
										? node.position.x + 100
										: node.position.x - 100,
									y: data.isDetailMode
										? node.position.y + 100
										: node.position.y - 100,
								},
							);
						}}
					>
						<PlusCircleIcon className="h-14 w-14" aria-hidden="true" />
					</button>
				</div>
				<div
					className={conditionalClassNames(
						data.isDetailMode ? 'h-14 text-2xl' : 'py-10 text-5xl',
						'flex w-full items-center justify-between gap-6 bg-slate-100 px-4 text-slate-800',
					)}
				>
					{data.isDetailMode ? (
						labelComponent ? (
							labelComponent(updateNode)
						) : (
							<label htmlFor="text" className="block font-medium">
								{currentPage === 'Block' ? fieldName : 'Result'}
							</label>
						)
					) : (
						<label htmlFor="text" className="block grow text-center font-medium">
							{data.name}
						</label>
					)}
					<ArrowsPointingOutIcon
						className={'h-8 w-8  flex-shrink-0 text-slate-500 hover:text-slate-800'}
						aria-hidden="true"
						onClick={() => {
							setShowFullScreen(!showFullScreen);
						}}
					/>
				</div>

				{currentPage === 'Result' && (
					<div className="flex grow flex-col gap-1 px-4 pb-4 text-slate-900">
						<p className="text-2xl">{data.response}</p>
						<ClipboardIcon
							className={conditionalClassNames(
								' -ml-1 mr-1 h-7 w-7 flex-shrink-0 cursor-pointer text-slate-500 hover:text-slate-900 active:scale-50',
							)}
							aria-hidden="true"
							onClick={() => {
								navigator.clipboard.writeText(data.response);
							}}
						/>
					</div>
				)}
				{currentPage === 'Block' && (
					<>
						{data.isDetailMode && <Content>{children(updateNode)}</Content>}
						<FullScreenEditor
							heading={fieldName}
							showFullScreen={showFullScreen}
							setShowFullScreen={setShowFullScreen}
						>
							<Content>{children(updateNode)}</Content>
						</FullScreenEditor>
					</>
				)}
			</div>
		</div>
	);
};

const Content: FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return <div className="flex grow flex-col gap-1 px-4 pb-4 text-slate-900">{children}</div>;
};

export default memo(NodeTemplate);

function Tabs({
	selected,
	currentPage,
	setCurrentPage,
	bgColor,
	borderColor,
	response,
	title,
}: {
	selected: boolean;
	currentPage: string;
	setCurrentPage: (page: string) => void;
	bgColor: string;
	borderColor: string;
	response: string;
	title: string;
}) {
	return (
		<div className="flex w-full pt-2 text-2xl">
			<button
				className={conditionalClassNames(
					selected && `border-b-0 ${bgColor}`,
					currentPage === 'Block' ? 'z-10 ' : 'opacity-80',
					currentPage === 'Block' && selected
						? ` border-4 ${borderColor} `
						: `border-2 border-b-0 border-slate-500 text-slate-600 hover:opacity-100 ${bgColor}`,
					'grow rounded-t-md px-10 pt-1',
				)}
				onClick={() => {
					setCurrentPage('Block');
				}}
			>
				<span className="font-semibold opacity-70">{title}</span>
			</button>
			<div className="w-[0.15rem] border-b-0 border-slate-500" />
			<button
				className={conditionalClassNames(
					selected && `border-b-0 ${bgColor}`,
					currentPage === 'Result' ? 'z-10 ' : 'opacity-80',
					currentPage === 'Result' && selected
						? ` border-4 ${borderColor} `
						: ` border-2 border-b-0 border-slate-500 text-slate-600 hover:opacity-100 ${bgColor}`,
					'flex grow items-center justify-center gap-1 rounded-t-md px-10 pt-1',
				)}
				onClick={() => {
					setCurrentPage('Result');
				}}
			>
				<p>Result</p>
				<p className="flex items-center gap-1 pl-2">
					<SignalIcon
						className={conditionalClassNames(
							response.length > 0 ? 'text-green-600' : 'hidden',
							' -ml-1 mr-1 h-7 w-7 flex-shrink-0',
						)}
						aria-hidden="true"
					/>
				</p>
			</button>
		</div>
	);
}
