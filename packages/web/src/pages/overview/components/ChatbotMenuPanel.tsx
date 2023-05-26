import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';

import { ReactComponent as Loading } from '../../../assets/loading.svg';
import useSupabase from '../../../auth/supabaseClient';
import { SimpleWorkflow } from '../../../db/dbTypes';
import { RFState } from '../../../store/useStore';

export default function ChatbotMenuPanel({
	showPanel,
	setShowPanel,
	chatbot,
	setNotificationMessage,
	workflows,
	setWorkflows,
	propertyName,
}: {
	showPanel: boolean;
	setShowPanel: (x: boolean) => void;
	chatbot?: SimpleWorkflow;
	setNotificationMessage: RFState['setNotificationMessage'];
	workflows: RFState['workflows'];
	setWorkflows: RFState['setWorkflows'];
	propertyName: string;
}) {
	const inputRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const supabase = useSupabase();
	const [value, setValue] = useState<string>(
		chatbot ? (chatbot[propertyName as keyof SimpleWorkflow] as string) : '',
	);

	useEffect(() => {
		if (showPanel) {
			setValue(chatbot ? (chatbot[propertyName as keyof SimpleWorkflow] as string) : '');
		}
	}, [chatbot, propertyName, showPanel]);

	async function handleSubmit() {
		setIsLoading(true);
		if (!chatbot) {
			setNotificationMessage(`Error updating workflow name`);
			setIsLoading(false);
			return;
		}
		const { error: updateCurrentWorkflowError } = await supabase
			.from('workflows')
			.update({
				[propertyName]: value,
			})
			.eq('id', chatbot.id);

		if (updateCurrentWorkflowError) {
			setNotificationMessage(`Error updating workflow name ${updateCurrentWorkflowError}`);
			setIsLoading(false);
			return;
		}
		const newWorkflows = [...workflows];
		// find the workflow with the id of workflowId
		const workflowIndex = newWorkflows.findIndex((workflow) => workflow.id === chatbot.id);

		if (workflowIndex === -1) {
			setNotificationMessage(`Error updating workflow name`);
			setIsLoading(false);
			return;
		}

		(newWorkflows[workflowIndex] as any)[propertyName] = value;
		setWorkflows(newWorkflows);
		setIsLoading(false);
	}

	return (
		<Transition.Root show={showPanel} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={inputRef}
				onClose={setShowPanel}
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
					<div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" />
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="flex flex-col gap-4 bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
									<div className="sm:flex sm:items-start">
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title
												as="h3"
												className="text-2xl font-semibold leading-6 text-slate-900"
											>
												Rename
											</Dialog.Title>
										</div>
									</div>
									<div className="sm:ml-4">
										<label htmlFor={propertyName} className="sr-only">
											{propertyName}
										</label>
										<input
											type="text"
											ref={inputRef}
											name={propertyName}
											id={propertyName}
											autoComplete="off"
											onChange={(e) => {
												setValue(e.target.value);
											}}
											onKeyDown={async (e) => {
												if (e.key === 'Enter') {
													await handleSubmit();
													setShowPanel(false);
												}
											}}
											className="block w-full rounded-md border-0 px-4 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
											value={value}
										/>
									</div>
								</div>
								<div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
										onClick={async () => {
											await handleSubmit();
											setShowPanel(false);
										}}
									>
										OK
									</button>
									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
										onClick={() => setShowPanel(false)}
									>
										Cancel
									</button>
									{isLoading && (
										<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
									)}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
