import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import { ConditionalBooleanOperation, ConditionalDataType } from './types/NodeTypes';
import { conditionalClassNames } from '../utils/classNames';

const Conditional: FC<NodeProps<ConditionalDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setValue }] = useUndo(data.value);
	const { present: value } = textState;

	const [valueToCompareState, { set: setValueToCompare }] = useUndo(data.valueToCompare);
	const { present: valueToCompare } = valueToCompareState;

	const [showFullScreen, setShowFullScreen] = useState(false);
	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg`,
				)}
			>
				{/* how to spread  */}
				<NodeTemplate
					{...props}
					title="Conditional"
					fieldName="Value"
					color="emerald"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: ConditionalDataType) => void) => (
						<>
							<div className="py-1">
								<input
									type="text"
									name="value"
									className="nodrag block h-16 w-1/2 rounded-md border-0 text-slate-900 shadow-sm ring-2 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
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
							<div className="text-md flex flex-col gap-2 ">
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
									className="nodrag block h-16 w-1/2 rounded-md border-0 text-slate-900 shadow-sm ring-2 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
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
							<div className="text-md flex flex-col gap-2 ">
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
				className="h-4 w-4"
			></Handle>

			<Handle
				type="source"
				position={Position.Right}
				id="conditional-true-output"
				style={{
					right: '-2.5rem',
					top: '33.333333%',
					backgroundColor: 'rgb(16 185 129)',
				}}
				className="flex h-10 gap-1 border-1 border-slate-700"
			>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-xl font-bold">
					<CheckIcon className={'h-full w-10 text-slate-50'} aria-hidden="true" />
				</p>
			</Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="conditional-false-output"
				style={{
					right: '-2.5rem',
					top: '66.666667%',
					backgroundColor: 'rgb(239 68 68)',
				}}
				className="flex h-10 gap-1 border-1 border-slate-700"
			>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-xl font-bold">
					<XMarkIcon className={'h-full w-10 text-slate-50'} aria-hidden="true" />
				</p>
			</Handle>
		</div>
	);
};

export default memo(Conditional);
