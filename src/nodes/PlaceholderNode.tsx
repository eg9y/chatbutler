import { PlusIcon } from '@heroicons/react/20/solid';
import { FC } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore, { selector } from '../store/useStore';
import { NodeTypesEnum, PlaceholderDataType } from './types/NodeTypes';

const PlaceholderNode: FC<NodeProps<PlaceholderDataType>> = ({ data, xPos, yPos, id }) => {
	const { onPlaceholderAdd } = useStore(selector, shallow);

	const onPlaceholderClick = () => {
		const type = data.typeToCreate ?? NodeTypesEnum.chatExample;
		onPlaceholderAdd(id, type);
	};
	return (
		<div
			style={{
				height: '20rem',
				width: '35rem',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				cursor: 'pointer',
				position: 'relative',
			}}
			className="nodrag border-4 border-dashed border-slate-300 bg-slate-100"
			onClick={onPlaceholderClick}
		>
			<PlusIcon
				className={'text-slate-300 group-hover:text-slate-400  h-24 w-24 flex-shrink-0'}
				aria-hidden="true"
			/>
			<Handle
				type="target"
				position={Position.Left}
				id="placeholder"
				className="bg-transparent"
			></Handle>
		</div>
	);
};

export default PlaceholderNode;
