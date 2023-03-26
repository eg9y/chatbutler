import { Edge } from 'reactflow';

import supabase from '../auth/supabaseClient';
import { CustomNode } from '../nodes/types/NodeTypes';

const syncDataToSupabase = async (
	nodes: CustomNode[],
	edges: Edge<any>[],
	currentWorkflow: { id: string; name: string } | null,
) => {
	if (!currentWorkflow) return;

	const { error } = await supabase
		.from('workflows')
		.update({
			edges: JSON.parse(JSON.stringify(edges)),
			nodes: JSON.parse(JSON.stringify(nodes)),
			name: currentWorkflow.name,
		})
		.eq('id', currentWorkflow.id)
		.select();
	if (error) {
		console.error('Error syncing data to Supabase:', error);

		// TODO: Save user's local workflow data to supabase
	}
};

export default syncDataToSupabase;
