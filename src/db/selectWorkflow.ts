import { SupabaseClient } from '@supabase/supabase-js';
import { Edge, Node } from 'reactflow';

import { Inputs } from '../nodes/types/Input';
import { CustomNode } from '../nodes/types/NodeTypes';
import { Database } from '../schema';
import { RFState } from '../store/useStore';

const selectWorkflow = async (
	newWorkflowId: string,
	nodes: RFState['nodes'],
	edges: RFState['edges'],
	currentWorkflow: RFState['currentWorkflow'],
	setUiErrorMessage: RFState['setUiErrorMessage'],
	setCurrentWorkflow: RFState['setCurrentWorkflow'],
	setGlobalVariables: RFState['setGlobalVariables'],
	setNodes: RFState['setNodes'],
	setEdges: RFState['setEdges'],
	supabase: SupabaseClient<Database>,
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
	let parsedNodes: Node[] = [];
	if (typeof data.nodes === 'string') {
		parsedNodes = JSON.parse(data.nodes as string).map((node: CustomNode) => {
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
		parsedNodes = (data.nodes as unknown as CustomNode[]).map((node: CustomNode) => {
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

	// set global variables
	const globalVariables = parsedNodes
		.filter((node) => node.type === 'globalVariable')
		.map((node) => ({
			id: node.id,
			data: node.data,
		}))
		.reduce(
			(acc, node) => {
				acc[node.id] = node.data.name;
				return acc;
			},
			{} as {
				[key: string]: string;
			},
		);

	setGlobalVariables(globalVariables);

	setCurrentWorkflow({
		id: data.id,
		name: data.name,
		user_id: data.user_id,
		description: data.description || '',
	});
};

export default selectWorkflow;
