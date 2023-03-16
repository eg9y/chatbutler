import { InputNode } from './NodeTypes';

type InputExample = {
	[key: string]: {
		name: string;
		value: string;
	};
};
export class Inputs {
	inputs: Set<string>;
	inputNodes: InputNode[];
	inputExamples: InputExample[];

	constructor(
		inputs: Set<string> = new Set([]),
		inputNodes: InputNode[] = [],
		inputExamples: InputExample[] = [{}],
	) {
		this.inputs = inputs;
		this.inputExamples = [...inputExamples];
		this.inputNodes = inputNodes;
	}

	addInput(input: string, nodes: InputNode[]) {
		this.inputs.add(input);
		const inputNode = nodes.find((node) => node.id === input);
		if (inputNode) {
			this.inputNodes.push(inputNode);
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
			this.inputNodes = this.inputNodes.map((node) => {
				if (node.id === input) {
					return inputNode;
				}
				return node;
			});

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
			this.inputs.delete(edge);
			this.inputNodes = this.inputNodes.filter((node) => node.id !== edge);
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
