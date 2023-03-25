import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Edge } from 'reactflow';
import { CustomNode } from '../nodes/types/NodeTypes';
import supabase from '../auth/supabaseClient';
import { shallow } from 'zustand/shallow';
import useStore, { selector } from '../store/useStore';
import { nanoid } from 'nanoid';

export default function UserWorkflows({
	setWorkflows,
	setWorkflowId,
	open,
	setOpen,
}: {
	setWorkflows: (workflows: { id: string; name: string }[]) => void;
	setWorkflowId: (workflowId: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const {
		setUiErrorMessage,
		workflows,
		setNodes,
		setEdges,
		setWorkflowName,
		workflowId,
		nodes,
		edges,
	} = useStore(selector, shallow);

	const GridList = () => {
		return (
			<ul
				role="list"
				className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
			>
				{workflows.map((workflow) => (
					<li
						key={workflow.id}
						className="col-span-1 flex flex-col divide-y divide-gray-300 rounded-lg bg-white text-center 
                        shadow border-1 border-slate-400"
					>
						<div className="flex flex-1 flex-col p-8">
							<h3 className="mt-6 text-sm font-medium text-gray-900">
								{workflow.name}
							</h3>
						</div>
						<div>
							<div className="-mt-px flex divide-x divide-gray-300">
								<div className="flex w-0 flex-1">
									<a
										className="relative -mr-px inline-flex w-0 flex-1 items-center 
                                        cursor-pointer hover:bg-slate-200
                                    justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
										onClick={async () => {
											const { error: updateCurrentWorkflowError } =
												await supabase
													.from('workflows')
													.update({
														edges: JSON.parse(JSON.stringify(edges)),
														nodes: JSON.parse(JSON.stringify(nodes)),
													})
													.eq('id', workflowId);

											if (updateCurrentWorkflowError) {
												setUiErrorMessage(
													updateCurrentWorkflowError.message,
												);
												return;
											}
											// set new workflowId;
											setWorkflowId(workflow.id);
											// fetch workflow from supabase
											const { data, error } = await supabase
												.from('workflows')
												.select('nodes, edges, name')
												.eq('id', workflow.id)
												.single();

											if (error) {
												setUiErrorMessage(error.message);
											}
											if (data) {
												// set graph
												if (typeof data.nodes === 'string') {
													setNodes(JSON.parse(data.nodes as string));
												} else {
													setNodes(data.nodes as unknown as CustomNode[]);
												}
												if (typeof data.edges === 'string') {
													setEdges(JSON.parse(data.edges as string));
												} else {
													setEdges(data.edges as unknown as Edge<any>[]);
												}
												setWorkflowName(data.name);
												setOpen(false);
											}
										}}
									>
										<span className="truncate">Select</span>
									</a>
								</div>
								<div className="-ml-px flex w-0 flex-1">
									<a
										className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border 
                                    border-transparent py-4 text-sm font-semibold text-gray-900 cursor-pointer hover:bg-slate-200"
										onClick={async () => {
											setWorkflows(
												workflows.filter((w) => w.id !== workflow.id),
											);
											await supabase
												.from('workflows')
												.delete()
												.eq('id', workflow.id);
										}}
									>
										Delete
									</a>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		);
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel
								style={{
									height: '70vh',
								}}
								className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-full sm:p-6 mx-10 flex flex-col"
							>
								<Dialog.Title
									as="h3"
									className="text-3xl font-semibold leading-6 text-gray-900 pb-4"
								>
									Your Workflows
								</Dialog.Title>
								<GridList />
								<div className="mt-5 sm:mt-6 flex flex-col grow items-end justify-end">
									<a
										className="group p-2 flex items-center rounded-md text-xl font-medium text-slate-100 
									bg-green-500 hover:bg-green-400  cursor-pointer "
										onClick={async () => {
											const id = nanoid();
											const user = await supabase.auth.getUser();
											const { data, error } = await supabase
												.from('workflows')
												.insert({
													name: `New Workflow ${id}`,
													id,
													user_id: user.data.user?.id,
												})
												.select()
												.single();
											if (data) {
												setWorkflows([
													...workflows,
													{
														id: data.id,
														name: data.name,
													},
												]);
											} else if (error) {
												setUiErrorMessage(error.message);
											}
										}}
									>
										<PlusIcon
											className={
												'text-slate-100  -ml-1 mr-3 h-6 w-6 flex-shrink-0'
											}
											aria-hidden="true"
										/>
										<span className="truncate">Add workflow</span>
									</a>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
