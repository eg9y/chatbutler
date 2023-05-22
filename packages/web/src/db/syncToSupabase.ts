import { Database } from '@chatbutler/shared';
import { SupabaseClient } from '@supabase/supabase-js';
import { DefaultParams } from 'wouter';

import { RFState } from '../store/useStore';
import { RFStateSecret } from '../store/useStoreSecret';
import isWorkflowOwnedByUser from '../utils/isWorkflowOwnedByUser';

const syncDataToSupabase = async (
	nodes: RFState['nodes'],
	edges: RFState['edges'],
	currentWorkflow: RFState['currentWorkflow'],
	workflows: RFState['workflows'],
	setWorkflows: RFState['setWorkflows'],
	session: RFStateSecret['session'],
	params: DefaultParams | null,
	supabase: SupabaseClient<Database>,
) => {
	if (!currentWorkflow || !session) return;

	const updatedNodes = nodes.map((node) => {
		return {
			...node,
			data: {
				...node.data,
				response: '',
				isLoading: false,
			},
		};
	});

	const { data, error } = await supabase
		.from('workflows')
		.update({
			edges: JSON.parse(JSON.stringify(edges)),
			nodes: JSON.parse(JSON.stringify(updatedNodes)),
			name: currentWorkflow.name,
			description: currentWorkflow.description,
			is_public: currentWorkflow.is_public,
		})
		.eq('id', currentWorkflow.id)
		.select();
	if (error) {
		console.error('Error syncing data to Supabase:', error);
	}

	if (!data || (data.length === 0 && isWorkflowOwnedByUser(session, params))) {
		// 'Syncing local data to the cloud...
		const { data: insertionData, error: insertionError } = await supabase
			.from('workflows')
			.insert({
				id: currentWorkflow.id,
				edges: JSON.parse(JSON.stringify(edges)),
				nodes: JSON.parse(JSON.stringify(updatedNodes)),
				description: currentWorkflow.description,
				name: currentWorkflow.name,
				is_public: currentWorkflow.is_public,
				user_id: session.user.id,
			})
			.select('id, name, description, is_public, user_id, updated_at')
			.single();

		if (insertionData) {
			//'Data synced to Supabase:'
			setWorkflows([
				...workflows,
				{
					...insertionData,
					description: insertionData.description || '',
				},
			]);
		}
		if (insertionError) {
			console.error('Error inserting data to Supabase:', insertionError);
			console.error({
				id: currentWorkflow.id,
				edges: JSON.parse(JSON.stringify(edges)),
				nodes: JSON.parse(JSON.stringify(updatedNodes)),
				description: currentWorkflow.description,
				name: currentWorkflow.name,
				is_public: currentWorkflow.is_public,
				user_id: session.user.id,
			});
		}
	}
};

export default syncDataToSupabase;
