import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { ReactComponent as Loading } from '../assets/loading.svg';

export default function LoadingOverlay({ open }: { open: boolean }) {
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
					<div className="fixed inset-0 mt-[5vh] h-[95vh] bg-slate-900 bg-opacity-25 backdrop-blur-sm transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0  z-10 mt-[5vh] h-[95vh] overflow-y-auto ">
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
							<Dialog.Panel className="relative flex transform gap-4 overflow-hidden rounded-lg bg-slate-50 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<div>Loading</div>
								<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
