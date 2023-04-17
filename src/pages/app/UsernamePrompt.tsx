import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import { ReactComponent as Loading } from '../../assets/loading.svg';
import { RFState } from '../../store/useStore';

export default function UsernamePrompt({
	open,
	supabase,
	session,
	setShowUsernamePrompt,
	setUsername,
}: {
	open: boolean;
	supabase: any;
	session: any;
	setShowUsernamePrompt: any;
	setUsername: RFState['setUsername'];
}) {
	const [currentUsername, setCurrentUsername] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [helperMessage, setHelperMessage] = useState('');

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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-50 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<div>
									<label
										htmlFor="username"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Welcome! Please set your username
									</label>
									<div className="mt-2">
										<form
											className="flex gap-1"
											onSubmit={async (e) => {
												e.preventDefault();
												setIsLoading(true);

												if (
													currentUsername.length < 4 ||
													currentUsername.length > 20
												) {
													setHelperMessage(
														'Username must be between 4 and 20 characters.',
													);
													setIsLoading(false);

													return;
												}
												if (currentUsername.match(/[^a-zA-Z0-9]/)) {
													setHelperMessage(
														'Username must only contain letters and numbers.',
													);
													setIsLoading(false);

													return;
												}

												const { error } = await supabase
													.from('profiles')
													.update({ first_name: currentUsername })
													.eq('id', session?.user?.id);
												if (error) {
													setHelperMessage(error.message);
												} else {
													setShowUsernamePrompt(false);
													setUsername(currentUsername);
												}
												setIsLoading(false);
											}}
										>
											<input
												type="username"
												name="username"
												id="username"
												value={currentUsername}
												onChange={(e) => {
													const input = e.target.value;
													setCurrentUsername(input);
												}}
												className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
												aria-describedby="username-description"
											/>
											{isLoading && (
												<Loading className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" />
											)}
										</form>
									</div>
									<p
										className="mt-2 text-sm text-red-500"
										id="username-description"
									>
										{helperMessage}
									</p>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
