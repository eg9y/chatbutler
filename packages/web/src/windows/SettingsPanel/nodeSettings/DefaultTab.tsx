import { AllDataTypes } from '@chatbutler/shared/src/index';
import { Node } from 'reactflow';

export default function DefaultTab({
	selectedNode,
	handleChange,
}: {
	selectedNode: Node<AllDataTypes>;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => void;
}) {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

	return (
		<>
			{selectedNode && (
				<div className="text-sm font-medium leading-6 text-slate-900">
					{/* form div scrollable using tailwind */}
					<form onSubmit={handleSubmit} className="flex flex-col">
						<div className="">
							<div className="">
								<label htmlFor="name" className="block">
									Name
								</label>
								<input
									type="text"
									name="name"
									id="name"
									className="block w-full rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
									value={selectedNode.data.name}
									onChange={handleChange}
								/>
							</div>
						</div>
						{/* <div className="">
							<label htmlFor="text" className="block">
								Value
							</label>
							<input
								type="text"
								name="text"
								id="text"
								className="block w-full rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
								value={selectedNode.data.text}
								onChange={handleChange}
							/>
						</div> */}
					</form>
				</div>
			)}
		</>
	);
}
