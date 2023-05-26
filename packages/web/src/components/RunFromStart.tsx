import { CustomNode, NodeTypesEnum, LoopDataType } from '@chatbutler/shared';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
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
		setNotificationMessage,
		clearAllNodeResponses,
		setChatApp,
		setNodes,
		setUnlockGraph,
		runFlow,
		edges,
	} = useStore(selector, shallow);
	const { openAiKey } = useStoreSecret(selectorSecret, shallow);

	async function runFromStart() {
		if (openAiKey.trim() === '') {
			setNotificationMessage('Please enter an OpenAI API key in the left panel.');
			return;
		}

		setIsLoading(true);
		try {
			setChatApp([]);
			// eslint-disable-next-line no-constant-condition
			clearAllNodeResponses();
			// Create a new AbortController and set it to the ref
			abortControllerRef.current = new AbortController();
			const signal = abortControllerRef.current.signal;
			setUnlockGraph(false);
			await runFlow(nodes, edges, openAiKey, signal);
			setUnlockGraph(true);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.message === 'Operation cancelled') {
				setNotificationMessage('traverseTree operation cancelled');
			} else {
				console.log('error message', error.message);
				setNotificationMessage(error.message);
			}
		} finally {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				abortControllerRef.current = null;
			}
			const clearedNodes = nodes.map((node) => {
				const newNode = {
					...node,
					data: {
						...node.data,
						isLoading: false,
					},
				};
				if (node.type === NodeTypesEnum.loop) {
					(newNode.data as LoopDataType).loopCount = 0;
				}
				return newNode;
			});
			setNodes(clearedNodes);
			setIsLoading(false);
			setUnlockGraph(true);
		}
	}

	function stopRun() {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
		}
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
		setUnlockGraph(true);
	}

	return (
		<button
			className={conditionalClassNames(
				isLoading ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600 ',
				'text-md flex items-center rounded px-2  py-1 font-semibold text-white',
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
