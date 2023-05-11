import { useEffect, useState } from 'react';

import getUrl from '../../auth/getUrl';

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

			// const mock = [
			// 	{
			// 		id: 'ojjdItyQr9U7B1_csdyM7',
			// 		name: 'New ojjdItyQr9U7B1_csdyM7',
			// 		user_id: 'ad1649e0-0d89-4d19-ac0d-25cb43e6504f',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'mrjtconlin',
			// 		},
			// 	},
			// 	{
			// 		id: 'NRIyEbOyZ5St0Uuco-C5c',
			// 		name: 'New NRIyEbOyZ5St0Uuco-C5c',
			// 		user_id: 'af06a3ac-848f-4c08-b4dd-5c769ffaf0e3',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'DayDreamer',
			// 		},
			// 	},
			// 	{
			// 		id: 'y0XWK4_WaM8I8sX2wI_Gb',
			// 		name: 'BabyAGI Draft',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'npKTznEXHPlGSK8QHCUR0',
			// 		name: 'test google auth',
			// 		user_id: '8f3507a2-32d1-425f-9b7e-a51617615d77',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'tester',
			// 		},
			// 	},
			// 	{
			// 		id: 'nLncVoavjcuxqc9I9M7v1',
			// 		name: 'New nLncVoavjcuxqc9I9M7v1',
			// 		user_id: '31112d55-d1cc-4a37-ae90-86140dbf199a',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'BlockLm',
			// 		},
			// 	},
			// 	{
			// 		id: 'UXAq9i7nXWQpSdxpg3EFm',
			// 		name: 'New UXAq9i7nXWQpSdxpg3EFm',
			// 		user_id: '714656fa-dcf9-44ba-9338-3989b1fb3eb8',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'zweitsprache',
			// 		},
			// 	},
			// 	{
			// 		id: 'Pp3DEkLwchGfgVOWbBV6N',
			// 		name: 'Story Creator with Loops',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'eCrwdlAGjXdjGem69y4IR',
			// 		name: 'Blocks fiesta',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'Umy12KfGSmXVZ5LeUGCxZ',
			// 		name: 'New Umy12KfGSmXVZ5LeUGCxZ',
			// 		user_id: '0569f4aa-d208-45d9-bae3-138a59d637f8',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'Psoodoo',
			// 		},
			// 	},
			// 	{
			// 		id: 'Ec_x0y5Sne0rr14D9bl2V',
			// 		name: 'Blog creator',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'WPBnCHYrBk17-gWIuSRGT',
			// 		name: 'Story Creator Basic',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'krDNxfDO5wTrbq0-SQSup',
			// 		name: 'New krDNxfDO5wTrbq0-SQSup',
			// 		user_id: '31d06aa3-7b38-4f1f-a7c0-966479a55da3',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'annias',
			// 		},
			// 	},
			// 	{
			// 		id: 'VvulP2qGQHe9BBQX3aWF4',
			// 		name: 'New VvulP2qGQHe9BBQX3aWF4',
			// 		user_id: '0ea0da66-c2e7-4c21-8bce-3bc1aefe5fdc',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'richardsun',
			// 		},
			// 	},
			// 	{
			// 		id: '7jBsYucmH9vHKACylHgau',
			// 		name: 'Tutorial',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		description: '',
			// 		profiles: {
			// 			first_name: 'egan',
			// 		},
			// 	},
			// 	{
			// 		id: 'mw-7tqgT4Nnlx8EVpzbZ6',
			// 		name: 'paraphrase',
			// 		user_id: '7db601cb-fea3-47f9-9397-5b6f20c06c4e',
			// 		description: '',
			// 		profiles: {
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
				<h1 className="mb-6 text-2xl font-bold">Chatbot Gallery</h1>
				{isLoading ? <div>Loading...</div> : <Card publicWorkflows={publicWorkflows} />}
			</div>
		</div>
	);
}

const Card = ({ publicWorkflows }: { publicWorkflows: PublicWorkflow[] }) => {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{publicWorkflows.map((item, index) => (
				<div
					key={index}
					className="flex flex-col
					rounded-md
					border-1
					border-slate-300 shadow-md transition-shadow duration-300
					ease-in-out hover:shadow-lg
					"
				>
					<div className="flex grow flex-col items-start justify-center space-y-4 rounded-md bg-white p-4">
						{/* {item.image ? (
							<img
								src={item.image}
								alt={item.name}
								className="w-full h-48 object-cover rounded-md"
							/>
						) : (
							)} */}
						<div className="flex w-full flex-col gap-1 truncate">
							<p className="text-xs text-slate-500">{item.profiles?.first_name}</p>
							<h2 className="text-md truncate font-semibold">{item.name}</h2>
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-sm">{item?.description}</p>
							{item.description && item.description.length > 0 && (
								<a className="cursor-pointer text-sm text-blue-600">Read more...</a>
							)}
						</div>
					</div>
					<div className="flex w-full border-t-1 border-slate-300">
						<div className="flex w-0 flex-1 border-r-1 border-slate-300  hover:bg-slate-100">
							<a
								className="relative -mr-px inline-flex w-0 flex-1 cursor-pointer 
                                        items-center
                                    justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900"
								onClick={async () => {
									window.open(
										`/app/?user_id=${item.user_id}&id=${item.id}`,
										'_blank',
									);
								}}
							>
								<span className="truncate">Sandbox</span>
							</a>
						</div>
						<div className="flex w-0 flex-1  hover:bg-slate-100">
							<a
								className="relative -mr-px inline-flex w-0 flex-1 cursor-pointer 
                                        items-center
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
