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
		<>
			<path
				style={style}
				className={conditionalClassNames(
					'react-flow__edge-path',
					selected && 'text-emerald-600',
				)}
				d={svgPathString}
				markerEnd={markerEnd}
				markerStart={markerStart}
			/>
			{/* <foreignObject
				width={foreignObjectSize}
				height={foreignObjectSize}
				x={edgeCenterX - foreignObjectSize / 2}
				y={edgeCenterY - foreignObjectSize / 2}
				requiredExtensions="http://www.w3.org/1999/xhtml"
			>
				<button
					onClick={(event) => {
						event.stopPropagation();
						alert(`remove ${id}`);
						//  remove edge
					}}
				>
					X
				</button>
			</foreignObject> */}
		</>
	);
};
