import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

export const useConvertedParams = () => {
	const params = useParams();

	const convertParams = useCallback(() => {
		if (params['*']) {
			const [user_id, id] = params['*'].split('/');
			return { user_id, id };
		}
		return null;
	}, [params]);

	return convertParams;
};
