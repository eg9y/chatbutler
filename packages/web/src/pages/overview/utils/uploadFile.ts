import { DocSource } from '@chatbutler/shared';
import { Session } from '@supabase/supabase-js';

import { SimpleWorkflow } from '../../../db/dbTypes';
import { RFState } from '../../../store/useStore';

export async function uploadFile(
	currentSession: Session | null,
	source: DocSource,
	chatbot: SimpleWorkflow,
	file: File, // New parameter for the file
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setNotificationMessage: RFState['setNotificationMessage'],
): Promise<void> {
	// Maximum file size (5MB)
	const MAX_FILE_SIZE = 5 * 1024 * 1024;

	// <-- Add Promise<void> here
	if (!currentSession || !currentSession.access_token) {
		throw new Error('No session');
	}

	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		setNotificationMessage('File size exceeds the limit of 5MB');
		throw new Error('File size exceeds the limit of 5MB');
	}

	if (source === DocSource.pdf) {
		// Create a FormData object
		const formData = new FormData();

		// Append the file and chatbot_id to the form data
		formData.append('files', file);
		formData.append('chatbot_id', chatbot.id);

		const options = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${currentSession.access_token}`,
			},
			body: formData, // Use formData as the request body
		};

		try {
			setIsLoading(true);
			let response = await fetch(`${import.meta.env.VITE_DOC_SERVER}/upload/`, options);

			// check if response is ok
			if (!response.ok) {
				setIsLoading(false);
				setNotificationMessage('Error uploading document');
				throw new Error('Error uploading document');
			}

			response = await response.json();

			// Start polling progress endpoint every X interval
			return new Promise<void>((resolve, reject) => {
				// <-- Add void here
				const progressInterval = setInterval(async () => {
					try {
						const progressResponse = await fetch(
							`${import.meta.env.VITE_DOC_SERVER}/progress/?url=${encodeURIComponent(
								file.name,
							)}`,
						).then((response) => response.json());

						// If progress is 100, stop polling, set loading to false, and resolve the promise
						if (progressResponse.progress === 100) {
							setIsLoading(false);
							clearInterval(progressInterval);
							resolve();
						}
					} catch (error) {
						console.log('Error fetching progress:', error);
						reject(error);
					}
				}, 5000); // replace 5000 (5 seconds) with your desired interval
			});
		} catch (error) {
			console.log(error);
		}
	} else {
		throw new Error('Invalid source');
	}
}
