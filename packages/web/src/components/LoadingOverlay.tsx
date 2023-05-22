import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { ReactComponent as Loading } from '../assets/loading.svg';

export default function LoadingOverlay({ open }: { open: boolean }) {
	return (
		<Dialog
			as="div"
			style={{
				zIndex: 30,
			}}
			open={open}
			className="relative"
			onClose={() => {
				return;
			}}
		>
			<div className="fixed inset-0 mt-[5vh] h-[95vh] bg-slate-900 bg-opacity-25 backdrop-blur-sm transition-opacity" />
			<div
				style={{
					zIndex: 30,
				}}
				className="fixed inset-0 mt-[5vh] h-[95vh] overflow-y-auto "
			>
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<Dialog.Panel className="relative flex transform gap-4 overflow-hidden rounded-lg bg-slate-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
						<div>Loading</div>
						<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
					</Dialog.Panel>
				</div>
			</div>
		</Dialog>
	);
}
