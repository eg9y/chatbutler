import React from 'react';
import ReactDOM from 'react-dom/client';

import Overview from './Overview';
import Layout from '../Layout';

import '../index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Layout>
			<Overview />
		</Layout>
	</React.StrictMode>,
);
