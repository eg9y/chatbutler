import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../../../assets/loading.svg';
import useSupabase from '../../../auth/supabaseClient';
import { SimpleWorkflow } from '../../../db/dbTypes';
import { DocSource } from '../../../nodes/types/NodeTypes';
import { useStore, selector, useStoreSecret, selectorSecret } from '../../../store';
import { conditionalClassNames } from '../../../utils/classNames';
import { uploadFile } from '../utils/uploadFile';
import { uploadWebsiteUrl } from '../utils/uploadWebsiteUrl';

function DocumentUploader({
	chatbot,
	setChatbotDocuments,
}: {
	chatbot: SimpleWorkflow;
	setChatbotDocuments: (
		value: React.SetStateAction<
			| {
					[x: string]: any;
			  }[]
			| null
		>,
	) => void;
}) {
	const [file, setFile] = useState<File | null>(null);
	const [text, setText] = useState<string>('');
	const [blob, setBlob] = useState<string | ArrayBuffer | null>(null);
	const [arrayBuffer, setArrayBuffer] = useState<Uint8Array | null>(null);
	const [source, setSource] = useState<DocSource>(DocSource.pdfUrl);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDone, setIsDone] = useState<boolean>(false);

	const { setUiErrorMessage } = useStore(selector, shallow);
	const { session } = useStoreSecret(selectorSecret, shallow);

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
				console.log('loaded!', typedarray);
				setArrayBuffer(typedarray);
				// console.log('updating node', e.target.result);
			};
			reader.readAsArrayBuffer(file);
		} else {
			setFile(null);
			setBlob(null);
		}
	};

	return (
		<div
			className={conditionalClassNames(
				(isLoading || isDone) && 'pointer-events-none opacity-50',
				'py-4 text-xs ',
			)}
		>
			<div>
				<>
					<div>
						<div className="sm:hidden">
							<label htmlFor="tabs" className="sr-only">
								Select a tab
							</label>
							{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
							<select
								id="tabs"
								name="tabs"
								className="block w-full rounded-md border-gray-300 focus:border-neutral-500 focus:ring-neutral-500"
								defaultValue={source || DocSource.websiteUrl}
							>
								{Object.entries(DocSource).map((tab) => (
									<option key={tab[0]}>{tab}</option>
								))}
							</select>
						</div>
						<div className="hidden sm:block">
							<nav className="flex space-x-4" aria-label="Tabs">
								{Object.entries(DocSource).map((tab) => (
									<a
										key={tab[0]}
										className={conditionalClassNames(
											source === tab[1]
												? 'bg-neutral-200 text-neutral-700'
												: 'cursor-pointer text-gray-500 hover:text-gray-700',
											'rounded-md px-3 py-2 text-sm font-medium',
										)}
										onClick={() => setSource(tab[1])}
										aria-current={'page'}
									>
										{tab[1]}
									</a>
								))}
							</nav>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						{source === DocSource.websiteUrl && (
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
									className="sm:text-md block w-full rounded-md border-0 text-neutral-900 shadow-sm ring-2 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-inset focus:ring-neutral-600 sm:py-1.5 sm:leading-6"
									value={text}
									onChange={(e) => {
										setText(e.target.value);
									}}
									onKeyDown={async (e) => {
										if (e.key === 'Enter') {
											await uploadWebsiteUrl(
												session,
												source,
												text,
												chatbot,
												setIsLoading,
												setUiErrorMessage,
											);
											setChatbotDocuments((prev) => [
												...(prev || []),
												{
													name: text,
												},
											]);
											setIsLoading(false);
											setText('');
										}
									}}
								/>
							</>
						)}
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
								<input
									type="file"
									accept=".txt,.pdf"
									className="py-4"
									onChange={handleFileChange}
								/>
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
									if (
										source === DocSource.websiteUrl ||
										source === DocSource.pdfUrl
									) {
										await uploadWebsiteUrl(
											session,
											source,
											text,
											chatbot,
											setIsLoading,
											setUiErrorMessage,
										);
										setChatbotDocuments((prev) => [
											...(prev || []),
											{
												name: text,
											},
										]);
										setIsLoading(false);
										setText('');
									} else if (source === DocSource.pdf && file) {
										await uploadFile(
											session,
											source,
											chatbot,
											file,
											setIsLoading,
											setUiErrorMessage,
										);
										setChatbotDocuments((prev) => [
											...(prev || []),
											{
												name: file,
											},
										]);
										setIsLoading(false);
										setText('');
									}
								}}
							>
								{isDone ? 'Done loading!' : 'Upload Doc'}
							</a>
							{isLoading && <Loading className="h-5 w-5 animate-spin text-black" />}
						</div>
					</div>
				</>
			</div>
		</div>
	);
}

export default DocumentUploader;
