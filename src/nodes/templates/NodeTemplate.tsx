import { ArrowsPointingOutIcon } from '@heroicons/react/20/solid';
import { memo, FC } from 'react';
import { NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';

import FullScreenEditor from '../../components/FullScreenEditor';
import ShowPromptSwitch from '../../components/ShowPromptSwitch';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import { DefaultNodeDataType } from '../types/NodeTypes';

interface NodeTemplateInterface {
	title: string;
	fieldName: string;
	show: boolean;
	bgColor?: string;
	setShow: (show: boolean) => void;
	labelComponent?: (updateNode: any) => React.ReactNode;
}

const NodeTemplate: FC<
	NodeProps<DefaultNodeDataType> &
		NodeTemplateInterface & {
			showFullScreen: boolean;
			setShowFullScreen: (show: boolean) => void;
			children: (updateNode: any) => React.ReactNode;
		}
> = ({
	data,
	title,
	fieldName,
	show,
	setShow,
	bgColor = 'bg-yellow-200',
	showFullScreen,
	setShowFullScreen,
	labelComponent,
	children,
}) => {
	const { updateNode } = useStore(selector, shallow);
	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<div className={conditionalClassNames('flex flex-col h-full')}>
			<div
				className={`p-4 flex justify-between items-center border-b-1 border-slate-400 text-4xl ${bgColor}`}
			>
				<div className="flex gap-2 items-center">
					<h1 className="text-start">
						<span className="font-semibold">{title}:</span> {data.name}
					</h1>
					{data.isLoading && (
						<svg
							className="animate-spin -ml-1 mr-3 h-7 w-7 text-black"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					)}
				</div>
				{ShowPromptSwitch(show, setShow)}
			</div>
			<div className="px-4 gap-1 w-full flex justify-between items-center h-14">
				{labelComponent ? (
					labelComponent(updateNode)
				) : (
					<label htmlFor="text" className="block font-medium leading-6 text-2xl">
						{fieldName}:
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
			<div>
				{show && <Content>{children(updateNode)}</Content>}
				<FullScreenEditor
					heading={fieldName}
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
				>
					<Content>{children(updateNode)}</Content>
				</FullScreenEditor>
			</div>
		</div>
	);
};

const Content: FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<div
			style={{
				height: '35rem',
			}}
		>
			<div className="h-full flex flex-col gap-1 px-4 pb-4 text-slate-900">{children}</div>
		</div>
	);
};

export default memo(NodeTemplate);
