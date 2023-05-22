import React from 'react';
import { ConnectionLineComponentProps } from 'reactflow';

export default function ConnectionLine({ fromX, fromY, toX, toY }: ConnectionLineComponentProps) {
	return (
		<g>
			<path
				fill="none"
				stroke="#222"
				strokeWidth={1.5}
				className="animated"
				d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
			/>
			<circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
		</g>
	);
}
