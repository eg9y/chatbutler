import { NodeTypesEnum } from '@chatbutler/shared';
import { OnNodesChange, NodeChange, applyNodeChanges } from 'reactflow';

import { RFState } from './useStore';

function onNodesChange(
	get: () => RFState,
	set: (
		partial: RFState | Partial<RFState> | ((state: RFState) => RFState | Partial<RFState>),
		replace?: boolean | undefined,
	) => void,
): OnNodesChange {
	return (changes: NodeChange[]) => {
		const nodes = get().nodes;
		const selectedNode = get().selectedNode;
		const isSelectedNodeDeleted = changes.some(
			(change) => change.type === 'remove' && change.id === selectedNode?.id,
		);
		const update: any = {
			nodes: applyNodeChanges(changes, nodes),
		};
		if (isSelectedNodeDeleted) {
			update.selectedNode = null;
			if (selectedNode && selectedNode.type === NodeTypesEnum.globalVariable) {
				const globalVariables = get().globalVariables;
				// find newGlobalVariable with id of selectedNode.id and delete it
				const newGlobalVariables = globalVariables;
				delete newGlobalVariables[selectedNode.id];
				set({
					globalVariables: { ...newGlobalVariables },
				});
			}
		}
		set(update);
	};
}

export default onNodesChange;
