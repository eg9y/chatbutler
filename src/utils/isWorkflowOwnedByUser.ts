import { Session } from '@supabase/supabase-js';
import { DefaultParams } from 'wouter';

const isWorkflowOwnedByUser = (session: Session | null, params: DefaultParams | null): boolean => {
	if (!params?.user_id) {
		return false;
	}
	return !!session && params && session.user.id === params.user_id;
};

export default isWorkflowOwnedByUser;
