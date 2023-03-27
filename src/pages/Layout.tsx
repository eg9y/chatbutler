import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import supabase from '../auth/supabaseClient';
import NavBar from '../components/Navbar';
import useStore, { selector } from '../store/useStore';

function Layout({ children }: { children: React.ReactNode }) {
	const { setSession } = useStore(selector, shallow);
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
