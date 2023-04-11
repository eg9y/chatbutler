import { GlobeAltIcon, PencilIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Node } from 'reactflow';

import ApiTab from './tabs/ApiTab';
import ChatPromptTab from './tabs/ChatPromptTab';
import { AllDataTypes, ChatPromptNodeDataType } from '../../../../nodes/types/NodeTypes';
import { handleChange } from '../../../../utils/handleFormChange';
import TabsNavigator from '../../TabsNavigator';

const tabs = [
	{ name: 'API', icon: GlobeAltIcon },
	{ name: 'Chat Prompt', icon: PencilIcon },
];

export default function ChatPromptTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<ChatPromptNodeDataType>;
	updateNode: (id: string, data: AllDataTypes) => void;
}) {
	const [selected, setSelected] = useState(tabs[0].name);

	return (
		<div className="pr-4">
			<div className="overflow-y-auto hide-scrollbar">
				<TabsNavigator tabs={tabs} selected={selected} setSelected={setSelected} />
				<div className="pt-2">
					{selected === 'Chat Prompt' && (
						<ChatPromptTab
							selectedNode={selectedNode}
							handleChange={(e) => {
								handleChange(e, selectedNode.id, selectedNode.data, updateNode);
							}}
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
				</div>
			</div>
		</div>
	);
}
