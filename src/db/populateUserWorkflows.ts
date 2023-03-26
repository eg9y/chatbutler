import { Session } from '@supabase/supabase-js';

import supabase from '../auth/supabaseClient';

const populateUserWorkflows = async (
	setWorkflows: (workflows: { id: string; name: string }[]) => void,
	setUiErrorMessage: (message: string | null) => void,
	session: Session,
) => {
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
