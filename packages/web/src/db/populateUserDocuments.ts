import { Database } from '@chatbutler/shared';
import { SupabaseClient } from '@supabase/supabase-js';

import { RFState } from '../store/useStore';
import { RFStateSecret } from '../store/useStoreSecret';

const populateUserDocuments = async (
	setDocuments: RFState['setDocuments'],
	setNotificationMessage: RFState['setNotificationMessage'],
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
		setNotificationMessage(error.message);
	}
};

export default populateUserDocuments;
