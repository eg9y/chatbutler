import { ChangeEvent } from 'react';

import { RFState } from '../../store/useStore';

export default function SandboxSettings({
	setCurrentWorkflow,
	currentWorkflow,
}: {
	currentWorkflow: RFState['currentWorkflow'];
	setCurrentWorkflow: RFState['setCurrentWorkflow'];
}) {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

	function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
		e.preventDefault();
		if (currentWorkflow) {
			setCurrentWorkflow({
				...currentWorkflow,
				description: e.target.value,
			});
		}
	}

	return (
		<>
			<div className="text-sm font-medium leading-6 text-slate-900 pr-4 pl-2 pt-4">
				{/* form div scrollable using tailwind */}
				<form onSubmit={handleSubmit} className="flex flex-col">
					<div className="">
						<div className="">
							<label htmlFor="description" className="block">
								Description
							</label>
							<textarea
								name="description"
								id="description"
								className="block w-full rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
								value={currentWorkflow?.description}
								onChange={handleChange}
							/>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
