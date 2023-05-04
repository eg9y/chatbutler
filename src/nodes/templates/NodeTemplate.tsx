import { ArrowPathIcon, ArrowsPointingOutIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import { memo, FC } from 'react';
import { NodeProps, NodeToolbar, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../../assets/loading.svg';
import FullScreenEditor from '../../components/FullScreenEditor';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import { DefaultNodeDataType } from '../types/NodeTypes';

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
}

function getRingColor(color: string) {
	if (color === 'green') {
		return `ring-green-400`;
	} else if (color === 'emerald') {
		return `ring-emerald-400`;
	} else if (color === 'amber') {
		return `ring-amber-400`;
	} else if (color === 'purple') {
		return `ring-purple-400`;
	} else if (color === 'indigo') {
		return `ring-indigo-400`;
	} else if (color === 'sky') {
		return `ring-sky-400`;
	} else if (color === 'slate') {
		return `ring-slate-400`;
	} else if (color === 'rose') {
		return `ring-rose-400`;
	}
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

	return (
		<div
			className={conditionalClassNames(
				data.isDetailMode && '35rem',
				selected ? `${getRingColor(color)} ring-8` : 'ring-2 ring-slate-400',
				'flex h-full flex-col rounded-xl bg-slate-100',
			)}
		>
			<NodeToolbar position={Position.Top} isVisible={data.isLoading}>
				<Loading className="h-12 w-12 animate-spin text-green-500" />
			</NodeToolbar>
			<NodeToolbar
				position={Position.Right}
				isVisible={!!data.loopId && data.children.length === 0}
				className="flex grow items-center"
			>
				<ArrowPathIcon className="mx-auto h-20 w-20 text-slate-700/80" />
			</NodeToolbar>
			<div
				className={conditionalClassNames(
					getBackgroundColor(color),
					data.isDetailMode ? 'p-4' : 'px-4 pt-10 pb-5',
					`flex items-center justify-between gap-2 rounded-t-lg border-b-1 border-slate-400 p-4 text-3xl `,
				)}
			>
				<div className="flex items-center gap-2 ">
					<h1 className={conditionalClassNames(!data.isDetailMode && 'text-4xl')}>
						<span className="font-semibold opacity-70">
							{title}
							{data.isDetailMode && '/'}
						</span>
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
							{fieldName}
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
			{data.isDetailMode && <Content>{children(updateNode)}</Content>}
			<FullScreenEditor
				heading={fieldName}
				showFullScreen={showFullScreen}
				setShowFullScreen={setShowFullScreen}
			>
				<Content>{children(updateNode)}</Content>
			</FullScreenEditor>
		</div>
	);
};

const Content: FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return <div className="flex h-full flex-col gap-1 px-4 pb-4 text-slate-900">{children}</div>;
};

export default memo(NodeTemplate);
