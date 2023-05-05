import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
import { NodeTypesEnum, LoopDataType, CustomNode } from '../nodes/types/NodeTypes';
import { useStore, useStoreSecret, selector, selectorSecret } from '../store';
import { conditionalClassNames } from '../utils/classNames';

export default function RunFromStart({
	isLoading,
	setIsLoading,
	abortControllerRef,
	nodes,
}: {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	abortControllerRef: React.MutableRefObject<AbortController | null>;
	nodes: CustomNode[];
}) {
	const {
		setUiErrorMessage,
		traverseTree,
		clearAllNodeResponses,
		setChatApp,
		setNodes,
		setUnlockGraph,
	} = useStore(selector, shallow);
	const { openAiKey } = useStoreSecret(selectorSecret, shallow);

	async function runFromStart() {
		if (openAiKey.trim() === '') {
			setUiErrorMessage('Please enter an OpenAI API key in the left panel.');
			return;
		}

		setIsLoading(true);
		try {
			setChatApp([]);
			clearAllNodeResponses();
			// Create a new AbortController and set it to the ref
			abortControllerRef.current = new AbortController();
			const signal = abortControllerRef.current.signal;

			await traverseTree(openAiKey, signal);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.message === 'Operation cancelled') {
				console.log('traverseTree operation cancelled');
			} else {
				setUiErrorMessage(error.message);
			}
		} finally {
			setUnlockGraph(true);
			setIsLoading(false);
			// Clean up the abort controller
			abortControllerRef.current = null;
		}
	}

	function stopRun() {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			const clearedNodes = nodes.map((node) => {
				const newNode = {
					...node,
					data: {
						...node.data,
						response: '',
						isLoading: false,
					},
				};
				if (node.type === NodeTypesEnum.loop) {
					(newNode.data as LoopDataType).loopCount = 0;
				}
				return newNode;
			});
			setChatApp([]);
			setIsLoading(false);
			setNodes(clearedNodes);
			abortControllerRef.current = null;
		}
		setUnlockGraph(true);
	}

	return (
		<button
			className={conditionalClassNames(
				isLoading ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600 ',
				'text-md flex items-center rounded py-1  px-2 font-semibold text-white',
			)}
			onClick={async () => {
				if (!isLoading) {
					await runFromStart();
				} else {
					stopRun();
				}
			}}
		>
			{isLoading ? (
				<Loading className="-ml-1 mr-3 h-7 w-7 animate-spin text-black" />
			) : (
				<ChevronDoubleRightIcon className="h-7 w-7 text-white" />
			)}
			<span>{isLoading ? 'Stop' : 'Run from Start'}</span>
		</button>
	);
}
