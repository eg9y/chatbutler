import { DocSource } from '@chatbutler/shared';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import SavedDocs from './SearchMessage/SavedDocs';
import { ReactComponent as Loading } from '../../../../assets/loading.svg';
import useSupabase from '../../../../auth/supabaseClient';
import { uploadFile } from '../../../../pages/overview/utils/uploadFile';
import { useStore, useStoreSecret, selectorSecret, selector } from '../../../../store';
import { conditionalClassNames } from '../../../../utils/classNames';

function isValidUrl(urlString: string): boolean {
	try {
		new URL(urlString);
		return true;
	} catch (error) {
		return false;
	}
}

function SearchMessage() {
	const [file, setFile] = useState<File | null>(null);
	const [text, setText] = useState<string>('');
	const [blob, setBlob] = useState<string | ArrayBuffer | null>(null);
	const [arrayBuffer, setArrayBuffer] = useState<Uint8Array | null>(null);
	const [source, setSource] = useState<DocSource>(DocSource.pdfUrl);
	const [isUpload, setIsUpload] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDone, setIsDone] = useState<boolean>(false);

	const [userDocuments, setUserDocuments] = useState<
		| {
				[x: string]: any;
		  }[]
		| null
	>(null);

	const supabase = useSupabase();
	const { pauseResolver, currentWorkflow, setNotificationMessage } = useStore(selector, shallow);
	const { openAiKey, session } = useStoreSecret(selectorSecret, shallow);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null || event.target.files.length === 0) {
			return;
		}
		const file = event.target.files[0];
		if (file && file.type === 'text/plain') {
			setFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target === null || e.target.result === null) {
					return;
				}
				setBlob(e.target.result);
				// console.log('updating node', e.target.result);
			};
			reader.readAsText(file);
		} else if (file && file.type === 'application/pdf') {
			setFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target === null || e.target.result === null) {
					return;
				}
				const typedarray = new Uint8Array(e.target.result as Uint8Array);
				setArrayBuffer(typedarray);
				// console.log('updating node', e.target.result);
			};
			reader.readAsArrayBuffer(file);
		} else {
			setFile(null);
			setBlob(null);
		}
	};

	useEffect(() => {
		async function loadSavedDocs() {
			const userSavedDocs = await supabase
				.from('user_documents')
				.select('*')
				// show documents either owned by user or is part of the current chatbot
				.eq('user_id', session?.user.id);
			if (userSavedDocs.error) {
				throw new Error(userSavedDocs.error.message);
			}
			setUserDocuments(userSavedDocs.data);
		}
		loadSavedDocs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			className={conditionalClassNames(
				(isLoading || isDone) && 'pointer-events-none opacity-50',
				'w-2/3  rounded-2xl bg-neutral-200 p-4 text-xs ',
			)}
		>
			<div>
				<p className="text-base text-neutral-800">File Load:</p>
				<FileUploadOptions isUpload={isUpload} setIsUpload={setIsUpload} />
				{isUpload && (
					<div className="flex flex-col gap-1">
						<div className="flex items-center pt-1">
							<label htmlFor="textType" className="block grow font-medium leading-6">
								Source
							</label>
						</div>
						<select
							id="tabs"
							name="tabs"
							className="block w-full rounded-md border-slate-300 text-xs focus:border-neutral-500 focus:ring-neutral-500"
							defaultValue={source || DocSource.websiteUrl}
							onChange={(e) => {
								setSource(e.target.value as DocSource);
							}}
						>
							{Object.entries(DocSource).map(([key, value]) => (
								<option key={key} value={value}>
									{value}
								</option>
							))}
						</select>

						{source === DocSource.pdfUrl && (
							// TODO: let user add setting for recursive, branch, ignoreFiles, etc
							<>
								<div className="flex items-center pt-1">
									<label
										htmlFor="textType"
										className="block grow font-medium leading-6"
									>
										URL
									</label>
								</div>
								<input
									type="text"
									name="text"
									autoComplete="off"
									className="nodrag sm:text-md block w-full rounded-md border-0 text-neutral-900 shadow-sm ring-2 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-inset focus:ring-neutral-600 sm:py-1.5 sm:leading-6"
									value={text}
									onChange={(e) => {
										setText(e.target.value);
									}}
								/>
							</>
						)}
						{source === DocSource.pdf && (
							<>
								{/* file select */}
								<input type="file" accept=".txt,.pdf" onChange={handleFileChange} />
								{file && (
									<p>
										File: <strong>{file.name}</strong>
									</p>
								)}
							</>
						)}
						<div className="mt-4 flex items-center gap-2 pt-1 ">
							<a
								className={conditionalClassNames(
									isLoading && 'pointer-events-none opacity-50',
									'group grow cursor-pointer items-center rounded-md border-2 border-neutral-400 bg-neutral-200 p-2 text-center font-medium text-neutral-800 hover:bg-neutral-300',
								)}
								onClick={async () => {
									// check if string is valid URL: https://stackoverflow.com/a/5717133/114157
									if (
										source === DocSource.pdfUrl ||
										source === DocSource.websiteUrl
									) {
										if (!isValidUrl(text)) {
											alert('Please enter a valid URL');
											return;
										}
									} else {
										if (!currentWorkflow || !file) {
											alert('Please select a file');
											return;
										}
										await uploadFile(
											session,
											source,
											currentWorkflow,
											file,
											setIsLoading,
											setNotificationMessage,
										);
									}
								}}
							>
								{isDone ? 'Done loading!' : 'Load Doc'}
							</a>
							{isLoading && <Loading className="h-5 w-5 animate-spin text-black" />}
						</div>
					</div>
				)}
				{!isUpload && (
					<SavedDocs
						userDocuments={userDocuments}
						pauseResolver={pauseResolver}
						setIsLoading={setIsLoading}
						setIsDone={setIsDone}
					/>
				)}
			</div>
		</div>
	);
}

function FileUploadOptions({
	isUpload,
	setIsUpload,
}: {
	isUpload: boolean;
	setIsUpload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<div>
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>
				{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
				<select
					id="tabs"
					name="tabs"
					className="py block w-full rounded-md border-gray-300 pl-3 pr-10 text-base focus:border-neutral-500 focus:outline-none focus:ring-neutral-500 sm:text-sm"
					defaultValue={'Upload'}
					onChange={(e) => {
						if (e.target.value === 'Upload') {
							setIsUpload(true);
						} else {
							setIsUpload(false);
						}
					}}
				>
					<option>Upload</option>
					<option>Saved</option>
				</select>
			</div>
			<div className="hidden sm:block">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-2" aria-label="Tabs">
						{['Upload', 'Saved'].map((tab) => (
							<a
								key={tab}
								onClick={(e) => {
									if (tab === 'Upload') {
										setIsUpload(true);
									} else {
										setIsUpload(false);
									}
								}}
								className={conditionalClassNames(
									(isUpload === true && tab === 'Upload') ||
										(isUpload === false && tab === 'Saved')
										? 'border-neutral-500 text-neutral-600'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
									'cursor-pointer whitespace-nowrap border-b-2 px-1 py-1 text-sm font-medium',
								)}
								aria-current={
									isUpload === true && tab === 'Upload' ? 'page' : undefined
								}
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

export default SearchMessage;
