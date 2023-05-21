import { useState, useEffect } from 'react';

function parseQueryParams(queryString: string) {
	let queryParams: { [key: string]: string } | null = null;
	new URLSearchParams(queryString).forEach((value, key) => {
		if (!queryParams) {
			queryParams = {
				[key]: value,
			};
		} else {
			queryParams[key] = value;
		}
	});
	return queryParams;
}

export function useQueryParams() {
	const [queryParams, setQueryParams] = useState<{ id: string; user_id: string } | null>(null);

	useEffect(() => {
		const queryString = document.location.search;
		const parsedParams = parseQueryParams(queryString);
		setQueryParams(parsedParams);
	}, []);

	return queryParams;
}
