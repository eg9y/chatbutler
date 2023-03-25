import { PersistStorage } from 'zustand/middleware';

import { RFState } from './useStore';
import { Inputs } from '../nodes/types/Input';
import { CustomNode } from '../nodes/types/NodeTypes';

const storage: PersistStorage<RFState> = {
	getItem: (name) => {
		const str = localStorage.getItem(name);
		const stateObj = str ? JSON.parse(str) : null;
		let nodes: CustomNode[] = [];
		if (stateObj) {
			nodes = stateObj.state.nodes.map((node: CustomNode) => {
				if ('inputs' in node.data) {
					return {
						...node,
						data: {
							...node.data,
							inputs: new Inputs(
								node.data.inputs.inputs,
								node.data.inputs.inputExamples,
							),
						},
					};
				}
				return {
					...node,
				};
			});
		}

		return {
			state: {
				...(stateObj ? stateObj.state : {}),
				nodes,
			},
		};
	},
	setItem: (name, newValue: { state: RFState }) => {
		const str = JSON.stringify({
			state: {
				...newValue.state,
			},
		});
		localStorage.setItem(name, str);
	},
	removeItem: (name) => localStorage.removeItem(name),
};

export default storage;
