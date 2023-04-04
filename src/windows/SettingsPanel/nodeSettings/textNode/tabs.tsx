import { PencilIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Node } from 'reactflow';

import TextTab from './tabs/TextTab';
import { AllDataTypes, TextNodeDataType } from '../../../../nodes/types/NodeTypes';
import { handleChange } from '../../../../utils/handleFormChange';
import TabsNavigator from '../../TabsNavigator';

const tabs = [{ name: 'Text Input', icon: PencilIcon }];

export default function TextTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<TextNodeDataType>;
	updateNode: (id: string, data: AllDataTypes) => void;
}) {
	const [selected, setSelected] = useState(tabs[0].name);

	return (
		<div className="pr-4">
			<div className="overflow-y-auto hide-scrollbar pb-40 pt-4">
				<TabsNavigator tabs={tabs} selected={selected} setSelected={setSelected} />
				<div className="pt-2">
					{selected === 'Text Input' && (
						<TextTab
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
