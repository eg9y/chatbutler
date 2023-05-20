import { PlusIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import NodeTemplate from './templates/NodeTemplate';
import { CounterDataType } from './types/NodeTypes';

const Counter: FC<NodeProps<CounterDataType>> = (props) => {
	const { selected } = props;

	return (
		<div className="">
			<div
				style={{
					height: '15rem',
					width: '15rem',
				}}
				className={`m-3 border-2 shadow-lg  ${
					selected ? 'border-emerald-600' : 'border-slate-300'
				} flex items-center justify-center bg-emerald-200`}
			>
				<PlusIcon className={`h-10 w-10 animate-pulse`} />
				<p className="text-4xl">Counter</p>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="text-input"
				className="h-4 w-4"
			></Handle>
			<Handle type="source" position={Position.Right} id="text-output" className="h-4 w-4" />
		</div>
	);
};

export default memo(Counter);
