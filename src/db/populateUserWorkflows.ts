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
		.select('id, name')
		.eq('user_id', session.user.id);
	if (data) {
		setWorkflows(data);
	} else if (error) {
		setUiErrorMessage(error.message);
	}
};

export default populateUserWorkflows;
