import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { OutputTextDataType } from './types/NodeTypes';

const OutputText: FC<NodeProps<OutputTextDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showPrompt, setshowPrompt] = useState(true);
	const [showFullScreen, setShowFullScreen] = useState(false);

	return (
		<div className="">
			<div
				style={{
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-emerald-600' : 'border-slate-400'
				} flex flex-col bg-emerald-200`}
			>
				<NodeTemplate
					{...props}
					title="Output"
					fieldName="Output Text"
					bgColor="bg-emerald-200"
					show={showPrompt}
					setShow={setshowPrompt}
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
				>
					{(updateNode: (id: string, data: OutputTextDataType) => void) => (
						<>
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

export default memo(OutputText);
