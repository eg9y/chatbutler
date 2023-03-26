import { Edge } from 'reactflow';
import { DefaultParams } from 'wouter';

import selectWorkflow from './selectWorkflow';
import supabase from '../auth/supabaseClient';
import { CustomNode } from '../nodes/types/NodeTypes';

const getInitialState = async (
	params: DefaultParams | null,
	setCurrentWorkflow: (id: string | null, name: string | null) => void,
	setWorkflows: (workflows: { id: string; name: string }[]) => void,
	setUiErrorMessage: (message: string | null) => void,
	edges: Edge<any>[],
	nodes: CustomNode[],
	currentWorkflow: { id: string; name: string } | null,
	setNodes: (nodes: CustomNode[]) => void,
	setEdges: (edges: Edge<any>[]) => void,
) => {
	const { data, error } = await supabase.from('workflows').select();
	if (data) {
		setWorkflows(data);
	} else if (error) {
		setUiErrorMessage(error.message);
	}

	if (params && params.id) {
		const { data: selectedWorkflow, error: selectedWorkflowError } = await supabase
			.from('workflows')
			.select('id, name')
			.eq('id', params.id)
			.single();
		if (selectedWorkflow) {
			await selectWorkflow(
				edges,
				nodes,
				currentWorkflow,
				setUiErrorMessage,
				setCurrentWorkflow,
				selectedWorkflow,
				setNodes,
				setEdges,
			);
		}
		if (error || selectedWorkflowError) {
			setUiErrorMessage(`${error?.message}, ${selectedWorkflowError?.message}`);
		}
	}
};
export default getInitialState;
