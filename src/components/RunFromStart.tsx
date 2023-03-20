import { Node } from 'reactflow';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import useStore, { selector } from '../store/useStore';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';
import { ChatMessageNodeDataType, ChatPromptNodeDataType } from '../nodes/types/NodeTypes';

export default function RunFromStart() {
	const {
		setUiErrorMessage,
		getSortedNodesAndRootNodes,
		runGraph,
		getChatPaths,
		clearAllNodeResponses,
	} = useStore(selector, shallow);

	const [isLoading, setIsLoading] = useState(false);

	async function getResponse() {
		setIsLoading(true);
		try {
			clearAllNodeResponses();
			const { sortedNodes, rootNodes } = getSortedNodesAndRootNodes();

			const rootNodePaths = rootNodes
				.filter((rootNode) => rootNode.type == 'chatMessage')
				.map((rootNode) => {
					const chatPaths = getChatPaths(
						rootNode as Node<ChatMessageNodeDataType | ChatPromptNodeDataType>,
					);
					return chatPaths
						.filter((path) => {
							const lastNode = path[path.length - 1];
							return lastNode.substring(0, lastNode.indexOf('-')) === 'chatPrompt';
						})
						.reduce((obj: { [chatPrompt: string]: string[] }, path) => {
							obj[path[path.length - 1]] = path.slice(0, path.length - 1);
							return obj;
						}, {});
				})
				.reduce((obj: { [chatPrompt: string]: string[] }, curr) => {
					return { ...obj, ...curr };
				}, {});

			for (let i = 0; i < sortedNodes.length; i++) {
				await runGraph(sortedNodes, i, rootNodePaths);
				if (sortedNodes[i].data.isBreakpoint) {
					// TODO: breakpoint notification and step through
					break;
				}
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setUiErrorMessage(error.message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<button
			className="bg-blue-500 hover:bg-blue-600 text-white text-md font-semibold py-1 px-2  rounded flex items-center"
			onClick={getResponse}
		>
			{isLoading ? (
				<svg
					className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			) : (
				<ChevronDoubleRightIcon className="h-7 w-7 text-white" />
			)}
			<span>Run from start</span>
		</button>
	);
}
