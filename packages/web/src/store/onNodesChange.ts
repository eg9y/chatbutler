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
		}
		set(update);
	};
}

export default onNodesChange;
