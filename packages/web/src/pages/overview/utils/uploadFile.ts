import { Session } from '@supabase/supabase-js';

import { SimpleWorkflow } from '../../../db/dbTypes';
import { DocSource } from '../../../nodes/types/NodeTypes';
import { RFState } from '../../../store/useStore';

export async function uploadFile(
	currentSession: Session | null,
	source: DocSource,
	chatbot: SimpleWorkflow,
	file: File, // New parameter for the file
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setUiErrorMessage: RFState['setUiErrorMessage'],
) {
	if (!currentSession || !currentSession.access_token) {
		throw new Error('No session');
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
			let response = await fetch('https://server.chatbutler.ai/upload/', options);

			// check if response is ok
			if (!response.ok) {
				setIsLoading(false);
				setUiErrorMessage('Error uploading document');
				throw new Error('Error uploading document');
			}

			response = await response.json();

			// Start polling progress endpoint every X interval
			const progressInterval = setInterval(async () => {
				try {
					const progressResponse = await fetch(
						`https://server.chatbutler.ai/progress/?url=${encodeURIComponent(
							file.name,
						)}`,
					).then((response) => response.json());

					// If progress is 100, stop polling and set loading to false
					if (progressResponse.progress === 100) {
						setIsLoading(false);
						clearInterval(progressInterval);
					}
				} catch (error) {
					console.log('Error fetching progress:', error);
				}
			}, 5000); // replace 5000 (5 seconds) with your desired interval
		} catch (error) {
			console.log(error);
		}
	} else {
		throw new Error('Invalid source');
	}
}