import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { LoopDataType } from './types/NodeTypes';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const Loop: FC<NodeProps<LoopDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;
	const { setUiErrorMessage } = useStore(selector, shallow);

	const [showFullScreen, setShowFullScreen] = useState(false);
	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 bg-slate-100 shadow-lg`,
				)}
			>
				{/* how to spread  */}
				<NodeTemplate
					{...props}
					title="Loop"
					fieldName="Loop times"
					color="emerald"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: LoopDataType) => void) => (
						<>
							<div className="py-1">
								<input
									type="number"
									name="loopMax"
									className="nodrag block h-16 w-1/2 rounded-md border-0 text-slate-900 shadow-sm ring-inset ring-slate-300 placeholder:text-slate-400 ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
									value={data.loopMax}
									onChange={(e) => {
										if (isNaN(parseInt(e.target.value))) {
											setUiErrorMessage('loopMax must be a number');
											return;
										}
										updateNode(id, {
											...data,
											loopMax: parseInt(e.target.value),
										});
									}}
								/>
							</div>
							<div className="flex flex-col gap-2 text-md">
								<p className="text-2xl">Input:</p>
								<TextAreaTemplate
									{...props}
									presentText={presentText}
									setText={setText}
								/>
								<div className="flex flex-col gap-2 text-md ">
									<InputNodesList
										data={data}
										id={id}
										setText={setText}
										updateNode={updateNode}
										type={type}
									/>
								</div>
							</div>
							<div className="grow flex items-center">
								<ArrowPathIcon className="h-20 w-20 mx-auto text-slate-700" />
							</div>
						</>
					)}
				</NodeTemplate>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="text-input"
				className="w-4 h-4"
			></Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="loop-finished-output"
				style={{
					right: '-2.6rem',
					top: '33.333333%',
					backgroundColor: 'rgb(209 250 229)',
				}}
				className="h-10 flex gap-1 border-1 border-slate-700"
			>
				<p className="bg-transparent  border-slate-700 text-2xl font-bold self-center -z-10 pointer-events-none p-1">
					Done
				</p>
			</Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="loop-start-output"
				style={{
					right: '-2.5rem',
					top: '66.666667%',
					backgroundColor: 'rgb(209 250 229)',
				}}
				className="h-10 flex gap-1 border-1 border-slate-700"
			>
				<p className="bg-transparent  border-slate-700 text-2xl font-bold self-center -z-10 pointer-events-none p-1">
					Loop
				</p>
			</Handle>
		</div>
	);
};

export default memo(Loop);
