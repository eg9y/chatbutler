import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import { ConditionalBooleanOperation, ConditionalDataType } from './types/NodeTypes';

const Conditional: FC<NodeProps<ConditionalDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setValue }] = useUndo(data.text);
	const { present: value } = textState;

	const [valueToCompareState, { set: setValueToCompare }] = useUndo(data.valueToCompare);
	const { present: valueToCompare } = valueToCompareState;

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
					title="Conditional"
					fieldName="Value"
					bgColor="bg-emerald-200"
					show={showPrompt}
					setShow={setshowPrompt}
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
				>
					{(updateNode: (id: string, data: ConditionalDataType) => void) => (
						<>
							<div className="py-1">
								<input
									type="text"
									name="value"
									className="nodrag block h-16 w-1/2 rounded-md border-0 text-slate-900 shadow-sm ring-inset ring-slate-300 placeholder:text-slate-400 ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
									value={value}
									onChange={(e) => {
										setValue(e.target.value);
										updateNode(id, {
											...data,
											value: e.target.value,
										});
									}}
								/>
							</div>
							<div className="flex flex-col gap-2 text-md ">
								<InputNodesList
									data={data}
									id={id}
									dataFieldName="value"
									setText={setValue}
									updateNode={updateNode}
									type={type}
								/>
							</div>
							<div className="py-10">
								<label htmlFor="textType">Condition:</label>
								<select
									id="model"
									name="fileId"
									className="block w-1/2 rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-2xl sm:leading-6"
									value={data.booleanOperation}
									onChange={async (e) => {
										console.log('placeholder');
										updateNode(id, {
											...data,
											booleanOperation: e.target
												.value as ConditionalBooleanOperation,
										});
									}}
								>
									{Object.values(ConditionalBooleanOperation)?.map(
										(condition) => (
											<option key={condition} value={condition}>
												{condition}
											</option>
										),
									)}
								</select>
							</div>
							<div className="py-1">
								<input
									type="text"
									name="valueToCompare"
									className="nodrag block h-16 w-1/2 rounded-md border-0 text-slate-900 shadow-sm ring-inset ring-slate-300 placeholder:text-slate-400 ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
									value={valueToCompare}
									onChange={(e) => {
										setValueToCompare(e.target.value);
										updateNode(id, {
											...data,
											valueToCompare: e.target.value,
										});
									}}
								/>
							</div>
							<div className="flex flex-col gap-2 text-md ">
								<InputNodesList
									data={data}
									id={id}
									dataFieldName="valueToCompare"
									setText={setValueToCompare}
									updateNode={updateNode}
									type={type}
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
				className="w-4 h-4"
			></Handle>

			<Handle
				type="source"
				position={Position.Right}
				id="conditional-true-output"
				style={{
					right: '-2.5rem',
				}}
				className="top-1/3 h-10 flex gap-1 border-1 border-slate-700 bg-emerald-500"
			>
				<p className="bg-transparent  border-slate-700 text-xl font-bold self-center -z-10 pointer-events-none p-1">
					<CheckIcon className={'text-slate-50 h-full w-10'} aria-hidden="true" />
				</p>
			</Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="conditional-false-output"
				style={{
					right: '-2.5rem',
				}}
				className="top-2/3 h-10 flex gap-1 border-1 border-slate-700 bg-red-500"
			>
				<p className="bg-transparent  border-slate-700 text-xl font-bold self-center -z-10 pointer-events-none p-1">
					<XMarkIcon className={'text-slate-50 h-full w-10'} aria-hidden="true" />
				</p>
			</Handle>
		</div>
	);
};

export default memo(Conditional);
