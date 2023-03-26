import { PlayIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
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
				<Loading className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" />
			) : (
				<>{Icon}</>
			)}
			<span>{text}</span>
		</button>
	);
}
