import { Edge } from 'reactflow';

import { CustomNode, ClassifyNodeCategoriesDataType } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';

function classifyCategories(
	get: () => RFState,
	node: CustomNode,
	childrenNodes: CustomNode[],
	skipped: Set<string>,
	getAllChildren: (
		node: CustomNode,
		getNodes: (inputs: string[]) => CustomNode[],
	) => CustomNode[],
) {
	const sourceTargetEdge = get()
		.edges.filter(
			(edge) =>
				edge.source === node.id &&
				childrenNodes.map((child) => child.id).includes(edge.target),
		)
		.reduce((acc: { [condition: string]: Edge[] }, edge) => {
			const conditionIndex = edge.sourceHandle?.split('::')[1] as string;
			const condition =
				conditionIndex === 'none'
					? 'none'
					: (node.data as ClassifyNodeCategoriesDataType).classifications[
							parseInt(conditionIndex)
					  ].value;
			if (!(condition in acc)) {
				acc[condition] = [edge];
			} else {
				acc[condition].push(edge);
			}
			return acc;
		}, {});

	const passingCondition = get().getNodes(node.data.inputs.inputs)[0].data.response;
	let passingChildrenNodes: CustomNode[] = [];
	if (passingCondition in sourceTargetEdge) {
		passingChildrenNodes = sourceTargetEdge[passingCondition].map(
			(edge) => get().nodes.find((node) => node.id === edge.target) as CustomNode,
		);
	} else if ('none' in sourceTargetEdge) {
		passingChildrenNodes = sourceTargetEdge.none.map(
			(edge) => get().nodes.find((node) => node.id === edge.target) as CustomNode,
		);
	}
	// Update this part to store skipped nodes and their children
	childrenNodes.forEach((child) => {
		if (!passingChildrenNodes.includes(child)) {
			skipped.add(child.id);
			const skippedChildren = getAllChildren(child, get().getNodes);
			skippedChildren.forEach((skippedChild) => {
				skipped.add(skippedChild.id);
			});
		}
	});
	childrenNodes = passingChildrenNodes;
	return childrenNodes;
}

export default classifyCategories;
