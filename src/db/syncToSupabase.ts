import { DefaultParams } from 'wouter';

import supabase from '../auth/supabaseClient';
import { RFState } from '../store/useStore';
import isWorkflowOwnedByUser from '../utils/isWorkflowOwnedByUser';

const syncDataToSupabase = async (
	nodes: RFState['nodes'],
	edges: RFState['edges'],
	currentWorkflow: RFState['currentWorkflow'],
	workflows: RFState['workflows'],
	setWorkflows: RFState['setWorkflows'],
	session: RFState['session'],
	params: DefaultParams | null,
) => {
	if (!currentWorkflow || !session) return;

	const { data, error } = await supabase
		.from('workflows')
		.update({
			edges: JSON.parse(JSON.stringify(edges)),
			nodes: JSON.parse(JSON.stringify(nodes)),
			name: currentWorkflow.name,
		})
		.eq('id', currentWorkflow.id)
		.select();
	if (!data || (data.length === 0 && isWorkflowOwnedByUser(session, params))) {
		// 'Syncing local data to the cloud...
		const { data, error: insertionError } = await supabase
			.from('workflows')
			.insert({
				id: currentWorkflow.id,
				edges: JSON.parse(JSON.stringify(edges)),
				nodes: JSON.parse(JSON.stringify(nodes)),
				name: currentWorkflow.name,
				user_id: session.user.id,
			})
			.select('id, name')
			.single();

		if (data) {
			//'Data synced to Supabase:'
			setWorkflows([...workflows, data]);
		}
		if (insertionError) {
			console.error('Error syncing data to Supabase:', insertionError);
		}
	}
	if (error) {
		console.error('Error syncing data to Supabase:', error);
	}
};

export default syncDataToSupabase;
