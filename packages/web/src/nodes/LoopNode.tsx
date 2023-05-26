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
	const { setNotificationMessage } = useStore(selector, shallow);

	const [showFullScreen, setShowFullScreen] = useState(false);
	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[50rem] w-[35rem]',
					`m-3 shadow-lg`,
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
									className="nodrag block h-16 w-1/2 rounded-md border-0 text-slate-900 shadow-sm ring-2 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
									value={data.loopMax}
									onChange={(e) => {
										if (isNaN(parseInt(e.target.value))) {
											setNotificationMessage('loopMax must be a number');
											return;
										}
										updateNode(id, {
											...data,
											loopMax: parseInt(e.target.value),
										});
									}}
								/>
							</div>
							<div className="text-md flex grow flex-col gap-2">
								<p className="text-2xl">Input:</p>
								<TextAreaTemplate
									{...props}
									presentText={presentText}
									setText={setText}
								/>
								<div className="text-md flex flex-col gap-2 ">
									<InputNodesList
										data={data}
										id={id}
										setText={setText}
										updateNode={updateNode}
										type={type}
									/>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<p className="text-5xl">{data.loopCount > 0 && data.loopCount}</p>
								<ArrowPathIcon
									className={conditionalClassNames(
										data.loopCount > 0 &&
											data.loopCount < data.loopMax &&
											'animate-[spin_3s_linear_infinite]',
										'h-20 w-20 text-slate-700',
									)}
								/>
							</div>
						</>
					)}
				</NodeTemplate>
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
				id="loop-finished-output"
				style={{
					right: '-2.6rem',
					top: '33.333333%',
					backgroundColor: 'rgb(209 250 229)',
				}}
				className="flex h-10 gap-1 border-1 border-slate-700"
			>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-2xl font-bold">
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
				className="flex h-10 gap-1 border-1 border-slate-700"
			>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-2xl font-bold">
					Loop
				</p>
			</Handle>
		</div>
	);
};

export default memo(Loop);
