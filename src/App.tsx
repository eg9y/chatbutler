import { Router, Route } from 'wouter';

import AuthGuard from './pages/Auth';
import Gallery from './pages/Gallery';
import MainApp from './pages/MainApp';

function App() {
	return (
		<Router>
			<div>
				<Route path="/gallery" component={Gallery} />
				<Route path="/" component={MainApp} />
				<Route path="/auth" component={AuthGuard} />
			</div>
		</Router>
	);
}

export default App;
