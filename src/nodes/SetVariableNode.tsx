import { memo, FC, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { CustomNode, SetVariableDataType } from './types/NodeTypes';
import useStore, { selector } from '../store/useStore';

const SetVariable: FC<NodeProps<SetVariableDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const { globalVariables, getNodes, updateNode } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);
	const [showFullScreen, setShowFullScreen] = useState(false);

	const [globalVariableNodes, setGlobalVariableNodes] = useState<CustomNode[]>([]);
	const [selectedGlobalVariable, setSelectedGlobalVariable] = useState<string>('');

	useEffect(() => {
		setGlobalVariableNodes(getNodes(globalVariables));
		if (selectedGlobalVariable === '') {
			setSelectedGlobalVariable(globalVariables[0]);
			updateNode(id, {
				...data,
				variableId: globalVariables[0],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalVariables, getNodes]);

	return (
		<div className="">
			<div
				style={{
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-slate-600' : 'border-slate-400'
				} flex flex-col `}
			>
				<NodeTemplate
					{...props}
					title="Set Variable"
					fieldName="Variable"
					bgColor="bg-slate-200"
					show={showPrompt}
					setShow={setshowPrompt}
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
				>
					{(updateNode: (id: string, data: SetVariableDataType) => void) => (
						<>
							<div className="py-1">
								<select
									id="model"
									name="fileId"
									className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-2xl sm:leading-6"
									value={selectedGlobalVariable}
									onChange={async (e) => {
										const selectedVariableId =
											e.target.selectedOptions[0].value;
										if (selectedVariableId === '') return;
										setSelectedGlobalVariable(selectedVariableId);
										updateNode(id, {
											...data,
											variableId: selectedVariableId,
										});
									}}
								>
									{globalVariableNodes?.map((variable) => (
										<option key={variable.id} value={variable.data.name || ''}>
											{variable.data.name}
										</option>
									))}
								</select>
							</div>
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
			<Handle type="source" position={Position.Right} id="text-output" className="w-4 h-4" />
		</div>
	);
};

export default memo(SetVariable);
