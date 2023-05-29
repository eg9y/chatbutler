import { TextNodeDataType } from '@chatbutler/shared/src/index';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { conditionalClassNames } from '../utils/classNames';

const Text: FC<NodeProps<TextNodeDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showFullScreen, setShowFullScreen] = useState(false);

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
					title="Text"
					fieldName="Text"
					color="emerald"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: TextNodeDataType) => void) => (
						<>
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

export default memo(Text);
