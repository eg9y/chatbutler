import { Session } from '@supabase/supabase-js';

import { SimpleWorkflow } from '../../../db/dbTypes';
import { DocSource } from '../../../nodes/types/NodeTypes';
import { RFState } from '../../../store/useStore';

function isValidUrl(urlString: string): boolean {
	try {
		new URL(urlString);
		return true;
	} catch (error) {
		return false;
	}
}

export async function uploadWebsiteUrl(
	currentSession: Session | null,
	source: DocSource,
	url: string,
	chatbot: SimpleWorkflow,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setNotificationMessage: RFState['setNotificationMessage'],
): Promise<void> {
	// <-- Add Promise<void> here
	if (!currentSession || !currentSession.access_token) {
		throw new Error('No session');
	}

	if (source === DocSource.pdfUrl || source === DocSource.websiteUrl) {
		if (!isValidUrl(url)) {
			alert('Please enter a valid URL');
			return;
		}
		const options = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${currentSession.access_token}`,
			},
			body: JSON.stringify({
				urls: [url],
				chatbot_id: chatbot.id,
			}),
		};

		try {
			setIsLoading(true);
			let response = await fetch(`${import.meta.env.VITE_DOC_SERVER}/upload-url/`, options);

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
								url,
							)}`,
						).then((response) => response.json());

						console.log('progressResponse', progressResponse);
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
