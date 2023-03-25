import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import supabase from '../auth/supabaseClient';

export default function AuthPage() {
	const [, setLocation] = useLocation();

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
			if (event === 'SIGNED_IN') {
				setLocation('/');
			}
		});

		// Clean up the listener when the component is unmounted
		return () => {
			authListener.subscription.unsubscribe();
		};
	}, [setLocation]);
	return (
		<>
			<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h1 className="mx-auto h-12 w-auto text-5xl text-center">Promptsandbox.io</h1>
					<h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<Auth
						supabaseClient={supabase}
						providers={['google']}
						appearance={{
							theme: ThemeSupa,
							variables: {
								default: {
									colors: {
										brandButtonText: 'black',
									},
								},
							},
						}}
					/>
				</div>
			</div>
		</>
	);
}
