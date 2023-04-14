import { CustomNode, LoopDataType } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

function loop(node: CustomNode, get: () => RFState) {
	const loopData = node.data as LoopDataType;
	loopData.loopCount += 1;
	const parsedText = parsePromptInputs(get, loopData.text, loopData.inputs.inputs);
	node.data = {
		...node.data,
		response: parsedText,
		loopCount: loopData.loopCount,
		isLoading: false,
	};
}

export default loop;
