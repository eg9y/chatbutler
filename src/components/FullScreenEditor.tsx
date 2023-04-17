import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
					<div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
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
								bg-slate-50 px-4 shadow-xl transition-all sm:my-2 sm:w-full sm:max-w-4xl sm:p-6 whitespace-pre-wrap
                            "
							>
								<div>
									<div
										style={{
											height: '85vh',
										}}
										className="mt-3 sm:mt-5 flex flex-col  text-justify"
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
