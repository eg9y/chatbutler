import { LoopDataType, NodeTypesEnum } from '@chatbutler/shared';
import { useRef, useState } from 'react';

import RunFromStart from '../../components/RunFromStart';
import { RFState } from '../../store/useStore';

function SandboxExecutionPanel({
	nodes,
	setNodes,
	setChatApp,
}: {
	nodes: RFState['nodes'];
	setNodes: RFState['setNodes'];
	setChatApp: RFState['setChatApp'];
}) {
	const [isLoading, setIsLoading] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	return (
		<div className="z-10 flex items-center gap-4">
			<RunFromStart
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				abortControllerRef={abortControllerRef}
				nodes={nodes}
			/>
			{/* <button
				className="bg-red-100/50 hover:bg-red-200/50 border-2 border-red-500 text-red-800 text-md font-semibold py-1 h-full px-2  rounded flex items-center"
				onClick={() => {
					// Are you sure prompt
					if (window.confirm('Are you sure you want to clear the responses?')) {
						if (abortControllerRef.current) {
							abortControllerRef.current.abort();
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
						setIsLoading(false);
						setNodes(clearedNodes);
					}
				}}
			>
				<span>Clear Run</span>
			</button> */}
		</div>
	);
}

export default SandboxExecutionPanel;
