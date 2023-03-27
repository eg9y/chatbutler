import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import './index.css';

import routes from '~react-pages';

// eslint-disable-next-line no-console
// console.log(routes);

function App() {
	return <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = createRoot(document.getElementById('root')!);

app.render(
	<StrictMode>
		<Router>
			<App />
		</Router>
	</StrictMode>,
);
