import { Node } from 'reactflow';

import { AllDataTypes, TextNodeDataType } from '../../../../nodes/types/NodeTypes';
import TabsTemplate from '../TabsTemplate';

export default function ChatMessageTabs({
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
