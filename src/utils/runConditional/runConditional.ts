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
	visited: Set<string>,
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

			// Set all loop children that's part of the looping logic to be skipped
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
		// eslint-disable-next-line no-inner-declarations
		// if last node in the loop, go back to the loop node

		// recursively assigning the parentNode and loopId for nodes in a loop
		// eslint-disable-next-line no-inner-declarations
		function resetLoopChildren(nodes: CustomNode[], loopNodeIndex: number) {
			visited.delete(nodes[loopNodeIndex].id);
			// Iterate through target node's children and call assignLoopChildren recursively
			nodes[loopNodeIndex].data.children.forEach((childId) => {
				const childIndex = nodes.findIndex((node) => node.id === childId);
				if (childIndex !== -1) {
					resetLoopChildren(nodes, childIndex);
				}
			});
			return nodes;
		}
		const nodes = get().nodes;
		// get loop node index
		const loopNodeIndex = nodes.findIndex((currNode) => currNode.id === node.data.loopId);
		childrenNodes = get().getNodes([node.data.loopId]);
		// reset loop children
		resetLoopChildren(nodes, loopNodeIndex);
	}

	return childrenNodes;
}

export default runConditional;
