import { nanoid } from 'nanoid';
import { Node } from 'reactflow';

import {
	CustomNode,
	GlobalVariableDataType,
	SetVariableDataType,
} from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

function setVariable(node: CustomNode, get: () => RFState) {
	node.data.response = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
	node.data = {
		...node.data,
		isLoading: false,
	};

	// get node from node.data.variableId
	const globalVariableNode = get().getNodes([
		(node.data as SetVariableDataType).variableId,
	])[0] as Node<GlobalVariableDataType>;

	if (globalVariableNode.data.type === 'text') {
		globalVariableNode.data.value = node.data.response;
		get().updateNode(globalVariableNode.id, globalVariableNode.data);
	} else if (globalVariableNode.data.type === 'list') {
		const globalVariableValue = globalVariableNode.data.value as {
			id: string;
			value: string;
		}[];

		const operation = (node.data as SetVariableDataType).listOperation || '+ Add to end';
		switch (operation) {
			case '+ Add to end':
				globalVariableValue.push({
					id: nanoid(),
					value: node.data.response,
				});
				break;
			case '- Remove last':
				globalVariableValue.pop();
				break;
			case '+ Add to start':
				globalVariableValue.unshift({
					id: nanoid(),
					value: node.data.response,
				});
				break;
			case '- Remove first':
				globalVariableValue.shift();
				break;
			default:
				break;
		}
		get().updateNode(globalVariableNode.id, {
			...globalVariableNode.data,
			value: [...globalVariableValue],
		});
	}
}

export default setVariable;
