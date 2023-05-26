import { CustomNode } from '@chatbutler/shared';

// Helper function to collect all children of the skipped nodes that has no other parents to lead to them
export function getAllChildren(
	node: CustomNode,
	getNodes: (inputs: string[]) => CustomNode[],
): CustomNode[] {
	const children = getNodes(node.data.children);
	if (children.length === 0) {
		return [];
	}
	return children.reduce((acc: CustomNode[], child: CustomNode) => {
		return acc.concat(child, getAllChildren(child, getNodes));
	}, []);
}
