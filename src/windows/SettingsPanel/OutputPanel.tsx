import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { CustomNode } from '../../nodes/types/NodeTypes';
import { parsePromptInputs } from '../../openAI/openAI';
import { classNames } from '../../utils/classNames';

export default function OutputPanel({ selectedNode }: { selectedNode: CustomNode | null }) {
	const [showPromptInOutput, setShowPromptInOutput] = useState(false);
	return (
		<>
			<div className="p-3 flex flex-col justify-between h-full">
				<div className="text-xs flex-grow min-h-0 whitespace-pre-wrap">
					{showPromptInOutput &&
						selectedNode?.data?.prompt &&
						parsePromptInputs(
							selectedNode?.data?.prompt,
							selectedNode?.data?.inputs.inputNodes,
						)}
					<span className="bg-emerald-300">{selectedNode?.data.response}</span>
				</div>
				<Switch.Group as="div" className="flex items-center">
					<Switch
						checked={showPromptInOutput}
						onChange={setShowPromptInOutput}
						className={classNames(
							showPromptInOutput ? 'bg-green-600' : 'bg-gray-200',
							'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ',
						)}
					>
						<span
							aria-hidden="true"
							className={classNames(
								showPromptInOutput ? 'translate-x-5' : 'translate-x-0',
								'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
							)}
						/>
					</Switch>
					<Switch.Label as="span" className="ml-3 text-xs font-medium text-gray-900">
						show prompt
					</Switch.Label>
				</Switch.Group>
			</div>
		</>
	);
}
