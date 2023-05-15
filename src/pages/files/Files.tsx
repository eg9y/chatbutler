/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TrashIcon } from '@heroicons/react/24/outline';
import { shallow } from 'zustand/shallow';

import Dropzone from './Dropzone';
import useSupabase from '../../auth/supabaseClient';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';

const tabs = [
	{ name: 'All', href: '#', current: true },
	{ name: 'Collections', href: '#', current: false },
];

export default function Files() {
	const { documents, setDocuments } = useStore(selector, shallow);

	const supabase = useSupabase();

	return <></>;
}
