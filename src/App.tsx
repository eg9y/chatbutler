import { Router, Route } from 'wouter';
import AuthGuard from './pages/Auth';
import MainApp from './pages/MainApp';

function App() {
	return (
		<Router>
			<div>
				<Route path="/" component={MainApp} />
				<Route path="/auth" component={AuthGuard} />
			</div>
		</Router>
	);
}

export default App;
