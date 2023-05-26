import { conditionalClassNames } from '../../../utils/classNames';

const tabs = ['Documents', 'Publish'];

export default function ChatbotDetailsTabs({
	currentTab,
	setCurrentTab,
}: {
	currentTab: string;
	setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<div className="pb-10 pt-6">
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>
				{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
					defaultValue={'Documents'}
				>
					{tabs.map((tab) => (
						<option key={tab}>{tab}</option>
					))}
				</select>
			</div>
			<div className="hidden sm:block">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8" aria-label="Tabs">
						{tabs.map((tab) => (
							<a
								key={tab}
								onClick={() => {
									setCurrentTab(tab);
								}}
								className={conditionalClassNames(
									tab === currentTab
										? 'border-slate-500 text-slate-600'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
									'cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
								)}
								aria-current={tab === currentTab ? 'page' : undefined}
							>
								{tab}
							</a>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
}
