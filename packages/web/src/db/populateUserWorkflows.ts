import { Database } from '@chatbutler/shared';
import { SupabaseClient } from '@supabase/supabase-js';

import { RFState } from '../store/useStore';
import { RFStateSecret } from '../store/useStoreSecret';

const populateUserWorkflows = async (
	setWorkflows: RFState['setWorkflows'],
	setNotificationMessage: RFState['setNotificationMessage'],
	session: RFStateSecret['session'],
	supabase: SupabaseClient<Database>,
) => {
	if (!session) {
		return;
	}
	const { data, error } = await supabase
		.from('workflows')
		.select('id, name, description, is_public, user_id, updated_at')
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
		setNotificationMessage(error.message);
	}
};

export default populateUserWorkflows;
