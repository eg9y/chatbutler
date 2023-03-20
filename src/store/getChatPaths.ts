import { Node } from 'reactflow';
import { ChatMessageNodeDataType, ChatPromptNodeDataType } from '../nodes/types/NodeTypes';
import { RFState } from './useStore';

const getChatPaths = (
	get: () => RFState,
	root: Node<ChatMessageNodeDataType | ChatPromptNodeDataType>,
): string[][] => {
	const paths: string[][] = [];

	function buildPaths(
		node: Node<ChatMessageNodeDataType | ChatPromptNodeDataType>,
		currentPath: string[],
	): void {
		currentPath.push(node.id);

		if (
			node.type === 'chatPrompt' ||
			(node as Node<ChatMessageNodeDataType>).data.childrenChat.length === 0
		) {
			paths.push(currentPath);
			return;
		}

		for (const childId of (node as Node<ChatMessageNodeDataType>).data.childrenChat) {
			// get nodes with id childId
			const child = get().nodes.find((node) => node.id === childId) as Node<
				ChatMessageNodeDataType | ChatPromptNodeDataType
			>;

			if (!child) {
				console.error(`Child with ID ${childId} not found`);
				continue;
			}

			// Make a copy of the current path to avoid modifying the original path during recursion.
			const newPath = [...currentPath];
			buildPaths(child, newPath);
		}
	}

	buildPaths(root, []);
	return paths;
};

export default getChatPaths;
