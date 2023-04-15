import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
import { useStore, useStoreSecret, selector, selectorSecret } from '../store';

export default function RunFromStart({
	isLoading,
	setIsLoading,
	abortControllerRef,
}: {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	abortControllerRef: React.MutableRefObject<AbortController | null>;
}) {
	const { setUiErrorMessage, traverseTree, clearAllNodeResponses, setChatApp } = useStore(
		selector,
		shallow,
	);
	const { openAiKey } = useStoreSecret(selectorSecret, shallow);

	async function getResponse() {
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
			setIsLoading(false);
			// Clean up the abort controller
			abortControllerRef.current = null;
		}
	}

	return (
		<button
			className="bg-blue-500 hover:bg-blue-600 text-white text-md font-semibold py-1 px-2  rounded flex items-center"
			onClick={getResponse}
		>
			{isLoading ? (
				<Loading className="animate-spin -ml-1 mr-3 h-7 w-7 text-black" />
			) : (
				<ChevronDoubleRightIcon className="h-7 w-7 text-white" />
			)}
			<span>Run from start</span>
		</button>
	);
}
