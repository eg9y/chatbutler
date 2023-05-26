import { SetVariableDataType, CustomNode, GlobalVariableDataType } from '@chatbutler/shared';
import { memo, FC, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, Node } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const SetVariable: FC<NodeProps<SetVariableDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const { globalVariables, getNodes, updateNode } = useStore(selector, shallow);

	const [showFullScreen, setShowFullScreen] = useState(false);

	const [globalVariableNodes, setGlobalVariableNodes] = useState<CustomNode[]>([]);
	const [selectedGlobalVariable, setSelectedGlobalVariable] =
		useState<Node<GlobalVariableDataType>>();

	const listOperations = ['+ Add to end', '+ Add to start', '- Remove last', '- Remove first'];
	const [listOperation, setListOperation] = useState<
		'+ Add to end' | '+ Add to start' | '- Remove last' | '- Remove first'
	>('+ Add to end');

	useEffect(() => {
		const globalVariableIds = Object.keys(globalVariables);
		const newGlobalVariableNodes = getNodes(
			globalVariableIds,
		) as Node<GlobalVariableDataType>[];
		setGlobalVariableNodes(newGlobalVariableNodes);

		const globalVariableData = getNodes([data.variableId])[0] as Node<GlobalVariableDataType>;
		if (data.variableId && data.variableId in globalVariables) {
			setSelectedGlobalVariable(globalVariableData);
			const updateNodeObj = {
				...data,
				variableId: globalVariableData.id,
			} as SetVariableDataType;
			if (globalVariableData.data.type === 'list') {
				updateNodeObj.listOperation = listOperation;
			}
			updateNode(id, updateNodeObj);
		} else if (!selectedGlobalVariable && newGlobalVariableNodes.length > 0) {
			setSelectedGlobalVariable(newGlobalVariableNodes[0]);
			updateNode(id, {
				...data,
				variableId: globalVariableIds[0],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalVariables]);

	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg`,
				)}
			>
				<NodeTemplate
					{...props}
					title="Set Variable"
					fieldName="Variable"
					color="slate"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: SetVariableDataType) => void) => (
						<>
							<div className="py-1">
								<select
									id="model"
									name="fileId"
									className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-2xl sm:leading-6"
									value={selectedGlobalVariable?.id}
									onChange={async (e) => {
										const selectedVariableId =
											e.target.selectedOptions[0].value;
										const selectedVariable = getNodes([
											selectedVariableId,
										]) as Node<GlobalVariableDataType>[];
										if (!selectedVariable || selectedVariable.length === 0) {
											return;
										}
										setSelectedGlobalVariable(selectedVariable[0]);
										updateNode(id, {
											...data,
											variableId: selectedVariable[0].id,
										});
									}}
								>
									{Object.values(globalVariableNodes)?.map((variable) => (
										<option key={variable.id} value={variable.id || ''}>
											{variable.data.name}
										</option>
									))}
								</select>
							</div>
							{selectedGlobalVariable?.data.type === 'list' && (
								<>
									<div className="">
										<label htmlFor="tabs" className="sr-only">
											Select a tab
										</label>
										{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
										<select
											id="tabs"
											name="tabs"
											className="block w-full rounded-md border-gray-300 text-2xl focus:border-slate-500 focus:ring-slate-500"
											defaultValue={listOperations.find(
												(tab) => tab === listOperation,
											)}
											onChange={(e) => {
												setListOperation(e.target.value as any);
												updateNode(id, {
													...data,
													listOperation: e.target.value as
														| '+ Add to end'
														| '+ Add to start'
														| '- Remove last'
														| '- Remove first',
												});
											}}
										>
											{listOperations.map((operation) => (
												<option key={operation}>{operation}</option>
											))}
										</select>

										{data.listOperation === '- Remove last' && (
											<div className="text-sm text-gray-500">
												<p>Removes the last item in the list</p>
											</div>
										)}
										{data.listOperation === '+ Add to end' && (
											<div className="text-sm text-gray-500">
												<input
													type="text"
													name="text"
													className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-2xl sm:leading-6"
													value={presentText}
													onChange={(e) => {
														setText(e.target.value);
														updateNode(id, {
															...data,
															text: e.target.value,
														});
													}}
												/>
											</div>
										)}

										{data.listOperation === '+ Add to start' && (
											<div className="text-sm text-gray-500">
												<input
													type="text"
													name="text"
													className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-2xl sm:leading-6"
													value={presentText}
													onChange={(e) => {
														setText(e.target.value);
														updateNode(id, {
															...data,
															text: e.target.value,
														});
													}}
												/>
											</div>
										)}
									</div>
								</>
							)}
							{selectedGlobalVariable?.data.type === 'text' && (
								<TextAreaTemplate
									{...props}
									presentText={presentText}
									setText={setText}
								/>
							)}
							<div className="text-md flex flex-col gap-2 ">
								<InputNodesList
									data={data}
									id={id}
									setText={setText}
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
			<Handle type="source" position={Position.Right} id="text-output" className="h-4 w-4" />
		</div>
	);
};

export default memo(SetVariable);
