import { PencilIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Node } from 'reactflow';

import SearchTab from './tabs/SearchTab';
import { AllDataTypes, SearchDataType } from '../../../../nodes/types/NodeTypes';
import { handleChange } from '../../../../utils/handleFormChange';
import TabsNavigator from '../../TabsNavigator';

const tabs = [{ name: 'Search', icon: PencilIcon }];

export default function SearchTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<SearchDataType>;
	updateNode: (id: string, data: AllDataTypes) => void;
}) {
	const [selected, setSelected] = useState(tabs[0].name);

	return (
		<div className="pr-4">
			<div className="hide-scrollbar overflow-y-auto pb-40 pt-4">
				<TabsNavigator tabs={tabs} selected={selected} setSelected={setSelected} />
				<div className="pt-2">
					{selected === 'Search' && (
						<SearchTab
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
