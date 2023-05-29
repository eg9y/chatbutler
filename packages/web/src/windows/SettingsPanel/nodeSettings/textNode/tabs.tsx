import { AllDataTypes, TextNodeDataType } from '@chatbutler/shared/src/index';
import { Node } from 'reactflow';

import TabsTemplate from '../TabsTemplate';

export default function TextTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<TextNodeDataType>;
	updateNode: (id: string, data: AllDataTypes) => void;
}) {
	return (
		<TabsTemplate selectedNode={selectedNode} updateNode={updateNode} tabs={[]}></TabsTemplate>
	);
}
