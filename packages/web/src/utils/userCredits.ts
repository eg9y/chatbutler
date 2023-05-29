import {
	CustomNode,
	NodeTypesEnum,
	DefaultNodeDataType,
	OpenAIAPIRequest,
	AllDataTypes,
} from '@chatbutler/shared/src/index';

import { UserCreditsType } from '../store/useStoreSecret';

export function isNodeDoOpenAICall(node: CustomNode) {
	return (
		node.type === NodeTypesEnum.llmPrompt ||
		node.type === NodeTypesEnum.chatPrompt ||
		node.type === NodeTypesEnum.classify ||
		node.type === NodeTypesEnum.search ||
		node.type === NodeTypesEnum.singleChatPrompt
	);
}

export function calculateCreditsRequired(data: AllDataTypes, text: string) {
	let creditsRequired = Math.ceil(text.length / 4000);
	if ((data as DefaultNodeDataType & OpenAIAPIRequest).model.startsWith('gpt-4')) {
		creditsRequired = creditsRequired * 10;
	}
	return creditsRequired;
}

export function isUserCreditsEnough(node: CustomNode, text: string, userCredits: UserCreditsType) {
	// TODO: check user's message credit
	if (isNodeDoOpenAICall(node)) {
		const creditsRequired = calculateCreditsRequired(node.data, text);
		console.log('credits required', creditsRequired);
		console.log('users credits', userCredits.credits);
		if (userCredits.credits - creditsRequired < 0) {
			return false;
		}
		return true;
	}
	return true;
}
