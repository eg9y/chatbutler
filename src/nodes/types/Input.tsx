import { InputNode } from './NodeTypes';

type InputExample = {
	[key: string]: {
		name: string;
		value: string;
	};
};
export class Inputs {
	inputs: string[] = [];
	inputExamples: InputExample[] = [];

	constructor(inputs: string[] = [], inputExamples: InputExample[] = []) {
		this.inputs = inputs;
		this.inputExamples = [...inputExamples];
		return this;
	}

	addInput(input: string, nodes: InputNode[]) {
		this.inputs.push(input);
		const inputNode = nodes.find((node) => node.id === input);
		if (inputNode) {
			this.inputExamples = this.inputExamples.map((example) => {
				return {
					...example,
					[`${inputNode.id}`]: {
						name: inputNode.data.name,
						value: '',
					},
				};
			});
		}

		return this;
	}

	updateInput(input: string, nodes: InputNode[]) {
		const inputNode = nodes.find((node) => node.id === input);
		if (inputNode) {
			// for each input example, update the name of the key to the new name, and ignore other keys
			this.inputExamples = this.inputExamples.map((example) => {
				example[input].name = inputNode.data.name;
				return example;
			});
		}

		return this;
	}

	deleteInputs(edgesToDelete: string[]) {
		edgesToDelete.forEach((edge) => {
			this.inputs = this.inputs.filter((input) => input !== edge);
			this.inputExamples = this.inputExamples.map((example) => {
				const { [edge]: _, ...rest } = example;
				return rest;
			});
		});

		return this;
	}

	handleInputExampleChange(id: string, value: string, index: number) {
		this.inputExamples[index] = {
			...this.inputExamples[index],
			[id]: {
				...this.inputExamples[index][id],
				value,
			},
		};
	}
}
