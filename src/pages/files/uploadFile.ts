import { db } from '../../backgroundTasks/dexieDb/db';
import { processFile } from '../../backgroundTasks/processFile';

const handleFileUpload = (
	file: File,
	setUploadProgress: React.Dispatch<React.SetStateAction<number | null>>,
) => {
	const reader = new FileReader();

	if (file.type === 'text/plain') {
		reader.onprogress = (progressEvent) => {
			const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
			setUploadProgress(progress);
		};

		reader.onloadend = async () => {
			const result = reader.result;

			const documentId = await db.DocumentMetadata.add({
				created_at: new Date().toDateString(),
				name: file.name,
				file_format: file.type,
				size: file.size,
			});

			if (result) {
				const openAIKey = localStorage.getItem('openAIKey');
				if (!openAIKey) {
					alert('Please enter your OpenAI API key in the settings page');
					return;
				}
				processFile(result, documentId as number, openAIKey);
				setUploadProgress(null);
			}
		};

		reader.readAsText(file);
	}
};

export default handleFileUpload;
