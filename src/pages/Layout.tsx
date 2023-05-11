import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import useSupabase from '../auth/supabaseClient';
import NavBar from '../components/Navbar';
import { useStoreSecret, selectorSecret } from '../store';

function Layout({
	children,
	shouldAuthenticate,
}: {
	children: React.ReactNode;
	shouldAuthenticate?: boolean;
}) {
	const { session, setSession } = useStoreSecret(selectorSecret, shallow);
	const supabase = useSupabase();

	useEffect(() => {
		(async () => {
			const currentSession = await supabase.auth.getSession();
			if (currentSession.data.session) {
				setSession(currentSession.data.session);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<NavBar />
			{(!shouldAuthenticate || (shouldAuthenticate && session)) && (
				<div className="h-[95vh] overflow-y-scroll">{children}</div>
			)}
			{shouldAuthenticate && !session && (
				<div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
					{/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
					<div className="mx-auto flex max-w-3xl flex-col items-center">
						<h1 className="mx-auto h-12 w-auto text-center text-5xl">Chatbutler.ai</h1>
						<h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
							Sign in to see your overview
						</h2>
						<div className="py-4">
							<button
								type="button"
								onClick={() => {
									window.open('/auth/', '_self');
								}}
								className="min-w-[100px] rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
							>
								Sign in
							</button>
						</div>

						{/* divider */}
						<div className="relative w-full py-5">
							<div className="absolute inset-0 flex items-center" aria-hidden="true">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center">
								<span className="bg-white px-2 text-sm text-gray-500">Or</span>
							</div>
						</div>

						<h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
							Explore the editor
						</h2>
						<div className="py-4">
							<button
								type="button"
								onClick={() => {
									window.open('/app/', '_self');
								}}
								className="min-w-[100px] rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
							>
								Editor
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Layout;
