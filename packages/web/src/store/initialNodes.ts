import { CustomNode, NodeTypesEnum } from '@chatbutler/shared';

import { Inputs } from '../nodes/types/Input';

const textNode = {
	id: 'text-input',
	position: { x: 100, y: 125 },
	type: NodeTypesEnum.text,
	data: {
		name: 'language',
		text: 'Bahasa Indonesia',
		children: ['llm-prompt-1'],
		response: 'Bahasa Indonesia',
		inputs: new Inputs(),
		isLoading: false,
		isBreakpoint: false,
	},
};

export default [
	textNode,
	{
		id: 'llm-prompt-1',
		position: { x: 300, y: 150 },
		type: NodeTypesEnum.llmPrompt,
		data: {
			name: `English translator`,
			text: `Translate this phrase from {{language}} to English:`,
			model: 'text-davinci-003',
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
			best_of: 1,
			children: [],
			inputs: new Inputs(
				['text-input'],
				[
					{
						'text-input': {
							name: 'text',
							value: 'Bahasa Indonesia',
						},
					},
				],
			),
			response: '',
			stop: [],
			isLoading: false,
			isBreakpoint: false,
		},
	},
] as CustomNode[];
