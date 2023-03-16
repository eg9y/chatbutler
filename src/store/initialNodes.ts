import { Inputs } from '../nodes/types/Input';
import { InputNode, CustomNode, NodeTypesEnum } from '../nodes/types/NodeTypes';

const textInputNode = {
	id: 'text-input',
	position: { x: 100, y: 125 },
	type: NodeTypesEnum.textInput,
	data: {
		name: 'language',
		response: 'Bahasa Indonesia',
		inputs: new Inputs(),
	},
};

export default [
	textInputNode,
	{
		id: 'llm-prompt-1',
		position: { x: 300, y: 150 },
		type: NodeTypesEnum.llmPrompt,
		data: {
			name: `English translator`,
			prompt: `Translate this phrase from {{language}} to English:`,
			model: 'text-davinci-003',
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
			best_of: 1,
			inputs: new Inputs().addInput('text-input', [textInputNode as InputNode]),
			response: '',
		},
	},
] as CustomNode[];
