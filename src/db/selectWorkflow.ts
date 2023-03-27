import { Edge } from 'reactflow';

import supabase from './supabaseClient';
import { Inputs } from '../nodes/types/Input';
import { CustomNode } from '../nodes/types/NodeTypes';
import { RFState } from '../store/useStore';

const selectWorkflow = async (
	newWorkflowId: string,
	nodes: RFState['nodes'],
	edges: RFState['edges'],
	currentWorkflow: RFState['currentWorkflow'],
	setUiErrorMessage: RFState['setUiErrorMessage'],
	setCurrentWorkflow: RFState['setCurrentWorkflow'],
	setNodes: RFState['setNodes'],
	setEdges: RFState['setEdges'],
) => {
	// save current workflow first before switching
	if (currentWorkflow) {
		const { error: updateCurrentWorkflowError } = await supabase
			.from('workflows')
			.update({
				edges: JSON.parse(JSON.stringify(edges)),
				nodes: JSON.parse(JSON.stringify(nodes)),
			})
			.eq('id', currentWorkflow.id);

		if (updateCurrentWorkflowError) {
			setUiErrorMessage(updateCurrentWorkflowError.message);
			return;
		}
	}
	// fetch workflow from supabase
	const { data, error } = await supabase
		.from('workflows')
		.select()
		.eq('id', newWorkflowId)
		.single();

	if (error) {
		setUiErrorMessage(error.message);
	}
	if (!data) {
		return;
	}

	// set graph
	if (typeof data.nodes === 'string') {
		const parsedNodes = JSON.parse(data.nodes as string).map((node: CustomNode) => {
			if ('inputs' in node.data) {
				return {
					...node,
					data: {
						...node.data,
						inputs: new Inputs(node.data.inputs.inputs, node.data.inputs.inputExamples),
					},
				};
			}
			return {
				...node,
			};
		});
		setNodes(parsedNodes);
	} else {
		const parsedNodes = (data.nodes as unknown as CustomNode[]).map((node: CustomNode) => {
			if ('inputs' in node.data) {
				return {
					...node,
					data: {
						...node.data,
						inputs: new Inputs(node.data.inputs.inputs, node.data.inputs.inputExamples),
					},
				};
			}
			return {
				...node,
			};
		});
		setNodes(parsedNodes);
	}
	if (typeof data.edges === 'string') {
		setEdges(JSON.parse(data.edges as string));
	} else {
		setEdges(data.edges as unknown as Edge[]);
	}
	setCurrentWorkflow({
		id: data.id,
		name: data.name,
		user_id: data.user_id,
	});
};

export default selectWorkflow;
