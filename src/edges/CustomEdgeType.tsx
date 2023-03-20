import { FC } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

const CustomEdge: FC<EdgeProps> = (props) => {
	const {
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		style = {},
		data,
		markerEnd,
	} = props;
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<>
			<path
				id={id}
				style={style}
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEnd}
			/>
			<text>
				<textPath
					href={`#${id}`}
					style={{ fontSize: 12 }}
					startOffset="50%"
					textAnchor="middle"
				>
					{data.text}
				</textPath>
			</text>
		</>
	);
};

export default CustomEdge;
