import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../../assets/loading.svg';
import useSupabase from '../../auth/supabaseClient';
import { DocSource } from '../../nodes/types/NodeTypes';
import { useStore, selector, useStoreSecret, selectorSecret } from '../../store';
import { conditionalClassNames } from '../../utils/classNames';
import loadDoc from '../../windows/ChatPanel/Chat/MessageTypes/DocsLoaderMessage/loadDoc';

function isValidUrl(urlString: string): boolean {
	try {
		new URL(urlString);
		return true;
	} catch (error) {
		return false;
	}
}

function Dropzone() {
	const [file, setFile] = useState<File | null>(null);
	const [text, setText] = useState<string>('');
	const [blob, setBlob] = useState<string | ArrayBuffer | null>(null);
	const [arrayBuffer, setArrayBuffer] = useState<Uint8Array | null>(null);
	const [source, setSource] = useState<DocSource>(DocSource.pdfUrl);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDone, setIsDone] = useState<boolean>(false);

	const [userDocuments, setUserDocuments] = useState<
		| {
				[x: string]: any;
		  }[]
		| null
	>(null);

	const supabase = useSupabase();
	const { pauseResolver } = useStore(selector, shallow);
	const { openAiKey } = useStoreSecret(selectorSecret, shallow);

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
				'w-2/3  rounded-2xl bg-neutral-200 p-4 text-xs ',
			)}
		>
			<div>
				<p className="text-base text-neutral-800">File Load:</p>
				<UploadDoc
					source={source}
					setSource={setSource}
					text={text}
					setText={setText}
					handleFileChange={handleFileChange}
					file={file}
					isLoading={isLoading}
					loadDoc={async () => {
						await loadDoc(
							source,
							text,
							arrayBuffer,
							openAiKey,
							supabase,
							setIsDone,
							setIsLoading,
							pauseResolver,
						);
					}}
					isDone={isDone}
				/>
			</div>
		</div>
	);
}

function UploadDoc({
	source,
	setSource,
	text,
	setText,
	handleFileChange,
	file,
	isLoading,
	loadDoc,
	isDone,
}: {
	source: DocSource;
	setSource: (source: DocSource) => void;
	text: string;
	setText: (text: string) => void;
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	file: File | null;
	isLoading: boolean;
	loadDoc: () => Promise<void>;
	isDone: boolean;
}) {
	return (
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
				defaultValue={source || DocSource.url}
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

			{(source === DocSource.pdfUrl || source === DocSource.github) && (
				// TODO: let user add setting for recursive, branch, ignoreFiles, etc
				<>
					<div className="flex items-center pt-1">
						<label htmlFor="textType" className="block grow font-medium leading-6">
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
					onClick={() => {
						// check if string is valid URL: https://stackoverflow.com/a/5717133/114157
						if (source === DocSource.pdfUrl) {
							if (!isValidUrl(text)) {
								alert('Please enter a valid URL');
								return;
							}
						}
						loadDoc();
					}}
				>
					{isDone ? 'Done loading!' : 'Upload Doc'}
				</a>
				{isLoading && <Loading className="h-5 w-5 animate-spin text-black" />}
			</div>
		</div>
	);
}

export default Dropzone;
