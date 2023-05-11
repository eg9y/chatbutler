import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '../schema';
import { RFState } from '../store/useStore';
import { RFStateSecret } from '../store/useStoreSecret';

const populateUserWorkflows = async (
	setWorkflows: RFState['setWorkflows'],
	setUiErrorMessage: RFState['setUiErrorMessage'],
	session: RFStateSecret['session'],
	supabase: SupabaseClient<Database>,
) => {
	if (!session) {
		return;
	}
	const { data, error } = await supabase
		.from('workflows')
		.select('id, name, description')
		.eq('user_id', session.user.id);
	if (data) {
		const newData = data.map((workflow) => {
			return {
				...workflow,
				description: workflow.description || '',
			};
		});
		setWorkflows(newData);
	} else if (error) {
		setUiErrorMessage(error.message);
	}
};

export default populateUserWorkflows;
