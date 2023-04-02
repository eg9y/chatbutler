import { memo, FC } from 'react';
import { NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../../store/useStore';
import { handleChange } from '../../utils/handleFormChange';
import { DefaultNodeDataType } from '../types/NodeTypes';

const TextAreaTemplate: FC<
	NodeProps<DefaultNodeDataType> & {
		presentText: string;
		setText: (text: string) => void;
	}
> = ({ data, id, presentText, setText }) => {
	const { updateNode } = useStore(selector, shallow);
	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<textarea
			rows={4}
			name="text"
			id={`text-${id}`}
			className="nowheel nodrag text-2xl flex-grow w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-1 focus:ring-inset focus:ring-slate-400 sm:leading-10"
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
	);
};

export default memo(TextAreaTemplate);
