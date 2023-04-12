import {
	getSmartEdge,
	pathfindingJumpPointNoDiagonal,
	svgDrawSmoothLinePath,
} from '@tisoap/react-flow-smart-edge';
import React from 'react';
import { useNodes, BezierEdge, EdgeProps } from 'reactflow';

import { conditionalClassNames } from '../utils/classNames';

export const CustomEdgeType: React.FC<EdgeProps> = (props) => {
	const {
		id,
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		style,
		markerStart,
		markerEnd,
		selected,
	} = props;

	const nodes = useNodes();

	const getSmartEdgeResponse = getSmartEdge({
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		nodes,
		options: {
			nodePadding: 40,
			gridRatio: 30,
			drawEdge: svgDrawSmoothLinePath,
			generatePath: (grid, start, end) => {
				return pathfindingJumpPointNoDiagonal(grid, start, end);
			},
		},
	});

	// If the value returned is null, it means "getSmartEdge" was unable to find
	// a valid path, and you should do something else instead
	if (getSmartEdgeResponse === null) {
		return <BezierEdge {...props} />;
	}

	const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;

	return (
		<svg style={{ overflow: 'visible' }}>
			<defs>
				<marker
					id="arrow"
					viewBox="0 0 10 10"
					refX="7"
					refY="5"
					markerWidth="3"
					markerHeight="10"
					orient="auto-start"
					// orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" />
				</marker>
			</defs>
			<path
				style={style}
				className={conditionalClassNames(
					'react-flow__edge-path',
					selected && 'text-emerald-600',
				)}
				d={svgPathString}
				markerEnd={'url(#arrow)'}
				markerStart={markerStart}
			/>
		</svg>
	);
};
