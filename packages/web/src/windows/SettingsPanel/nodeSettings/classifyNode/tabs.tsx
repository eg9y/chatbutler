import { ClassifyNodeDataType } from '@chatbutler/shared';
import { GlobeAltIcon } from '@heroicons/react/20/solid';
import { Node } from 'reactflow';

import ApiTab from './tabs/ApiTab';
import { handleChange } from '../../../../utils/handleFormChange';
import TabsTemplate from '../TabsTemplate';

const tabs = [{ name: 'API', icon: GlobeAltIcon }];

export default function ClassifyTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<ClassifyNodeDataType>;
	updateNode: (id: string, data: any) => void;
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
