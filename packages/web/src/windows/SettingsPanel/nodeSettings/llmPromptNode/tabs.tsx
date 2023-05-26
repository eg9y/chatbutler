import { AllDataTypes, LLMPromptNodeDataType } from '@chatbutler/shared';
import { GlobeAltIcon, BeakerIcon } from '@heroicons/react/20/solid';
import { Node } from 'reactflow';

import ApiTab from './tabs/ApiTab';
import TestTab from './tabs/TestTab';
import { handleChange } from '../../../../utils/handleFormChange';
import TabsTemplate from '../TabsTemplate';

const tabs = [
	{ name: 'API', icon: GlobeAltIcon },
	{ name: 'Test', icon: BeakerIcon },
];

export default function LLMPromptTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<LLMPromptNodeDataType>;
	updateNode: (id: string, data: AllDataTypes) => void;
}) {
	return (
		<TabsTemplate
			selectedNode={selectedNode}
			updateNode={updateNode}
			tabs={tabs}
			defaultTab="API"
		>
			{(selected) => (
				<>
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
				</>
			)}
		</TabsTemplate>
	);
}
