import { Switch } from '@headlessui/react';

import { conditionalClassNames } from '../utils/classNames';

export default function ShowPromptSwitch(
	showPrompt: boolean,
	setshowPrompt: (visible: boolean) => void,
) {
	return (
		<Switch.Group as="div" className="flex items-center">
			<Switch
				checked={showPrompt}
				onChange={setshowPrompt}
				className={conditionalClassNames(
					showPrompt ? 'bg-green-600' : 'bg-slate-400',
					'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ',
				)}
			>
				<span
					aria-hidden="true"
					className={conditionalClassNames(
						showPrompt ? 'translate-x-5' : 'translate-x-0',
						'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
					)}
				/>
			</Switch>
			<Switch.Label as="span" className="ml-3 text-md font-medium text-slate-900">
				Detail
			</Switch.Label>
		</Switch.Group>
	);
}
