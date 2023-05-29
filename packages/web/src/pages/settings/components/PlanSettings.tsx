import { CheckCircleIcon } from '@heroicons/react/20/solid';

const tiers = [
	{
		name: 'Free',
		id: 'tier-basic',
		href: 'https://app.chatbutler.ai',
		price: { monthly: '$0' },
		description: 'Everything necessary to get started.',
		features: [
			'Max 3 chatbots',
			'Publish Chatbots to unlimited sites',
			'Upload files (URLs, PDFs)',
			'Max size of all files: 500K Characters (12MB)',
			'ChatButler branding',
			'500 message credits per month',
		],
		cta: 'Coming Soon',
	},
	{
		name: 'Essential',
		id: 'tier-essential',
		href: '#get-started-today',
		price: { monthly: '$19' },
		description: 'Everything in Basic, and more',
		features: [
			'Max 3 chatbots',
			'Publish Chatbots to unlimited sites',
			'Upload files (URLs, PDFs)',
			'Max size of all files: 2M Characters (50MB)',
			'Replace with your own branding',
			'2000 message credits per month',
		],
		cta: 'Coming Soon',
	},
	{
		name: 'Premium',
		id: 'tier-premium',
		href: '#get-started-today',
		price: { monthly: '$39' },
		description: 'Everything in Basic, and more',
		features: [
			'Max 10 chatbots',
			'Publish Chatbots to unlimited sites',
			'Upload files (URLs, PDFs)',
			'Max size of all files: 10M Characters (50MB)',
			'Replace with your own branding',
			'5000 message credits per month',
			'Early access to new features and improvements',
			'Prioritized customer support',
		],
		cta: 'Coming Soon',
	},
];

export const PlanSettings = ({ username }: { username: string }) => {
	return (
		<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
			<div>
				<h2 className="text-base font-semibold leading-7 text-gray-900">Plan</h2>
				<p className="mt-1 text-sm leading-6 text-gray-500">Your ChatButler Plan.</p>

				<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
					<div className="pt-6 sm:flex">
						<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
							Current Plan
						</dt>
						<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
							<div className="text-gray-900">{username}</div>
						</dd>
					</div>
				</dl>

				<div id="pricing" className="bg-white py-10">
					<div className="mx-auto max-w-7xl">
						<div className=" flow-root">
							<div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-100 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
								{tiers.map((tier) => (
									<div key={tier.id} className="pt-16 lg:px-5 lg:pt-0 xl:px-5">
										<h3
											id={tier.id}
											className="text-base font-semibold leading-7 text-gray-900"
										>
											{tier.name}
										</h3>
										<p className="mt-6 flex items-baseline gap-x-1">
											<span className="text-5xl font-bold tracking-tight text-gray-900">
												{tier.price.monthly}
											</span>
											<span className="text-sm font-semibold leading-6 text-gray-600">
												/month
											</span>
										</p>
										<a
											href={tier.href}
											aria-describedby={tier.id}
											className="disabled pointer-events-none mt-10 block rounded-md bg-blue-600/30 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
										>
											{tier.cta}
										</a>
										<p className="mt-10 text-sm font-semibold leading-6 text-gray-900">
											{tier.description}
										</p>
										<ul
											role="list"
											className="mt-6 space-y-3 text-sm leading-6 text-gray-600"
										>
											{tier.features.map((feature) => (
												<li key={feature} className="flex gap-x-3">
													<CheckCircleIcon
														className="h-6 w-5 flex-none text-blue-600"
														aria-hidden="true"
													/>
													{feature}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
