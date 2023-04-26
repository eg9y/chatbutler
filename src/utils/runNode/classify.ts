import {
	CustomNode,
	ClassifyNodeDataType,
	ClassifyNodeCategoriesDataType,
} from '../../nodes/types/NodeTypes';
import { ChatSequence, getOpenAIChatResponse } from '../../openai/openai';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

async function classify(node: CustomNode, get: () => RFState, openAiKey: string) {
	const classifyData = node.data as ClassifyNodeDataType;
	// get node with id data.categoryNodeId
	const categoryNode = get().nodes.find(
		(node) => node.id === classifyData.children[0],
	) as CustomNode;
	const categoryData = categoryNode.data as ClassifyNodeCategoriesDataType;
	// convert categoryData.classifications to comma separated strings of the value fields only
	const categories = categoryData.classifications
		.map((classification) => classification.value)
		.join(', ');

	const parsedText = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
	const chatSequence = [
		{
			role: 'user',
			content: `Classify the following ${classifyData.textType} into one of the following categories: ${categories}.
									\n${classifyData.textType}: ${parsedText}`,
		},
	] as ChatSequence;
	const response = await getOpenAIChatResponse(openAiKey, classifyData, chatSequence);
	const completion = response.text;
	// const completion = 'hackernews';
	if (completion) {
		node.data = {
			...node.data,
			response: completion,
			isLoading: false,
		};
	}
}

export default classify;
