import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { nanoid } from 'nanoid';
import { Fragment, useState } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
import useSupabase from '../auth/supabaseClient';
import { SimpleWorkflow, GlobalVariableType } from '../db/dbTypes';
import selectWorkflow from '../db/selectWorkflow';
import { CustomNode } from '../nodes/types/NodeTypes';
import { useStore, useStoreSecret, selectorSecret, selector } from '../store';
import { RFState } from '../store/useStore';

export default function UserWorkflows({
	currentWorkflow,
	setWorkflows,
	setCurrentWorkflow,
	open,
	setOpen,
	reactFlowInstance,
}: {
	currentWorkflow: RFState['currentWorkflow'];
	setWorkflows: RFState['setWorkflows'];
	setCurrentWorkflow: RFState['setCurrentWorkflow'];
	open: boolean;
	setOpen: (open: boolean) => void;
	reactFlowInstance: RFState['reactFlowInstance'];
}) {
	const { setUiErrorMessage, setGlobalVariables, workflows, setNodes, setEdges, nodes, edges } =
		useStore(selector, shallow);
	const { session } = useStoreSecret(selectorSecret, shallow);

	const supabase = useSupabase();

	const [isLoading, setIsLoading] = useState(false);

	const [workflowNameWindowOpen, setWorkflowNameWindowOpen] = useState(false);
	const [newWorkflowId, setNewWorkflowId] = useState('');

	const GridList = () => {
		return (
			<ul
				role="list"
				className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
			>
				{workflows.map((workflow) => (
					<li
						key={workflow.id}
						className="col-span-1 flex flex-col divide-y divide-gray-300 rounded-lg border-1 border-slate-400 
					bg-white text-center shadow"
					>
						<div className="flex flex-1 flex-col p-2">
							<h3 className="mt-6 text-sm font-medium text-gray-900">
								{workflow.name}
							</h3>
						</div>
						<div>
							<div className="-mt-px flex divide-x divide-gray-300">
								<div className="flex w-0 flex-1">
									<a
										className="relative -mr-px inline-flex w-0 flex-1 cursor-pointer 
                                        items-center justify-center
                                    gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-slate-200"
										onClick={() =>
											openWorkflow(
												setIsLoading,
												workflow,
												nodes,
												edges,
												currentWorkflow,
												setUiErrorMessage,
												setCurrentWorkflow,
												setGlobalVariables,
												setNodes,
												setEdges,
												supabase,
												setOpen,
												open,
												reactFlowInstance,
											)
										}
									>
										<span className="truncate">Open</span>
									</a>
								</div>
								<div className="-ml-px flex w-0 flex-1">
									<a
										className="relative inline-flex w-0 flex-1 cursor-pointer items-center justify-center gap-x-3 rounded-br-lg 
                                    border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-slate-200"
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
			<Dialog
				as="div"
				className="relative z-10"
				onClose={(close) => {
					if (currentWorkflow === null || workflowNameWindowOpen) {
						return false;
					}
					setOpen(close);
				}}
			>
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
									height: workflowNameWindowOpen ? '20vh' : '70vh',
									width: workflowNameWindowOpen ? '20vw' : '100%',
								}}
								className="relative mx-10 flex max-w-full transform flex-col overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6"
							>
								{workflowNameWindowOpen && (
									<>
										<Dialog.Title
											as="h3"
											className="flex gap-2 pb-4 text-xl font-semibold leading-6 text-gray-900"
										>
											Chatbot name?
											<span>
												{isLoading && (
													<Loading className="-ml-1 mr-3 h-7 w-7 animate-spin text-black" />
												)}
											</span>
										</Dialog.Title>
										<form
											className="flex h-full flex-col items-start justify-between gap-2"
											onSubmit={async (e) => {
												e.preventDefault();
												setIsLoading(true);
												const target = e.target as typeof e.target & {
													name: { value: string };
												};
												const name = target.name.value;
												const { error: updateCurrentWorkflowError } =
													await supabase
														.from('workflows')
														.update({
															name,
														})
														.eq('id', newWorkflowId);

												if (updateCurrentWorkflowError) {
													setUiErrorMessage(
														`Error updating workflow name ${updateCurrentWorkflowError}`,
													);
													setIsLoading(false);
													return;
												}
												await openWorkflow(
													setIsLoading,
													{
														id: newWorkflowId,
														name,
													},
													nodes,
													edges,
													currentWorkflow,
													setUiErrorMessage,
													setCurrentWorkflow,
													setGlobalVariables,
													setNodes,
													setEdges,
													supabase,
													setOpen,
													open,
													reactFlowInstance,
												);
												const newWorkflows = [...workflows];
												newWorkflows[newWorkflows.length - 1].name = name;
												setWorkflows(newWorkflows);
												setWorkflowNameWindowOpen(false);
											}}
										>
											<input
												type="name"
												name="name"
												id="name"
												autoFocus={true}
												autoComplete="off"
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
												placeholder="chatbot name"
											/>
											<button
												type="submit"
												className="text-md group w-full cursor-pointer rounded-md bg-green-500 
									p-2 font-medium  text-slate-100 hover:bg-green-400"
											>
												<span className="truncate">Set</span>
											</button>
										</form>
									</>
								)}
								{!workflowNameWindowOpen && (
									<>
										<Dialog.Title
											as="h3"
											className="flex gap-2 pb-4 text-3xl font-semibold leading-6 text-gray-900"
										>
											My Chatbots
											<span>
												{isLoading && (
													<Loading className="-ml-1 mr-3 h-7 w-7 animate-spin text-black" />
												)}
											</span>
										</Dialog.Title>
										<GridList />
										<div className="mt-5 flex grow flex-col items-end justify-end sm:mt-6">
											<a
												className="group flex cursor-pointer items-center rounded-md bg-green-500 p-2 text-xl 
									font-medium text-slate-100  hover:bg-green-400 "
												onClick={async () => {
													const id = nanoid();
													const { data, error } = await supabase
														.from('workflows')
														.insert({
															name: `New ${id}`,
															id,
															// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
															user_id: session!.user.id,
														})
														.select()
														.single();
													if (data) {
														setWorkflows([
															...workflows,
															{
																id: data.id,
																name: data.name,
																description: '',
																is_public: true,
																user_id: data.user_id,
																updated_at: data.updated_at,
															},
														]);
														setWorkflowNameWindowOpen(true);
													} else if (error) {
														setUiErrorMessage(error.message);
													}
													setNewWorkflowId(id);
												}}
											>
												<PlusIcon
													className={
														'-ml-1  mr-3 h-6 w-6 flex-shrink-0 text-slate-100'
													}
													aria-hidden="true"
												/>
												<span className="truncate">New Chatbot</span>
											</a>
										</div>
									</>
								)}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
async function openWorkflow(
	setIsLoading: (loading: boolean) => void,
	workflow: { id: string; name: string },
	nodes: CustomNode[],
	edges: RFState['edges'],
	currentWorkflow: SimpleWorkflow | null,
	setUiErrorMessage: (message: string | null) => void,
	setCurrentWorkflow: (workflow: SimpleWorkflow | null) => void,
	setGlobalVariables: (variables: GlobalVariableType) => void,
	setNodes: (nodes: CustomNode[]) => void,
	setEdges: RFState['setEdges'],
	supabase: any,
	setOpen: (open: boolean) => void,
	open: boolean,
	reactFlowInstance: ReactFlowInstance | null,
) {
	setIsLoading(true);
	await selectWorkflow(
		workflow.id,
		nodes,
		edges,
		currentWorkflow,
		setUiErrorMessage,
		setCurrentWorkflow,
		setGlobalVariables,
		setNodes,
		setEdges,
		supabase,
	);
	setOpen(false);
	setIsLoading(false);
	if (!open && reactFlowInstance && 'fitView' in reactFlowInstance) {
		reactFlowInstance.fitView();
		reactFlowInstance.zoomOut();
	}
}
