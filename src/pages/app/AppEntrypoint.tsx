import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Router } from 'wouter';

import App from './App';
import Layout from '../Layout';

import '../index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Layout>
			<Router>
				<Route path="/">
					<App />
				</Route>
				<Route path="/app/:user_id/:id">
					<App />
				</Route>
			</Router>
		</Layout>
	</React.StrictMode>,
);
