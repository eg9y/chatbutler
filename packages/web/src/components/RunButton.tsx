import { PlayIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
import { useStore, useStoreSecret, selector, selectorSecret } from '../store';

export default function RunButton({
	text = 'Run',
	Icon = (
		<PlayIcon className={'-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-blue-300'} aria-hidden="true" />
	),
	id,
}: {
	text?: string;
	Icon?: JSX.Element;
	id: string;
}) {
	const { setNotificationMessage, getNodes } = useStore(selector, shallow);
	const { openAiKey } = useStoreSecret(selectorSecret, shallow);

	const [isLoading, setIsLoading] = useState(false);

	// TODO: refactor fn to state
	function getResponse() {
		return async () => {
			setIsLoading(true);
			try {
				// get current node
				const currentNode = getNodes([id])[0];
				// await runNode(currentNode, openAiKey);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				setNotificationMessage(error.message);
			} finally {
				setIsLoading(false);
			}
		};
	}

	return (
		<button
			className="text-md flex items-center rounded bg-blue-500 px-2 py-1  font-semibold text-white hover:bg-blue-600"
			onClick={getResponse()}
		>
			{isLoading ? (
				<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
			) : (
				<>{Icon}</>
			)}
			<span>{text}</span>
		</button>
	);
}
