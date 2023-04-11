import classifyCategories from './classifyCategories';
import conditional from './conditional';
import { CustomNode, NodeTypesEnum, LoopDataType } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';

function runConditional(
	node: CustomNode,
	get: () => RFState,
	childrenNodes: CustomNode[],
	skipped: Set<string>,
	getAllChildren: (
		node: CustomNode,
		getNodes: (inputs: string[]) => CustomNode[],
	) => CustomNode[],
) {
	if (node.type === NodeTypesEnum.classifyCategories) {
		// 1) get edges where source is node and target is one of children
		childrenNodes = classifyCategories(get, node, childrenNodes, skipped, getAllChildren);
	} else if (node.type === NodeTypesEnum.conditional) {
		childrenNodes = conditional(node, get, childrenNodes, skipped, getAllChildren);
	} else if (node.type === NodeTypesEnum.loop) {
		// if loop node, check if the loop condition is met
		const loopData = node.data as LoopDataType;

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const loopStartNodeId = get().edges.find((edge) => {
			return edge.sourceHandle === 'loop-start-output' && edge.source === node.id;
		})!.target;

		if (loopData.loopCount >= loopData.loopMax) {
			// set children nodes to be ones in the Done output edg
			const childrenNodeIds = get()
				.edges.filter((edge) => {
					return edge.sourceHandle === 'loop-finished-output' && edge.source === node.id;
				})
				.map((edge) => {
					return edge.target;
				});
			childrenNodes = get().getNodes(childrenNodeIds);

			// Set all loop children connected to Loop edge to be skipped
			const loopChildren = getAllChildren(
				get().getNodes([loopStartNodeId])[0],
				get().getNodes,
			);
			loopChildren.forEach((child) => {
				skipped.add(child.id);
			});
			skipped.add(loopStartNodeId);
			skipped.add(node.id);
		} else {
			childrenNodes = get().getNodes([loopStartNodeId]);
		}
	}

	if (node.data.loopId && node.data.children.length === 0) {
		// if last node in the loop, go back to the loop node
		childrenNodes = get().getNodes([node.data.loopId]);
	}

	return childrenNodes;
}

export default runConditional;
