import { Edge } from 'reactflow';
import {
	ChatMessageNodeDataType,
	ChatPromptNodeDataType,
	ClassifyNodeCategoriesDataType,
	ClassifyNodeDataType,
	CustomNode,
	LLMPromptNodeDataType,
	NodeTypesEnum,
} from '../nodes/types/NodeTypes';
import {
	ChatSequence,
	getOpenAIChatResponse,
	getOpenAIResponse,
	parsePromptInputs,
} from '../openai/openai';
import { RFState } from '../store/useStore';

function collectChatMessages(node: CustomNode, get: () => RFState): CustomNode[] {
	const queue: CustomNode[] = [node];
	const chatMessageNodes: CustomNode[] = [];

	while (queue.length > 0) {
		const currentNode = queue.shift();
		if (!currentNode) continue;

		const inputNodes = get().getNodes(currentNode.data.inputs.inputs);

		let isAnyParentMessage = false;
		for (const parent of inputNodes) {
			if (parent.type === NodeTypesEnum.chatMessage && !chatMessageNodes.includes(parent)) {
				parent.data.response = parsePromptInputs(
					parent.data.text,
					get().getNodes(parent.data.inputs.inputs),
				);
				chatMessageNodes.push(parent);
				isAnyParentMessage = true;
			}
			queue.push(parent);
		}
		if (isAnyParentMessage === false) {
			break;
		}
	}

	return chatMessageNodes.reverse();
}

export async function traverseTree(
	get: () => RFState,
	set: (state: Partial<RFState>) => void,
): Promise<void> {
	const visited = new Set<string>();
	const skipped = new Set<string>();
	const nodesLengthToVisit = get().nodes.length;

	function allParentsVisited(node: CustomNode): boolean {
		const inputNodes = get().getNodes(node.data.inputs.inputs);
		return inputNodes.every((parent) => {
			return visited.has(parent.id);
		});
	}

	// Helper function to collect all children of the skipped nodes that has no other parents to lead to them
	function getSkippedExclusiveChildren(node: CustomNode): CustomNode[] {
		const children = get().getNodes(node.data.children);
		if (children.length === 0) {
			return [];
		}
		return children.reduce((acc: CustomNode[], child: CustomNode) => {
			return acc.concat(child, getSkippedExclusiveChildren(child));
		}, []);
	}

	async function dfs(node: CustomNode): Promise<boolean> {
		if (visited.has(node.id) || !allParentsVisited(node) || skipped.has(node.id)) return false;

		visited.add(node.id);

		let childrenNodes = get().getNodes(node.data.children);

		try {
			childrenNodes = runConditional(
				node,
				get,
				childrenNodes,
				skipped,
				getSkippedExclusiveChildren,
			);
			await runNode(node, get, set);
		} catch (error: any) {
			throw new Error('Error running node', error);
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
	const rootNodes = getRootNodes(get().nodes);
	// Update the while loop condition
	while (visited.size + skipped.size < nodesLengthToVisit) {
		for (const rootNode of rootNodes) {
			const isBreak = await dfs(rootNode);
			if (isBreak) {
				return;
			}
		}
	}
}

export async function runNode(
	node: CustomNode,
	get: () => RFState,
	set: (state: Partial<RFState>) => void,
) {
	if (
		node.type === NodeTypesEnum.llmPrompt ||
		node.type === NodeTypesEnum.chatPrompt ||
		node.type === NodeTypesEnum.classify
	) {
		node.data = {
			...node.data,
			isLoading: true,
			response: '',
		};
		get().updateNode(node.id, node.data);
	}

	if (node.type === NodeTypesEnum.llmPrompt) {
		const inputs = node.data.inputs;
		if (inputs) {
			const response = await getOpenAIResponse(
				get().openAIApiKey,
				node.data as LLMPromptNodeDataType,
				get().getNodes(inputs.inputs),
			);
			// const mockResponse = {
			// 	data: {
			// 		choices: [
			// 			{
			// 				text:
			// 					Math.random().toString(36).substring(2, 15) +
			// 					Math.random().toString(36).substring(2, 15),
			// 			},
			// 		],
			// 	},
			// };
			// const completion = mockResponse.data.choices[0].text;
			const completion = response.data.choices[0].text;
			if (completion) {
				node.data = {
					...node.data,
					response: completion,
					isLoading: false,
				};
			}
		}
	} else if (node.type === NodeTypesEnum.chatPrompt) {
		const chatMessageNodes = collectChatMessages(node, get);
		console.log(
			'Chat sequence:',
			chatMessageNodes.map((n) => n.data.name).concat(node.data.name),
		);
		const chatSequence = chatMessageNodes.map((node) => {
			const data = node.data as ChatMessageNodeDataType;
			return {
				role: data.role,
				content: data.response,
			};
		});
		const response = await getOpenAIChatResponse(
			get().openAIApiKey,
			node.data as ChatPromptNodeDataType,
			chatSequence,
		);
		const completion = response.data.choices[0].message?.content;
		// const completion = 'foo';
		if (completion) {
			node.data = {
				...node.data,
				response: completion,
				isLoading: false,
			};
		}
	} else if (node.type === NodeTypesEnum.classify) {
		const classifyData = node.data as ClassifyNodeDataType;
		// get node with id data.categoryNodeId
		const categoryNode = get().nodes.find(
			(node) => node.id === classifyData.children[0],
		) as CustomNode;
		const categoryData = categoryNode.data as ClassifyNodeCategoriesDataType;
		// convert categoryData.classifications to comma separated strings of the value fields only
		const categories = categoryData.classifications
			.map((classification) => classification.value)
			.join(', ');

		const parsedText = parsePromptInputs(
			node.data.text,
			get().getNodes(node.data.inputs.inputs),
		);
		const chatSequence = [
			{
				role: 'user',
				content: `Classify the following ${classifyData.textType} into one of the following categories: ${categories}.
									\n${classifyData.textType}: ${parsedText}`,
			},
		] as ChatSequence;
		const response = await getOpenAIChatResponse(
			get().openAIApiKey,
			classifyData,
			chatSequence,
		);
		const completion = response.data.choices[0].message?.content;
		// const completion = 'hackernews';
		if (completion) {
			node.data = {
				...node.data,
				response: completion,
				isLoading: false,
			};
		}
	} else if (node?.type === NodeTypesEnum.textInput) {
		node.data.response = parsePromptInputs(
			node.data.text,
			get().getNodes(node.data.inputs.inputs),
		);
	}

	get().updateNode(node.id, node.data);
	set({
		selectedNode: null,
		unlockGraph: true,
	});

	// if (
	// 	!node.parentNode &&
	// 	node.type !== NodeTypesEnum.chatMessage
	// ) {
	// 	return;
	// }
}

function runConditional(
	node: CustomNode,
	get: () => RFState,
	childrenNodes: CustomNode[],
	skipped: Set<string>,
	getSkippedExclusiveChildren: (node: CustomNode) => CustomNode[],
) {
	if (node.type === NodeTypesEnum.classifyCategories) {
		// 1) get edges where source is node and target is one of children
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
				const skippedChildren = getSkippedExclusiveChildren(child);
				skippedChildren.forEach((skippedChild) => {
					skipped.add(skippedChild.id);
				});
			}
		});
		childrenNodes = passingChildrenNodes;
	}
	return childrenNodes;
}

export function getRootNodes(nodes: CustomNode[]): CustomNode[] {
	const rootNodes: CustomNode[] = [];

	for (const node of nodes) {
		if (node.data.inputs.inputs.length === 0) {
			rootNodes.push(node);
		}
	}

	return rootNodes;
}
