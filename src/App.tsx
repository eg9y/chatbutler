import { useEffect } from 'react';
import { Edge } from 'reactflow';
import { Router, Route } from 'wouter';
import { shallow } from 'zustand/shallow';
import useStore, { selector } from './store/useStore';

import supabase from './auth/supabaseClient';
import { CustomNode } from './nodes/types/NodeTypes';
import AuthGuard from './pages/Auth';
import MainApp from './pages/MainApp';
import { Inputs } from './nodes/types/Input';
import { useDebouncedEffect } from './utils/useDebouncedEffect';

async function syncDataToSupabase(
	nodes: CustomNode[],
	edges: Edge<any>[],
	workflowName: string,
	workflowId: string,
	setWorkflowId: (id: string) => void,
) {
	const user = await supabase.auth.getUser();
	if (user) {
		if (user.error) {
			console.error('Error fetching user from Supabase:', user.error);
			return;
		}
		const { data: workflowEntry, error: workflowError } = await supabase
			.from('workflows')
			.select('id')
			.eq('id', workflowId)
			.select()
			.single();

		if (workflowError) {
			console.error('Error fetching workflows from Supabase:', workflowError);
			if (workflowError.code != 'PGRST116') {
				return;
			}
		}

		// user just signed up and has no workflows in the db
		if (!workflowEntry) {
			const { data, error } = await supabase
				.from('workflows')
				.insert({
					id: workflowId,
					name: `${user.data.user.email} workflow`,
					nodes: JSON.stringify(nodes),
					edges: JSON.stringify(edges),
					user_id: user.data.user.id,
				})
				.select()
				.single();

			if (data) {
				setWorkflowId(data.id);
			} else if (error) {
				console.error('Error syncing data to Supabase:', error);
			}
			return;
		} else {
			const { error } = await supabase
				.from('workflows')
				.update({
					edges: JSON.parse(JSON.stringify(edges)),
					nodes: JSON.parse(JSON.stringify(nodes)),
					name: workflowName,
				})
				.eq('id', workflowEntry.id)
				.select();
			if (error) {
				console.error('Error syncing data to Supabase:', error);
			}
		}
	}
}

function App() {
	const {
		nodes,
		edges,
		workflowId,
		setWorkflowId,
		workflowName,
		setWorkflowName,
		setNodes,
		setEdges,
	} = useStore(selector, shallow);

	useDebouncedEffect(
		() => {
			(async () => {
				const isLoggedIn = await supabase.auth.getSession();
				if (!isLoggedIn.data.session) {
					return;
				}
				await syncDataToSupabase(nodes, edges, workflowName, workflowId, setWorkflowId);
			})();
		},
		[nodes, edges, workflowId, workflowName],
		3000,
	);

	useEffect(() => {
		(async () => {
			const isLoggedIn = await supabase.auth.getSession();
			if (!isLoggedIn.data.session) {
				return;
			}
			const user = await supabase.auth.getUser();
			if (user) {
				if (user.error) {
					console.error('Error fetching user from Supabase:', user.error);
					return;
				}
				const { data: workflowEntry, error: workflowError } = await supabase
					.from('workflows')
					.select('id')
					.order('created_at', { ascending: false });

				if (workflowError) {
					console.error('Error fetching workflows from Supabase:', workflowError);
					return;
				}

				// user just signs up and has a workflow in the db, fetch the latest one
				if (workflowEntry.length) {
					const { data: latestWorkflow, error: latestWorkflowError } = await supabase
						.from('workflows')
						.select('name, nodes, edges, id')
						.eq('id', workflowEntry[0].id)
						.order('created_at', { ascending: false })
						.single();
					if (latestWorkflowError) {
						console.error(
							'Error fetching latest workflow from Supabase:',
							latestWorkflowError,
						);
						return;
					}
					if (latestWorkflow) {
						const name = latestWorkflow.name;
						let nodes: any = latestWorkflow.nodes;
						const edges: Edge<any>[] = latestWorkflow.edges as any;

						if (nodes && edges) {
							nodes = nodes.map((node: CustomNode) => {
								if ('inputs' in node.data) {
									return {
										...node,
										data: {
											...node.data,
											inputs: new Inputs(
												node.data.inputs.inputs,
												node.data.inputs.inputExamples,
											),
										},
									};
								}
								return {
									...node,
								};
							});
							setNodes(nodes);
							setEdges(edges);
							setWorkflowId(latestWorkflow.id);
							setWorkflowName(name);
						}
					}
				}
			}
		})();
	}, [setEdges, setNodes, setWorkflowId, setWorkflowName]);

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
