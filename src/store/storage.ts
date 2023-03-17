import { PersistStorage } from 'zustand/middleware';
import { Inputs } from '../nodes/types/Input';
import { CustomNode } from '../nodes/types/NodeTypes';
import { RFState } from './useStore';

const storage: PersistStorage<RFState> = {
	getItem: (name) => {
		const str = localStorage.getItem(name);
		const obj = str ? JSON.parse(str) : null;

		// convert nodes.data.inputs
		const nodes: CustomNode[] = obj.state.nodes.map((node: CustomNode) => {
			if (node.type === 'textInput') {
				return node;
			}
			const inputSet = new Set(node.data.inputs.inputs);
			return {
				...node,
				data: {
					...node.data,
					inputs: new Inputs(inputSet, node.data.inputs.inputExamples),
				},
			};
		});

		return {
			state: {
				...(obj ? obj.state : {}),
				nodes,
			},
		};
	},
	setItem: (name, newValue: { state: RFState }) => {
		const str = JSON.stringify({
			state: {
				...newValue.state,
				nodes: newValue.state.nodes.map((node: CustomNode) => {
					if (node.type === 'textInput') {
						return node;
					}
					return {
						...node,
						data: {
							...node.data,
							inputs: {
								...node.data.inputs,
								inputs: [...node.data.inputs.inputs],
							},
						},
					};
				}),
			},
		});
		localStorage.setItem(name, str);
	},
	removeItem: (name) => localStorage.removeItem(name),
};

export default storage;
