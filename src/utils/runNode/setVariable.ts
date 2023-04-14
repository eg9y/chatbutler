import { CustomNode, SetVariableDataType } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

function setVariable(node: CustomNode, get: () => RFState) {
	node.data.response = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
	node.data = {
		...node.data,
		isLoading: false,
	};
	// get node from node.data.variableId
	// set node.data.text to node.data.response
	const globalVariableNode = get().getNodes([(node.data as SetVariableDataType).variableId])[0];
	globalVariableNode.data.response = node.data.response;
	get().updateNode(globalVariableNode.id, globalVariableNode.data);
}

export default setVariable;
