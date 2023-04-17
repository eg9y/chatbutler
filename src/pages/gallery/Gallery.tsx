import { useEffect, useState } from 'react';

import getUrl from '../../auth/getUrl';

type PublicWorkflow = {
	id: string;
	name: string;
	user_id: string;
	profiles: {
		id: string;
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

			// const mock = [
			// 	{
			// 		id: 'EG6-bga91c5hhOe4YDsW1',
			// 		name: 'Blog Creator',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		profiles: {
			// 			id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'UzCt7JNdfaIeffI2VLuvD',
			// 		name: 'Story Creator',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		profiles: {
			// 			id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: '7jBsYucmH9vHKACylHgau',
			// 		name: 'Tutorial',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		profiles: {
			// 			id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'mw-7tqgT4Nnlx8EVpzbZ6',
			// 		name: 'paraphrase',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		profiles: {
			// 			id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 			first_name: 'egan',
			// 		},
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

const Card = ({ publicWorkflows }: { publicWorkflows: PublicWorkflow[] }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{publicWorkflows.map((item, index) => (
				<div
					key={index}
					className="border-1 border-slate-300
					shadow-md
					hover:shadow-lg transition-shadow duration-300 ease-in-out
					flex flex-col
					"
				>
					<div className="bg-white flex flex-col rounded-md p-4 items-start justify-center space-y-4 grow">
						{/* {item.image ? (
							<img
								src={item.image}
								alt={item.name}
								className="w-full h-48 object-cover rounded-md"
							/>
						) : (
							)} */}
						<div className="w-full h-48 bg-slate-300 rounded-md"></div>
						<div className="flex flex-col gap-1">
							<p className="text-xs text-slate-500">{item.profiles?.first_name}</p>
							<h2 className="text-xl font-semibold">{item.name}</h2>
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-sm">
								{item?.description}
								-description goes here-
							</p>
							<a className="text-blue-600 text-sm cursor-pointer">Read more...</a>
						</div>
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
								<span className="truncate">Sandbox</span>
							</a>
						</div>
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
								<span className="truncate">App</span>
							</a>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
