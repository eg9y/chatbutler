import { SearchDataType, AllDataTypes } from '@chatbutler/shared/src/types/NodeTypes';
import { GlobeAltIcon } from '@heroicons/react/20/solid';
import { Node } from 'reactflow';

import ApiTab from '../../../../components/ApiTab';
import { handleChange } from '../../../../utils/handleFormChange';
import TabsTemplate from '../TabsTemplate';

const tabs = [{ name: 'API', icon: GlobeAltIcon }];

export default function SearchTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<SearchDataType>;
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
				</>
			)}
		</TabsTemplate>
	);
}
