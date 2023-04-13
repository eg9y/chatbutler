import { ArrowPathIcon, ArrowsPointingOutIcon, PlusIcon } from '@heroicons/react/20/solid';
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

function getBorderColor(color: string) {
	if (color === 'green') {
		return `border-green-600`;
	} else if (color === 'emerald') {
		return `border-emerald-600`;
	} else if (color === 'amber') {
		return `border-amber-600`;
	} else if (color === 'purple') {
		return `border-purple-600`;
	} else if (color === 'indigo') {
		return `border-indigo-600`;
	} else if (color === 'sky') {
		return `border-sky-600`;
	} else if (color === 'slate') {
		return `border-slate-600`;
	} else if (color === 'rose') {
		return `border-rose-600`;
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
				selected ? getBorderColor(color) : 'border-slate-400',
				'h-full flex flex-col rounded-xl border-2 bg-slate-100',
			)}
		>
			<NodeToolbar position={Position.Top} isVisible={data.isLoading}>
				<Loading className="animate-spin h-12 w-12 text-green-500" />
			</NodeToolbar>
			<NodeToolbar
				position={Position.Right}
				isVisible={!!data.loopId && data.children.length === 0}
				className="grow flex items-center"
			>
				<ArrowPathIcon className="h-20 w-20 mx-auto text-slate-700/80" />
			</NodeToolbar>
			<div
				className={conditionalClassNames(
					getBackgroundColor(color),
					data.isDetailMode ? 'p-4' : 'pt-10 pb-5 px-8',
					`p-4 flex gap-2 justify-between items-center border-b-1 border-slate-400 rounded-t-lg text-3xl`,
				)}
			>
				<div className="flex gap-2 items-center">
					<h1 className={conditionalClassNames(!data.isDetailMode && 'text-4xl')}>
						<span className="font-semibold">{title}</span>
						{data.isDetailMode && `: ${data.name}`}
					</h1>
				</div>

				<button
					type="button"
					className="rounded-full bg-green-600 p-1 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
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
					<PlusIcon className="h-7 w-7" aria-hidden="true" />
				</button>
			</div>
			<div
				className={conditionalClassNames(
					data.isDetailMode ? 'h-14 text-2xl' : 'py-10 text-3xl',
					'px-4 gap-6 w-full flex justify-between items-center bg-slate-100',
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
					<label htmlFor="text" className="block font-medium ">
						{data.name}
					</label>
				)}

				<ArrowsPointingOutIcon
					className={'text-slate-500 hover:text-slate-800  h-8 w-8 flex-shrink-0'}
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
	return <div className="h-full flex flex-col gap-1 px-4 pb-4 text-slate-900">{children}</div>;
};

export default memo(NodeTemplate);
