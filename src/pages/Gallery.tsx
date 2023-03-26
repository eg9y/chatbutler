import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

const navigation = [
	{ name: 'Workflow Builder', href: '/' },
	{ name: 'About', href: '/' },
];

const Card = ({
	items,
	setIsLoading,
}: {
	items: {
		id: string;
		name: string;
		description?: string;
		image?: string;
	}[];
	setIsLoading: (isLoading: boolean) => void;
}) => {
	const [, setLocation] = useLocation();
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{items.map((item, index) => (
				<div
					key={index}
					className="bg-white rounded-md shadow-md p-4 
					flex flex-col items-center justify-center space-y-4
					border-1 border-slate-300
					cursor-pointer
					hover:bg-slate-100 hover:shadow-lg transition-shadow duration-300 ease-in-out"
					onClick={async () => {
						setIsLoading(true);
						setIsLoading(false);
						setLocation(`/app/${item.id}`);
					}}
				>
					{item.image ? (
						<img
							src={item.image}
							alt={item.name}
							className="w-full h-48 object-cover rounded-md"
						/>
					) : (
						<div className="w-full h-48 bg-slate-300 rounded-md"></div>
					)}
					<h2 className="text-xl font-semibold">{item.name}</h2>
					<p className="text-center">{item?.description}</p>
				</div>
			))}
		</div>
	);
};

export default function Gallery() {
	const [publicWorkflows, setPublicWorkflows] = useState<
		{
			id: string;
			name: string;
			description?: string;
			image?: string;
		}[]
	>([]);
	const [, setLocation] = useLocation();
	const [isLoading, setIsLoading] = useState(false);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const goToLogin = () => {
		setLocation('/auth');
	};

	useEffect(() => {
		(async () => {
			const data = await fetch('http://localhost:3000/api/getWorkflows')
				.then((res) => {
					return res.json();
				})
				.catch((err) => console.error(err));
			setPublicWorkflows(data.data);

			const mock = [
				{
					id: 'ytJrgJM3K-XrJHIo1Wfok',
					name: 'customer support workflow',
				},
				{
					id: 'l_vZ-onDE9kqbmv3uX-IP',
					name: 'prompterinod',
				},
			];

			// setPublicWorkflows(mock);
		})();
	}, []);
	return (
		<div className="bg-white">
			<header className="bg-white">
				<nav
					className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
					aria-label="Global"
				>
					<div className="flex flex-1">
						<div className="hidden lg:flex lg:gap-x-12">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="text-sm font-semibold leading-6 text-gray-900 underline underline-offset-2"
								>
									{item.name}
								</a>
							))}
						</div>
						<div className="flex lg:hidden">
							<button
								type="button"
								className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
								onClick={() => setMobileMenuOpen(true)}
							>
								<span className="sr-only">Open main menu</span>
								<Bars3Icon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>
					</div>
					<a href="#" className="-m-1.5 p-1.5">
						<span className="text-xl font-bold">PromptSandbox.io</span>
					</a>
					<div className="flex flex-1 justify-end">
						<a
							href="#"
							className="text-sm font-semibold leading-6 text-gray-900"
							onClick={goToLogin}
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</nav>
				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<div className="fixed inset-0 z-10" />
					<Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
						<div className="flex items-center justify-between">
							<div className="flex flex-1">
								<button
									type="button"
									className="-m-2.5 rounded-md p-2.5 text-gray-700"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span className="sr-only">Close menu</span>
									<XMarkIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<a href="#" className="-m-1.5 p-1.5">
								<span className="sr-only">Your Company</span>
								<img
									className="h-8 w-auto"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
									alt=""
								/>
							</a>
							<div className="flex flex-1 justify-end">
								<a
									href="#"
									className="text-sm font-semibold leading-6 text-gray-900"
								>
									Log in <span aria-hidden="true">&rarr;</span>
								</a>
							</div>
						</div>
						<div className="mt-6 space-y-2">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
								>
									{item.name}
								</a>
							))}
						</div>
					</Dialog.Panel>
				</Dialog>
			</header>
			<div className="mx-auto max-w-2xl py-10 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<h1 className="text-2xl font-bold mb-6">Workflow Gallery</h1>
				<Card items={publicWorkflows} setIsLoading={setIsLoading} />
			</div>
		</div>
	);
}
