import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function FullScreenEditor({
	heading,
	showFullScreen,
	setShowFullScreen,
	children,
}: {
	heading: string;
	showFullScreen: boolean;
	setShowFullScreen: (showFullScreen: boolean) => void;
	children: React.ReactNode;
}) {
	return (
		<Transition.Root show={showFullScreen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setShowFullScreen}>
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
								className="h-full relative transform overflow-hidden rounded-lg 
								bg-white px-4 pt-5 pb-4 
                            text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6
                            "
							>
								<div>
									<div
										style={{
											height: '80vh',
										}}
										className="mt-3 text-center sm:mt-5 flex flex-col"
									>
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											{heading}
										</Dialog.Title>
										{children}
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
