import { Disclosure } from '@headlessui/react';
import { ArrowsPointingOutIcon, ClipboardIcon, SignalIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { ChatMessageNodeDataType, SingleChatPromptDataType } from './types/NodeTypes';
import FullScreenEditor from '../components/FullScreenEditor';
import { conditionalClassNames } from '../utils/classNames';

const SingleChatPrompt: FC<NodeProps<SingleChatPromptDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;
	const [showFullScreen, setShowFullScreen] = useState(false);
	const [showFullResponse, setShowFullResponse] = useState(false);

	return (
		<>
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg`,
				)}
			>
				{/* how to spread  */}
				<NodeTemplate
					{...props}
					title="Single Chat"
					fieldName="Prompt"
					color="purple"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: ChatMessageNodeDataType) => void) => (
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
			<FullScreenEditor
				heading={'Response'}
				showFullScreen={showFullResponse}
				setShowFullScreen={setShowFullResponse}
			>
				<p>{data.response}</p>
			</FullScreenEditor>
			<Handle
				type="target"
				position={Position.Left}
				id="single-chat-prompt-input"
				className="h-4 w-4"
			></Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="single-chat-prompt"
				className="h-4 w-4"
			/>
		</>
	);
};

export default memo(SingleChatPrompt);
