import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export type UseSecretStoreSetType = (
	partial:
		| RFStateSecret
		| Partial<RFStateSecret>
		| ((state: RFStateSecret) => RFStateSecret | Partial<RFStateSecret>),
	replace?: boolean | undefined,
) => void;

export type UserCreditsType = {
	credits: number;
	plan: 'free' | 'essential' | 'premium';
};
export interface RFStateSecret {
	session: Session | null;
	setSession: (session: Session | null) => void;
	openAiKey: string;
	setOpenAiKey: (key: string) => Promise<void>;
	userCredits: UserCreditsType;
	setUserCredits: (userCredits: UserCreditsType) => void;
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
				`Keep in mind that because you're not signed in, you will need to input your OpenAI API key again in the future. It is important to know that storing API keys in your browser is unsafe. By logging in, you can securely save your API key in the database.`,
			);
		}
		set({
			openAiKey: key,
		});
	},
	userCredits: {
		credits: 0,
		plan: 'free',
	},
	setUserCredits: (credits: UserCreditsType) => {
		set({
			userCredits: credits,
		});
	},
}));

export const selectorSecret = (state: RFStateSecret) => ({
	...state,
});

export default useStoreSecret;
