import { Switch } from '@headlessui/react';
import { ChangeEvent } from 'react';

import { RFState } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';

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
			<div className="pl-2 pr-4 pt-4 text-sm font-medium leading-6 text-slate-900">
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
				<Switch.Group as="div" className="flex items-center pt-4">
					<Switch
						checked={currentWorkflow?.is_public}
						onChange={() => {
							if (currentWorkflow) {
								setCurrentWorkflow({
									...currentWorkflow,
									is_public: !currentWorkflow.is_public,
								});
							}
						}}
						className={conditionalClassNames(
							currentWorkflow?.is_public ? 'bg-blue-600' : 'bg-gray-200',
							'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
						)}
					>
						<span
							aria-hidden="true"
							className={conditionalClassNames(
								currentWorkflow?.is_public ? 'translate-x-5' : 'translate-x-0',
								'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
							)}
						/>
					</Switch>
					<Switch.Label as="span" className="ml-3 text-sm">
						<span className="font-medium text-gray-900">Is Public</span>
					</Switch.Label>
				</Switch.Group>
			</div>
		</>
	);
}
