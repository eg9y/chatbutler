import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { TextInputNodeDataType } from './types/NodeTypes';
import TextAreaTemplate from './templates/TextAreaTemplate';
import InputNodesList from './templates/InputNodesList';

const TextInput: FC<NodeProps<TextInputNodeDataType>> = (props) => {
	const { data, selected, id } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const { updateNode } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);

	return (
		<div className="">
			<div
				style={{
					height: showPrompt ? '40rem' : '5rem',
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-emerald-600' : 'border-slate-300'
				} flex flex-col `}
			>
				{/* how to spread  */}
				<TextAreaTemplate
					{...props}
					title="Text"
					fieldName="Text"
					bgColor="bg-emerald-200"
					show={showPrompt}
					setShow={setshowPrompt}
					presentText={presentText}
					setText={setText}
				>
					<div className="flex flex-col gap-2 text-md ">
						<InputNodesList
							data={data}
							id={id}
							setText={setText}
							updateNode={updateNode}
						/>
					</div>
				</TextAreaTemplate>
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

export default memo(TextInput);
