import { useEffect } from 'react';
import { Router, Route, useRoute } from 'wouter';
import { shallow } from 'zustand/shallow';

import supabase from './auth/supabaseClient';
import NavBar from './components/Navbar';
import AuthGuard from './pages/Auth';
import Gallery from './pages/Gallery';
import MainApp from './pages/MainApp';
import useStore, { selector } from './store/useStore';

function App() {
	const { setSession } = useStore(selector, shallow);

	const [, params] = useRoute('/app/:id');

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
			<Router>
				<Route path="/">
					<MainApp params={params} />
				</Route>
				<Route path="/app/:id">
					<MainApp params={params} />
				</Route>
				<Route path="/gallery" component={Gallery} />
				<Route path="/auth" component={AuthGuard} />
			</Router>
		</div>
	);
}

export default App;
