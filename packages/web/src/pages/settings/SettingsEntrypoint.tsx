import React from 'react';
import ReactDOM from 'react-dom/client';

import Settings from './Settings';
import Layout from '../Layout';

import '../index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Layout>
			<Settings />
		</Layout>
	</React.StrictMode>,
);
