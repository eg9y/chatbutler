import { Edge } from 'reactflow';

import supabase from '../auth/supabaseClient';
import { CustomNode } from '../nodes/types/NodeTypes';

const syncDataToSupabase = async (
	nodes: CustomNode[],
	edges: Edge<any>[],
	setWorkflowName: (name: string) => void,
	workflowName: string,
	setWorkflows: (workflows: { id: string; name: string }[]) => void,
	workflowId: string,
	setWorkflowId: (id: string) => void,
) => {
	const user = await supabase.auth.getUser();
	if (user) {
		if (user.error) {
			console.error('Error fetching user from Supabase:', user.error);
			return;
		}
		const { data: workflowEntry, error: workflowError } = await supabase
			.from('workflows')
			.select('id')
			.eq('id', workflowId)
			.select()
			.single();

		if (workflowError) {
			console.error('Error fetching workflows from Supabase:', workflowError);
			if (workflowError.code != 'PGRST116') {
				return;
			}
		}

		// user just signed up and has no workflows in the db
		if (!workflowEntry) {
			const { data, error } = await supabase
				.from('workflows')
				.insert({
					id: workflowId,
					name: `${user.data.user.email} workflow`,
					nodes: JSON.stringify(nodes),
					edges: JSON.stringify(edges),
					user_id: user.data.user.id,
				})
				.select()
				.single();

			if (data) {
				setWorkflowId(data.id);
				setWorkflowName(data.name);
				const { data: currentWorkflow, error: currentWorkflowError } = await supabase
					.from('workflows')
					.select();
				if (currentWorkflow) {
					setWorkflows([...currentWorkflow, { id: data.id, name: data.name }]);
				} else if (currentWorkflowError) {
					console.error(currentWorkflowError.message);
				}
			} else if (error) {
				console.error('Error syncing data to Supabase:', error);
			}
			return;
		} else {
			const { error } = await supabase
				.from('workflows')
				.update({
					edges: JSON.parse(JSON.stringify(edges)),
					nodes: JSON.parse(JSON.stringify(nodes)),
					name: workflowName,
				})
				.eq('id', workflowEntry.id)
				.select();
			if (error) {
				console.error('Error syncing data to Supabase:', error);
			}
		}
	}
};

export default syncDataToSupabase;
