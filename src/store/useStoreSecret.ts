import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export type UseSecretStoreSetType = (
	partial:
		| RFStateSecret
		| Partial<RFStateSecret>
		| ((state: RFStateSecret) => RFStateSecret | Partial<RFStateSecret>),
	replace?: boolean | undefined,
) => void;

export interface RFStateSecret {
	session: Session | null;
	setSession: (session: Session | null) => void;
	openAiKey: string;
	setOpenAiKey: (key: string) => Promise<void>;
}

const useStoreSecret = create<RFStateSecret>()((set, get) => ({
	session: null,
	setSession: (session: Session | null) => {
		set({
			session,
		});
	},
	openAiKey: '',
	setOpenAiKey: async (key: string) => {
		const userSession = get().session;
		if (!userSession) {
			alert(
				`Note: Since you're not logged in, you would have to re-enter your OpenAI API key next time. Logging in would allow you to save your API key in the database in a secure way.`,
			);
		}
		set({
			openAiKey: key,
		});
	},
}));

export const selectorSecret = (state: RFStateSecret) => ({
	...state,
});

export default useStoreSecret;
