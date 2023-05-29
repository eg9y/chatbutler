import { Database } from '@chatbutler/shared/src/index';
import { CubeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { PlanSettings } from './components/PlanSettings';
import { ReactComponent as Loading } from '../../assets/loading.svg';
import useSupabase from '../../auth/supabaseClient';
import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import { conditionalClassNames } from '../../utils/classNames';
import UsernamePrompt from '../app/UsernamePrompt';

const secondaryNavigation = [
	{ name: 'General', href: '#', icon: UserCircleIcon },
	{ name: 'Plan', href: '#', icon: CubeIcon },
	// { name: 'Billing', href: '#', icon: CreditCardIcon },
];

export default function Settings() {
	const supabase = useSupabase();
	const { session } = useStoreSecret(selectorSecret, shallow);
	const [username, setUsername] = useState('');
	const [userPlan, setUserPlan] = useState('');
	const [userRemainingCredits, setUserRemainingCredits] = useState(0);

	const [currentTab, setCurrentTab] = useState('General');

	useEffect(() => {
		const populateUser = async () => {
			if (session) {
				const { data: userProfile, error } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', session.user.id)
					.single();

				if (error) {
					console.error(error);
					return;
				}
				if (userProfile && userProfile.first_name) {
					setUsername(userProfile.first_name);
					setUserPlan(userProfile.plan);
					setUserRemainingCredits(userProfile.remaining_message_credits);
				}
			}
		};
		populateUser();
	}, [session, supabase]);

	return (
		<>
			<div className="pt-15 mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
				<SettingsNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
				<main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
					{currentTab === 'General' && (
						<GeneralSettings
							supabase={supabase}
							username={username}
							setUsername={setUsername}
						/>
					)}
					{currentTab === 'Plan' && (
						<PlanSettings
							supabase={supabase}
							userPlan={userPlan}
							setUserPlan={setUserPlan}
							userRemainingCredits={userRemainingCredits}
							setUserRemainingCredits={setUserRemainingCredits}
						/>
					)}
				</main>
			</div>
		</>
	);
}

function GeneralSettings({
	supabase,
	username,
	setUsername,
}: {
	supabase: SupabaseClient<Database>;
	username: string;
	setUsername: (username: string) => void;
}) {
	const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { setNotificationMessage } = useStore(selector, shallow);
	const { session, setOpenAiKey } = useStoreSecret(selectorSecret, shallow);
	return (
		<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
			<UsernamePrompt
				open={showUsernamePrompt}
				setShowUsernamePrompt={setShowUsernamePrompt}
				supabase={supabase}
				session={session}
				setUsername={setUsername}
			/>
			<div>
				<h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
				<p className="mt-1 text-sm leading-6 text-gray-500">Your Profile information.</p>

				<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
					<div className="pt-6 sm:flex">
						<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
							Name
						</dt>
						<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
							<div className="text-gray-900">{username}</div>
							<button
								type="button"
								onClick={() => {
									setShowUsernamePrompt(true);
								}}
								className="font-semibold text-slate-600 hover:text-slate-500"
							>
								Update
							</button>
						</dd>
					</div>
				</dl>
			</div>
			<div>
				<h2 className="text-base font-semibold leading-7 text-gray-900">OpenAI Key</h2>
				<p className="mt-1 text-sm leading-6 text-gray-500">
					Store your OpenAI Key to run your chatbots using your key.
				</p>

				<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
					<div className="pt-6 sm:flex">
						<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
							Key
						</dt>
						<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
							<div className="text-gray-900">sk-********-********</div>
							<button
								type="button"
								onClick={async () => {
									setIsLoading(true);
									const { data: currentKey, error } =
										await supabase.functions.invoke('get-api-key');
									if (error) {
										setNotificationMessage(error.message);
									}
									console.log('currentKey', currentKey);
									setOpenAiKey(currentKey || '');
									const newOpenAIKey = window.prompt(
										'Enter your OpenAI Key here',
										currentKey || '',
									);

									if (newOpenAIKey === null) {
										setIsLoading(false);
										return;
									}

									if (newOpenAIKey === '') {
										console.log('No key entered');
									} else {
										await supabase.functions.invoke('insert-api-key', {
											body: {
												api_key: newOpenAIKey,
											},
										});
										setOpenAiKey(newOpenAIKey);
									}
									setIsLoading(false);
								}}
								className=" font-semibold text-slate-600 hover:text-slate-500"
							>
								{isLoading ? (
									<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
								) : (
									<>Update</>
								)}
							</button>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}

function SettingsNav({
	currentTab,
	setCurrentTab,
}: {
	currentTab: string;
	setCurrentTab: (tab: string) => void;
}) {
	return (
		<aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
			<nav className="flex-none px-4 sm:px-6 lg:px-0">
				<ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
					{secondaryNavigation.map((item) => (
						<li key={item.name}>
							<a
								onClick={() => setCurrentTab(item.name)}
								className={conditionalClassNames(
									currentTab === item.name
										? 'bg-gray-50 text-slate-600'
										: 'text-gray-700 hover:bg-gray-50 hover:text-slate-600',
									'group flex cursor-pointer gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
								)}
							>
								<item.icon
									className={conditionalClassNames(
										currentTab === item.name
											? 'text-slate-600'
											: 'text-gray-400 group-hover:text-slate-600',
										'h-6 w-6 shrink-0',
									)}
									aria-hidden="true"
								/>
								{item.name}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
