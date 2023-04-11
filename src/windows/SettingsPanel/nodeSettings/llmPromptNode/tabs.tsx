import { PencilIcon, GlobeAltIcon, BeakerIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Node } from 'reactflow';

import ApiTab from './tabs/ApiTab';
import PromptTab from './tabs/PromptTab';
import TestTab from './tabs/TestTab';
import { AllDataTypes, LLMPromptNodeDataType } from '../../../../nodes/types/NodeTypes';
import { handleChange } from '../../../../utils/handleFormChange';
import TabsNavigator from '../../TabsNavigator';

const tabs = [
	{ name: 'API', icon: GlobeAltIcon },
	{ name: 'Test', icon: BeakerIcon },
	{ name: 'Prompt', icon: PencilIcon },
];

export default function LLMPromptTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<LLMPromptNodeDataType>;
	updateNode: (id: string, data: AllDataTypes) => void;
}) {
	const [selected, setSelected] = useState(tabs[0].name);

	return (
		<div className="flex flex-col h-full">
			<TabsNavigator tabs={tabs} selected={selected} setSelected={setSelected} />
			<div className="overflow-y-auto grow pr-4 pl-2 pt-4">
				<div className="">
					{selected === 'Prompt' && (
						<PromptTab
							selectedNode={selectedNode}
							handleChange={(e) =>
								handleChange(e, selectedNode.id, selectedNode.data, updateNode)
							}
						/>
					)}
					{selected === 'API' && (
						<ApiTab
							selectedNode={selectedNode}
							handleChange={(e) =>
								handleChange(e, selectedNode.id, selectedNode.data, updateNode)
							}
						/>
					)}
					{selected === 'Test' && (
						<TestTab selectedNode={selectedNode} updateNode={updateNode} />
					)}
				</div>
			</div>
		</div>
	);
}
