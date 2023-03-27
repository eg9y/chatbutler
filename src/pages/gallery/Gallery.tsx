import { useEffect, useState } from 'react';

import getUrl from '../../auth/getUrl';

export default function Gallery() {
	const [publicWorkflows, setPublicWorkflows] = useState<
		{
			id: string;
			name: string;
			user_id: string;
			description: string | null;
		}[]
	>([]);
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

			// const mock = [
			// 	{
			// 		id: 'ytJrgJM3K-XrJHIo1Wfok',
			// 		name: 'customer support workflow',
			// 	},
			// 	{
			// 		id: 'l_vZ-onDE9kqbmv3uX-IP',
			// 		name: 'prompterinod',
			// 	},
			// ];
			// setPublicWorkflows(mock);

			setIsLoading(false);
		})();
	}, []);
	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl py-10 px-20 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-20">
				<h1 className="text-2xl font-bold mb-6">Sandbox Gallery</h1>
				{isLoading ? <div>Loading...</div> : <Card publicWorkflows={publicWorkflows} />}
			</div>
		</div>
	);
}

const Card = ({
	publicWorkflows,
}: {
	publicWorkflows: {
		id: string;
		name: string;
		user_id: string;
		description: string | null;
	}[];
}) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{publicWorkflows.map((item, index) => (
				<div
					key={index}
					className="border-1 border-slate-300
					cursor-pointer shadow-md
					hover:shadow-lg transition-shadow duration-300 ease-in-out
					flex flex-col
					"
				>
					<div className="bg-white rounded-md  p-4 items-center justify-center space-y-4 grow">
						{/* {item.image ? (
							<img
								src={item.image}
								alt={item.name}
								className="w-full h-48 object-cover rounded-md"
							/>
						) : (
							)} */}
						<div className="w-full h-48 bg-slate-300 rounded-md"></div>
						<h2 className="text-xl font-semibold">{item.name}</h2>
						<p className="text-sm">
							{item?.description}
							-description goes here-
						</p>
					</div>
					<div className="flex border-t-1 border-slate-300 w-full">
						<div className="flex w-0 flex-1 border-r-1 border-slate-300">
							<a
								className="relative -mr-px inline-flex w-0 flex-1 items-center 
                                        cursor-pointer hover:bg-slate-200
                                    justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900"
								onClick={async () => {
									window.open(
										`/?user_id=${item.user_id}&id=${item.id}`,
										'_blank',
									);
								}}
							>
								<span className="truncate">Open</span>
							</a>
						</div>
						<div className="flex w-0 flex-1">
							<a
								className="relative -mr-px inline-flex w-0 flex-1 items-center 
                                        cursor-pointer hover:bg-slate-200
                                    justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900"
								onClick={async () => {
									console.log('placeholder');
								}}
							>
								<span className="truncate">Description</span>
							</a>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
