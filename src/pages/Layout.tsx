import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import useSupabase from '../auth/supabaseClient';
import NavBar from '../components/Navbar';
import { useStoreSecret, selectorSecret } from '../store';

function Layout({ children }: { children: React.ReactNode }) {
	const { setSession } = useStoreSecret(selectorSecret, shallow);
	const supabase = useSupabase();

	useEffect(() => {
		(async () => {
			const currentSession = await supabase.auth.getSession();
			if (currentSession.data.session) {
				setSession(currentSession.data.session);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<NavBar />
			<>{children}</>
		</div>
	);
}

export default Layout;
