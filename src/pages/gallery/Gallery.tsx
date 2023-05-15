import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';

import getUrl from '../../auth/getUrl';
import { conditionalClassNames } from '../../utils/classNames';

type PublicWorkflow = {
	id: string;
	name: string;
	user_id: string;
	profiles: {
		first_name: string | null;
	} | null;
	description: string | null;
};

export default function Gallery() {
	const [publicWorkflows, setPublicWorkflows] = useState<PublicWorkflow[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			const data = await fetch(`${getUrl()}api/getWorkflows`)
				.then((res) => {
					return res.json();
				})
				.catch((err) => console.error(err));
			setPublicWorkflows(data.data);

			setIsLoading(false);
		})();
	}, []);
	return (
		<div className="mx-auto max-h-[95vh] max-w-2xl py-10 px-20 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-20">
			<h1 className="mb-6 text-2xl font-bold">Chatbot Gallery</h1>
			{isLoading ? <div>Loading...</div> : <Card publicWorkflows={publicWorkflows} />}
		</div>
	);
}

const Card = ({ publicWorkflows }: { publicWorkflows: PublicWorkflow[] }) => {
	return (
		<ul role="list" className="divide-y divide-gray-100">
			{publicWorkflows.map((chatbot) => (
				<li key={chatbot.id} className="flex items-center justify-between gap-x-6 py-5">
					<div className="min-w-0">
						<div className="flex items-start gap-x-3">
							<p className="text-sm font-semibold leading-6 text-gray-900">
								{chatbot.name}
							</p>
							<p
								className={conditionalClassNames(
									'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
								)}
							>
								test
							</p>
						</div>
						<div className="mt-1 flex flex-col gap-x-2 text-xs leading-5 text-gray-500">
							<p>{chatbot.description}</p>
							<p className="truncate">Created by {chatbot.profiles?.first_name}</p>
						</div>
					</div>
					<div className="flex flex-none items-center gap-x-4">
						<a
							onClick={() => {
								window.open(
									`/app/?user_id=${chatbot.user_id}&id=${chatbot.id}`,
									'_blank',
								);
							}}
							className="hidden cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
						>
							View chatbot<span className="sr-only">, {chatbot.name}</span>
						</a>
						<Menu as="div" className="relative flex-none">
							<Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
								<span className="sr-only">Open options</span>
								<EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
							</Menu.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={conditionalClassNames(
													active ? 'bg-gray-50' : '',
													'block px-3 py-1 text-sm leading-6 text-gray-900',
												)}
											>
												Make a copy
												<span className="sr-only">, {chatbot.name}</span>
											</a>
										)}
									</Menu.Item>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				</li>
			))}
		</ul>
	);
};
