import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '../../schema';

const handleFileUpload = async (
	file: File,
	setUploadProgress: React.Dispatch<React.SetStateAction<number | null>>,
	supabase: SupabaseClient<Database>,
) => {
	if (file.type === 'text/plain') {
		const user = await supabase.auth.getUser();
		if (!user.data.user) {
			throw new Error('user not logged in');
		}

		const { data: newDocument, error } = await supabase
			.from('documents')
			.insert({
				user_id: user.data.user.id,
				name: file.name,
			})
			.select()
			.single();

		if (error) {
			console.log('error', error);
			return;
		}

		setUploadProgress(null);

		return newDocument;
	}

	return null;
};

export default handleFileUpload;
