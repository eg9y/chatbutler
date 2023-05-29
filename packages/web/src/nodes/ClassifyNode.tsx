import { ClassifyNodeDataType, NodeTypesEnum } from '@chatbutler/shared/src/index';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import RunnableToolbarTemplate from './templates/RunnableToolbarTemplate';
import useStore, { RFState, selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';
import { handleChange } from '../utils/handleFormChange';

const Classify: FC<NodeProps<ClassifyNodeDataType>> = (props) => {
	const { data, selected, id } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;
	const [textType, { set: setTextType }] = useUndo(data.textType);
	const { present: presentTextType } = textType;

	const { updateNode } = useStore(selector, shallow);

	const [showFullScreen, setShowFullScreen] = useState(false);

	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<>
			<div className={conditionalClassNames(`m-3 shadow-lg`)}>
				{RunnableToolbarTemplate(data, selected, updateNode, id)}
				{/* how to spread  */}
				<div className="">
					<NodeTemplate
						{...props}
						title="Classification"
						fieldName="Text to classify"
						color="rose"
						showFullScreen={showFullScreen}
						setShowFullScreen={setShowFullScreen}
						selected={selected}
					>
						{() => (
							<>
								<Content
									setText={setText}
									presentText={presentText}
									presentTextType={presentTextType}
									setTextType={setTextType}
									data={data}
									id={id}
									updateNode={updateNode}
								/>
							</>
						)}
					</NodeTemplate>
				</div>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="text-input"
				className="h-4 w-4"
			></Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="classify"
				className="bg-transparent"
			/>
		</>
	);
};

const Content: FC<{
	presentText: string;
	setText: (newPresent: string, checkpoint?: boolean | undefined) => void;
	data: ClassifyNodeDataType;
	id: string;
	updateNode: RFState['updateNode'];
	presentTextType: string;
	setTextType: (newPresent: string, checkpoint?: boolean | undefined) => void;
}> = ({ presentText, setText, data, id, updateNode, presentTextType, setTextType }) => {
	return (
		<div className={conditionalClassNames(data.isDetailMode && 'h-[40rem] w-[35rem]')}>
			{/* list of data.inputs string Set */}
			<div className="flex h-full flex-col gap-1 text-slate-900">
				<textarea
					rows={4}
					name="text"
					id={`text-${id}`}
					className="nowheel nodrag w-full grow rounded-md border-0 text-xl shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-1 focus:ring-inset focus:ring-slate-400 sm:leading-6"
					value={presentText}
					onFocus={(e) => {
						e.target.selectionStart = 0;
						e.target.selectionEnd = 0;
					}}
					onChange={(e) => {
						setText(e.target.value);
						handleChange(e, id, data, updateNode);
					}}
				/>
				<div className="text-md flex grow-0 flex-col gap-2 ">
					<InputNodesList
						data={data}
						id={id}
						setText={setText}
						updateNode={updateNode}
						type={NodeTypesEnum.classify}
					/>
				</div>
				<div className="py-1">
					<div className="flex h-14 items-center">
						<label
							htmlFor="textType"
							className="block grow text-2xl font-medium leading-6"
						>
							Text Type:
						</label>
					</div>
					<input
						type="text"
						name="textType"
						className="nodrag block h-16 w-full rounded-md border-0 text-slate-900 shadow-sm ring-2 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
						value={presentTextType}
						onChange={(e) => {
							setTextType(e.target.value);
							updateNode(id, {
								...data,
								textType: e.target.value,
							});
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(Classify);
