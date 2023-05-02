import {
	CustomNode,
	ConditionalDataType,
	ConditionalBooleanOperation,
} from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

function conditional(
	node: CustomNode,
	get: () => RFState,
	childrenNodes: CustomNode[],
	skipped: Set<string>,
	getAllChildren: (
		node: CustomNode,
		getNodes: (inputs: string[]) => CustomNode[],
	) => CustomNode[],
) {
	const data = node.data as ConditionalDataType;

	// get conditional result
	let isPass = false;
	const parsedText = parsePromptInputs(get, data.value, data.inputs.inputs);
	const parsedValueToCompare = parsePromptInputs(get, data.valueToCompare, data.inputs.inputs);

	if (data.booleanOperation === ConditionalBooleanOperation.EqualTo) {
		isPass = parsedText == parsedValueToCompare;
	} else if (data.booleanOperation === ConditionalBooleanOperation.NotEqualTo) {
		isPass = parsedText != parsedValueToCompare;
	} else if (data.booleanOperation === ConditionalBooleanOperation.GreaterThan) {
		// check if data.text and data.valueToCompare are numbers
		const isValueNumber = !isNaN(Number(parsedValueToCompare));
		const isTextNumber = !isNaN(Number(parsedText));
		if (isValueNumber && isTextNumber) {
			isPass = Number(data.text) > Number(parsedValueToCompare);
		}
		isPass = false;
	} else if (data.booleanOperation === ConditionalBooleanOperation.LessThan) {
		// check if data.text and data.valueToCompare are numbers
		const isValueNumber = !isNaN(Number(parsedValueToCompare));
		const isTextNumber = !isNaN(Number(parsedText));
		if (isValueNumber && isTextNumber) {
			isPass = parsedText < parsedValueToCompare;
		}
		isPass = false;
	} else if (data.booleanOperation === ConditionalBooleanOperation.GreaterThanOrEqualTo) {
		const isValueNumber = !isNaN(Number(parsedValueToCompare));
		const isTextNumber = !isNaN(Number(parsedText));
		if (isValueNumber && isTextNumber) {
			isPass = parsedText >= parsedValueToCompare;
		}
		isPass = false;
	} else if (data.booleanOperation === ConditionalBooleanOperation.LessThanOrEqualTo) {
		const isValueNumber = !isNaN(Number(parsedValueToCompare));
		const isTextNumber = !isNaN(Number(parsedText));
		if (isValueNumber && isTextNumber) {
			isPass = parsedText <= parsedValueToCompare;
		}
		isPass = false;
	}

	const sourceTargetEdge = get().edges.filter(
		(edge) =>
			edge.source === node.id && childrenNodes.map((child) => child.id).includes(edge.target),
	);

	console.log('ispass', isPass);

	const passingChildrenNodes = sourceTargetEdge
		.filter((edge) => {
			if (isPass) {
				return edge.sourceHandle === 'conditional-true-output';
			}
			return edge.sourceHandle === 'conditional-false-output';
		})
		.map((edge) => get().nodes.find((node) => node.id === edge.target) as CustomNode);

	console.log(passingChildrenNodes);
	// Update this part to store skipped nodes and their children
	childrenNodes.forEach((child) => {
		if (!passingChildrenNodes.includes(child)) {
			skipped.add(child.id);
			const skippedChildren = getAllChildren(child, get().getNodes);
			skippedChildren.forEach((skippedChild) => {
				skipped.add(skippedChild.id);
			});
		}
	});
	childrenNodes = passingChildrenNodes;
	return childrenNodes;
}

export default conditional;
