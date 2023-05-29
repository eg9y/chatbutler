import { NodeTypesEnum, PlaceholderDataType } from '@chatbutler/shared/src/index';
import { PlusIcon } from '@heroicons/react/20/solid';
import { FC } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../store/useStore';

const PlaceholderNode: FC<NodeProps<PlaceholderDataType>> = ({ data, id }) => {
	const { onPlaceholderAdd } = useStore(selector, shallow);

	const onPlaceholderClick = () => {
		const type = data.typeToCreate ?? NodeTypesEnum.chatMessage;
		onPlaceholderAdd(id, type);
	};
	return (
		<div
			style={{
				height: '40rem',
				width: '35rem',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				cursor: 'pointer',
				position: 'relative',
			}}
			className="nodrag m-3 border-4 border-dashed border-slate-300 bg-slate-100/20"
			onClick={onPlaceholderClick}
		>
			<PlusIcon
				className={'h-24 w-24  flex-shrink-0 text-slate-300 group-hover:text-slate-400'}
				aria-hidden="true"
			/>
			<Handle
				type="target"
				position={Position.Left}
				id="placeholder-target"
				className="bg-transparent"
			></Handle>
		</div>
	);
};

export default PlaceholderNode;
