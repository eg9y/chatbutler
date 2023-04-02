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
		console.log(user.data.user);
		const documentUrl = `${user.data.user.id}/${file.name}`;
		const { data: fileUpload, error: fileUploadError } = await supabase.storage
			.from('documents')
			.upload(documentUrl, file, {
				cacheControl: '3600',
				upsert: false,
			});

		if (fileUploadError) {
			console.log('fileUploadError', fileUploadError);
			return;
		}
		if (!fileUpload) {
			console.log('file upload failed');
			return;
		}

		const { data: newDocument, error } = await supabase
			.from('documents')
			.insert({
				name: file.name,
				file_format: file.type,
				size: file.size,
				document_url: documentUrl,
				user_id: user.data.user.id,
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
