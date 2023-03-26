import { Router, Route, useRoute } from 'wouter';

import NavBar from './components/Navbar';
import AuthGuard from './pages/Auth';
import Gallery from './pages/Gallery';
import MainApp from './pages/MainApp';

function App() {
	const [, params] = useRoute('/app/:id');

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
