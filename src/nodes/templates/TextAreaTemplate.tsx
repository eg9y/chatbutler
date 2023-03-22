import { memo, FC } from 'react';
import { NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../../store/useStore';
import { handleChange } from '../../utils/handleFormChange';
import { DefaultNodeDataType } from '../types/NodeTypes';
import ShowPromptSwitch from '../../components/ShowPromptSwitch';

interface TextAreaTemplateInterface {
	title: string;
	fieldName: string;
	show: boolean;
	bgColor?: string;
	setShow: (show: boolean) => void;
}

const TextAreaTemplate: FC<
	NodeProps<DefaultNodeDataType> &
		TextAreaTemplateInterface & {
			children: React.ReactNode;
			presentText: string;
			setText: (text: string) => void;
		}
> = ({
	data,
	id,
	title,
	fieldName,
	show,
	setShow,
	children,
	presentText,
	setText,
	bgColor = 'bg-yellow-200',
}) => {
	const { updateNode } = useStore(selector, shallow);
	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<>
			<div
				className={`py-1 flex justify-between items-center pr-4 border-b-1 border-slate-400 text-xl ${bgColor}`}
			>
				<div className="flex gap-2 items-center py-2">
					<h1 className="text-start pl-4">
						<span className="font-semibold">{title}:</span> {data.name}
					</h1>
					{data.isLoading && (
						<svg
							className="animate-spin -ml-1 mr-3 h-7 w-7 text-black"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					)}
				</div>
				{ShowPromptSwitch(show, setShow)}
			</div>
			{show && (
				<div className="h-full text-xl ">
					{/* list of data.inputs string Set */}
					<div className="h-full flex flex-col gap-1 p-4 text-slate-900">
						<label htmlFor="text" className="block font-medium leading-6 ">
							{fieldName}:
						</label>
						<textarea
							rows={4}
							name="text"
							id={`text-${id}`}
							className="nowheel nodrag text-xl flex-grow w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-1 focus:ring-inset focus:ring-slate-400 sm:leading-6"
							value={presentText}
							onFocus={(e) => {
								e.target.selectionStart = 0;
								e.target.selectionEnd = 0;
							}}
							onChange={(e) => {
								setText(e.target.value);
								handleChange(e, id, data, updateNode);
							}}
						/>
						{children}
					</div>
				</div>
			)}
		</>
	);
};

export default memo(TextAreaTemplate);
