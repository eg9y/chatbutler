import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../store/useStore';

const EditableText = ({
	text,
	setText,
	setWorkflows,
}: {
	text: string;
	setText: (text: string) => void;

	setWorkflows: (workflows: { id: string; name: string }[]) => void;
}) => {
	const { workflows, setWorkflowName } = useStore(selector, shallow);
	const [isEditing, setIsEditing] = useState(false);

	const handleTextClick = () => {
		if (!isEditing) {
			setIsEditing(true);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	};

	const handleInputBlur = () => {
		setIsEditing(false);
		// update workflows to edit the name field
		const newWorkflows = workflows.map((workflow) => {
			if (workflow.id === text) {
				return {
					...workflow,
					name: text,
				};
			}
			return workflow;
		});
		setWorkflows(newWorkflows);
		setWorkflowName(text);
	};

	const inputStyle =
		'border-none outline-none focus:ring-0 focus:border-none text-gray-800 w-full';

	return (
		<div className="text-lg bg-slate-50 flex items-center">
			{!isEditing && (
				<p
					onClick={handleTextClick}
					style={{
						wordWrap: 'break-word',
						whiteSpace: 'normal',
						maxWidth: '100%',
					}}
					className={`font-medium text-gray-800 cursor-pointer`}
				>
					{text}
				</p>
			)}
			{isEditing && (
				<input
					autoFocus
					value={text}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleInputBlur();
						}
					}}
					className={`${inputStyle}`}
					maxLength={30}
					minLength={5}
				/>
			)}
		</div>
	);
};

export default EditableText;
