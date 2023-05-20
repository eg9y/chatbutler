import { CustomNode, LoopDataType } from '../../nodes/types/NodeTypes';
import { parsePromptInputsNoState } from '../parsePromptInputs';

function loop(nodes: CustomNode[], node: CustomNode) {
	const loopData = node.data as LoopDataType;
	loopData.loopCount += 1;
	const parsedText = parsePromptInputsNoState(nodes, loopData.inputs.inputs, loopData.text);
	node.data = {
		...node.data,
		response: parsedText,
		loopCount: loopData.loopCount,
	};
}

export default loop;
