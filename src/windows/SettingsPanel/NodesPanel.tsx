import { Switch } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { CustomNode } from '../../nodes/types/NodeTypes';
import { parsePromptInputs } from '../../openai/openai';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';

export default function NodesPanel({ selectedNode }: { selectedNode: CustomNode | null }) {
	const [showPromptInOutput, setShowPromptInOutput] = useState(false);
	const { getInputNodes } = useStore(selector, shallow);

	return (
		<div className="p-3 flex flex-col justify-between h-full w-full">
			{/* TODO: Clear graph logic */}
			<button
				className="p-3 bg-red-500 hover:bg-red-600 text-white text-md font-semibold 
					w-1/2
				py-1 pr-2  rounded flex items-center "
			>
				<TrashIcon
					className={' group-hover:text-gray-500  mx-auto h-5 w-5'}
					aria-hidden="true"
				/>
				<span>Clear graph</span>
			</button>
		</div>
	);
}
