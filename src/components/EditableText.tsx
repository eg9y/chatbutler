import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../store/useStore';

const EditableText = ({
	text,
	currentWorkflow,
	setCurrentWorkflow,
	setWorkflows,
}: {
	text: string;
	currentWorkflow: {
		id: string;
		name: string;
	} | null;
	setCurrentWorkflow: (id: string | null, name: string | null) => void;
	setWorkflows: (workflows: { id: string; name: string }[]) => void;
}) => {
	const { workflows } = useStore(selector, shallow);
	const [isEditing, setIsEditing] = useState(false);

	const handleTextClick = () => {
		if (!isEditing) {
			setIsEditing(true);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentWorkflow(null, e.target.value);
	};

	const handleSubmit = () => {
		setIsEditing(false);
		// update workflows to edit the name field
		const newWorkflows = workflows.map((workflow) => {
			if (workflow.id === currentWorkflow?.id) {
				return {
					...workflow,
					name: text,
				};
			}
			return workflow;
		});
		setWorkflows(newWorkflows);
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
					onBlur={handleSubmit}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSubmit();
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
