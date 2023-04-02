import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '../schema';
import { RFState } from '../store/useStore';

const populateUserDocuments = async (
	setDocuments: RFState['setDocuments'],
	setUiErrorMessage: RFState['setUiErrorMessage'],
	session: RFState['session'],
	supabase: SupabaseClient<Database>,
) => {
	if (!session) {
		return;
	}
	const { data, error } = await supabase
		.from('documents')
		.select()
		.eq('user_id', session.user.id);

	if (data) {
		setDocuments(data);
	} else if (error) {
		setUiErrorMessage(error.message);
	}
};

export default populateUserDocuments;
