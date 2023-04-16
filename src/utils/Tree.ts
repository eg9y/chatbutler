import { getAllChildren } from './getChildren';
import runConditional from './runConditional/runConditional';
import { runNode } from './runNode/runNode';
import { CustomNode, LoopDataType, NodeTypesEnum } from '../nodes/types/NodeTypes';
import { RFState } from '../store/useStore';

export async function traverseTree(
	get: () => RFState,
	set: (state: Partial<RFState>) => void,
	openAiKey: string,
): Promise<void> {
	const visited = new Set<string>();
	const skipped = new Set<string>();
	const nodesLengthToVisit = get().nodes.filter(
		(node) => node.type !== NodeTypesEnum.globalVariable,
	).length;

	set({
		unlockGraph: false,
	});

	function allParentsVisited(node: CustomNode): boolean {
		const inputNodes = get().getNodes(node.data.inputs.inputs);
		return inputNodes.every((parent) => {
			return (
				visited.has(parent.id) || parent.data.loopId || parent.type === NodeTypesEnum.loop
			);
		});
	}

	async function dfs(node: CustomNode): Promise<boolean> {
		const test = !allParentsVisited(node);
		if (visited.has(node.id) || test || skipped.has(node.id)) return false;

		// TODO: if node.data.loopId, don't run visited.add(node.id)

		if (!node.data.loopId && node.type !== NodeTypesEnum.loop) {
			visited.add(node.id);
		}

		let childrenNodes = get().getNodes(node.data.children);

		try {
			if (node.type === NodeTypesEnum.loop && (node.data as LoopDataType).loopCount > 0) {
				const check = await new Promise<boolean>((resolve) => {
					const chatApp = get().chatApp;
					get().setChatApp([
						...chatApp,
						{
							role: 'assistant',
							content: 'Continue loop? (y/N)',
						},
					]);
					get().setWaitingUserResponse(true);
					get().setPauseResolver((message) => {
						node.data.response = message;
						if (message === 'y') {
							return resolve(true);
						}
						return resolve(false);
					});
				});
				if (!check) {
					// TODO: Break out of loop, but continue running the rest of the tree
					return true;
				}
			}
			await runNode(node, get, set, openAiKey);
			childrenNodes = runConditional(node, get, childrenNodes, skipped, getAllChildren);
		} catch (error: any) {
			throw new Error('Error running node', error.message);
		}

		if (node.data.isBreakpoint) {
			// TODO: breakpoint notification and step through
			return true;
		}

		for (const child of childrenNodes) {
			const isBreak = await dfs(child);
			if (isBreak) {
				return true;
			}
		}

		return false;
	}

	// Find root nodes
	const rootNodes = getRootNodes(get, get().nodes);
	// Update the while loop condition
	while (visited.size + skipped.size < nodesLengthToVisit) {
		for (const rootNode of rootNodes) {
			const isBreak = await dfs(rootNode);
			if (isBreak) {
				return;
			}
		}
	}

	set({
		unlockGraph: true,
	});
}

export function getRootNodes(get: () => RFState, nodes: CustomNode[]): CustomNode[] {
	const rootNodes: CustomNode[] = [];

	for (const node of nodes) {
		// get inputs
		const inputNodes = get().getNodes(node.data.inputs.inputs);
		const loopInputCount = inputNodes.filter((inputNode) => inputNode.data.loopId).length;

		// if loop is root, it might still have inputs from the loop end node.
		// if node is variable, don't consider it
		if (
			(node.data.inputs.inputs.length === 0 || loopInputCount === inputNodes.length) &&
			node.type !== NodeTypesEnum.globalVariable
		) {
			rootNodes.push(node);
		}
	}

	return rootNodes;
}
