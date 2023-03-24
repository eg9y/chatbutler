import { useState } from 'react';
import { Node } from 'reactflow';
import { GlobeAltIcon, PencilIcon } from '@heroicons/react/20/solid';

import TabsNavigator from '../../TabsNavigator';
import ClassifyTab from './tabs/ClassifyTab';
import { ClassifyNodeDataType } from '../../../../nodes/types/NodeTypes';
import { handleChange } from '../../../../utils/handleFormChange';
import ApiTab from './tabs/ApiTab';

const tabs = [
	{ name: 'API', icon: GlobeAltIcon },
	{ name: ' Classify', icon: PencilIcon },
];

export default function ClassifyTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<ClassifyNodeDataType>;
	updateNode: (id: string, data: any) => void;
}) {
	const [selected, setSelected] = useState(tabs[0].name);

	return (
		<div className="pr-4">
			<div className="overflow-y-auto hide-scrollbar pb-40 pt-4">
				<TabsNavigator tabs={tabs} selected={selected} setSelected={setSelected} />
				<div className="pt-2">
					{selected === 'API' && (
						<ApiTab
							selectedNode={selectedNode}
							handleChange={(e) =>
								handleChange(e, selectedNode.id, selectedNode.data, updateNode)
							}
						/>
					)}
					{selected === ' Classify' && (
						<ClassifyTab
							selectedNode={selectedNode}
							handleChange={(e) => {
								handleChange(e, selectedNode.id, selectedNode.data, updateNode);
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
