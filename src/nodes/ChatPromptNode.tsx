import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { ChatPromptNodeDataType } from './types/NodeTypes';
import RunnableToolbarTemplate from './templates/RunnableToolbarTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import InputNodesList from './templates/InputNodesList';

const ChatPrompt: FC<NodeProps<ChatPromptNodeDataType>> = (props) => {
	const { data, selected, id } = props;
	const [
		textState,
		{
			set: setText,
			// reset: resetText,
			// undo: undoText,
			// redo: redoText,
			// canUndo, canRedo
		},
	] = useUndo(data.text);
	const { present: presentText } = textState;

	const { updateNode, openAIApiKey } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);

	// TODO: Fullscreen button to edit prompts with a larger display

	return (
		<div className="">
			<div
				style={{
					height: showPrompt ? '20rem' : '5rem',
					width: '35rem',
				}}
				className={` bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-indigo-600' : 'border-slate-300'
				} flex flex-col `}
			>
				{RunnableToolbarTemplate(data, selected, updateNode, id, openAIApiKey)}
				{/* how to spread  */}

				<TextAreaTemplate
					{...props}
					title="Chat"
					fieldName="System message"
					show={showPrompt}
					setShow={setshowPrompt}
					presentText={presentText}
					setText={setText}
					bgColor="bg-indigo-300"
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
			<Handle
				type="source"
				position={Position.Right}
				id="chat-prompt-start"
				className="w-4 h-4"
			/>
		</div>
	);
};

export default memo(ChatPrompt);
