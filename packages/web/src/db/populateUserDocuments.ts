import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@chatbutler/shared'
import { RFState } from '../store/useStore';
import { RFStateSecret } from '../store/useStoreSecret';

const populateUserDocuments = async (
	setDocuments: RFState['setDocuments'],
	setUiErrorMessage: RFState['setUiErrorMessage'],
	session: RFStateSecret['session'],
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
