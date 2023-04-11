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

const Loop: FC<NodeProps<LoopDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;
	const { setUiErrorMessage } = useStore(selector, shallow);

	const [showPrompt, setshowPrompt] = useState(true);
	const [showFullScreen, setShowFullScreen] = useState(false);
	return (
		<div className="">
			<div
				style={{
					height: showPrompt ? '40rem' : '5rem',
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-emerald-600' : 'border-slate-300'
				} flex flex-col text-xl`}
			>
				{/* how to spread  */}
				<NodeTemplate
					{...props}
					title="Loop"
					fieldName="Loop times"
					bgColor="bg-emerald-200"
					show={showPrompt}
					setShow={setshowPrompt}
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
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
				}}
				className="top-1/3 h-10 flex gap-1 border-1 border-slate-700 bg-emerald-100"
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
				}}
				className="top-2/3 h-10 flex gap-1 border-1 border-slate-700 bg-emerald-100"
			>
				<p className="bg-transparent  border-slate-700 text-2xl font-bold self-center -z-10 pointer-events-none p-1">
					Loop
				</p>
			</Handle>
		</div>
	);
};

export default memo(Loop);
