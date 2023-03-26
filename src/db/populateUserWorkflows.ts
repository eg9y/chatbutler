import supabase from '../auth/supabaseClient';
import { RFState } from '../store/useStore';

const populateUserWorkflows = async (
	setWorkflows: RFState['setWorkflows'],
	setUiErrorMessage: RFState['setUiErrorMessage'],
	session: RFState['session'],
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
