import { PlayIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../store/useStore';

export default function RunButton({
	text = 'Run',
	Icon = (
		<PlayIcon className={'text-blue-300 -ml-1 mr-1 h-5 w-5 flex-shrink-0'} aria-hidden="true" />
	),
	id,
}: {
	text?: string;
	Icon?: JSX.Element;
	id: string;
}) {
	const { setUiErrorMessage, getNodes, runNode } = useStore(selector, shallow);

	const [isLoading, setIsLoading] = useState(false);

	// TODO: refactor fn to state
	function getResponse() {
		return async () => {
			setIsLoading(true);
			try {
				// get current node
				const currentNode = getNodes([id])[0];
				await runNode(currentNode);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				setUiErrorMessage(error.message);
			} finally {
				setIsLoading(false);
			}
		};
	}

	return (
		<button
			className="bg-blue-500 hover:bg-blue-600 text-white text-md font-semibold py-1 px-2  rounded flex items-center"
			onClick={getResponse()}
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
				<>{Icon}</>
			)}
			<span>{text}</span>
		</button>
	);
}
