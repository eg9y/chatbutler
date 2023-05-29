import { Dialog, Switch, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
import { useStoreSecret, selectorSecret } from '../store';
import { conditionalClassNames } from '../utils/classNames';

export default function ApiKeySettings({
	open,
	supabase,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	supabase: any;
}) {
	const { openAiKey, setOpenAiKey, session, setSession } = useStoreSecret(
		selectorSecret,
		shallow,
	);
	const [newApiKey, setNewApiKey] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [helperMessage, setHelperMessage] = useState('');
	const [isEditWithMyKey, setIsEditWithMyKey] = useState<boolean | null>(null);

	useEffect(() => {
		if (session && isEditWithMyKey === null) {
			setIsEditWithMyKey(!!session.user.user_metadata.is_edit_with_my_key);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	async function handleChange() {
		setIsLoading(true);

		// update user's openai key
		if (newApiKey === '') {
			console.log('No key entered');
		} else {
			await supabase.functions.invoke('insert-api-key', {
				body: {
					api_key: newApiKey,
				},
			});
			setOpenAiKey(newApiKey);
		}

		// edit here
		setIsLoading(false);
		setOpen(false);
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				onClose={() => {
					return;
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
					<div className="fixed inset-0 bg-slate-900 bg-opacity-75 backdrop-blur-md transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto ">
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<div>
									<p className="block text-sm font-medium leading-6 text-gray-900">
										Set how you want to call OpenAI API
									</p>
									<div className="mt-2">
										<Switch.Group as="div" className="flex items-center">
											<Switch
												checked={!!isEditWithMyKey}
												onChange={async () => {
													setIsEditWithMyKey(!isEditWithMyKey);
													// update user edit_with_api_key metadata. This will inform the supabase proxy to use the user's key instead of the app's key
													const { data, error } =
														await supabase.auth.updateUser({
															data: {
																edit_with_api_key: !isEditWithMyKey,
															},
														});

													if (error) {
														setHelperMessage(error.message);
														return;
													}
													if (!data) {
														setHelperMessage(
															'Your settings have not been updated. ERROR',
														);
														return;
													}

													if (session) {
														const newSession = { ...session };
														if (newSession.user) {
															newSession.user.user_metadata.edit_with_api_key =
																!isEditWithMyKey;
															setSession(newSession);
														}
													} else {
														setHelperMessage(
															'Your settings have not been updated. ERROR',
														);
														return;
													}
												}}
												className={conditionalClassNames(
													isEditWithMyKey
														? 'bg-green-600'
														: 'bg-gray-200',
													'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2',
												)}
											>
												<span
													aria-hidden="true"
													className={conditionalClassNames(
														isEditWithMyKey
															? 'translate-x-5'
															: 'translate-x-0',
														'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
													)}
												/>
											</Switch>
											<Switch.Label as="span" className="ml-1 text-sm">
												<span className="font-medium text-slate-700">
													Edit with my key
												</span>
											</Switch.Label>
										</Switch.Group>
										{isEditWithMyKey && (
											<form
												className="flex flex-col gap-1 pt-4"
												onSubmit={async (e) => {
													e.preventDefault();
													await handleChange();
												}}
											>
												<label
													htmlFor="openAiKey"
													className="block text-sm font-medium leading-6 text-gray-900"
												>
													OpenAI Key
												</label>
												<input
													type="openAiKey"
													name="openAiKey"
													id="openAiKey"
													value={openAiKey}
													onChange={(e) => {
														const input = e.target.value;
														setNewApiKey(input);
													}}
													placeholder="sk-************"
													className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
													aria-describedby="username-description"
												/>
												{isLoading && (
													<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
												)}
											</form>
										)}
									</div>
									<p
										className="mt-2 text-sm text-red-500"
										id="username-description"
									>
										{helperMessage}
									</p>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => {
												if (
													session &&
													session.user &&
													session.user.user_metadata
												) {
													delete session.user.user_metadata
														.is_edit_with_my_key;
												}
												setOpen(false);
											}}
											className="rounded-md bg-red-100 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-200"
										>
											Cancel
										</button>
										<button
											type="button"
											onClick={async () => {
												await handleChange();
											}}
											className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
										>
											OK
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
