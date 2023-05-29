import { CustomNode, Database, WorkflowDbSchema } from '@chatbutler/shared/src/index';
import { SupabaseClient } from '@supabase/supabase-js';
import { Edge, Node } from 'reactflow';

import { Inputs } from '../nodes/types/Input';
import { RFState } from '../store/useStore';

const selectWorkflow = async (
	newWorkflowId: string,
	nodes: RFState['nodes'],
	edges: RFState['edges'],
	currentWorkflow: RFState['currentWorkflow'],
	setNotificationMessage: RFState['setNotificationMessage'],
	setCurrentWorkflow: RFState['setCurrentWorkflow'],
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
				is_public: currentWorkflow.is_public,
				name: currentWorkflow.name,
				description: currentWorkflow.description,
			})
			.eq('id', currentWorkflow.id);

		if (updateCurrentWorkflowError) {
			setNotificationMessage(updateCurrentWorkflowError.message);
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
		setNotificationMessage(error.message);
	}
	if (!data) {
		return;
	}

	// set graph
	updateWorkflowStates(data, setNodes, setEdges, setCurrentWorkflow);
};

export default selectWorkflow;

export function updateWorkflowStates(
	workflow: WorkflowDbSchema,
	setNodes: RFState['setNodes'],
	setEdges: RFState['setEdges'],
	setCurrentWorkflow: RFState['setCurrentWorkflow'],
) {
	let parsedNodes: Node[] = [];
	if (typeof workflow.nodes === 'string') {
		parsedNodes = JSON.parse(workflow.nodes as string).map((node: CustomNode) => {
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
		parsedNodes = (workflow.nodes as unknown as CustomNode[]).map((node: CustomNode) => {
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
	if (typeof workflow.edges === 'string') {
		setEdges(JSON.parse(workflow.edges as string));
	} else {
		setEdges(workflow.edges as unknown as Edge[]);
	}

	setCurrentWorkflow({
		id: workflow.id,
		name: workflow.name,
		user_id: workflow.user_id,
		description: workflow.description || '',
		is_public: workflow.is_public,
		updated_at: workflow.updated_at,
	});
}
