import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../../../assets/loading.svg';
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
	const [arrayBuffer, setArrayBuffer] = useState<Uint8Array | null>(null);
	const [source, setSource] = useState<DocSource>(DocSource.pdfUrl);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDone, setIsDone] = useState<boolean>(false);

	const { setNotificationMessage } = useStore(selector, shallow);
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
		}
	};

	return (
		<div
			className={conditionalClassNames(
				(isLoading || isDone) && 'pointer-events-none opacity-50',
				'flex grow flex-col gap-2 px-4 text-xs',
			)}
		>
			<div className="">
				<label
					htmlFor="location"
					className="block text-sm font-medium leading-6 text-gray-900"
				>
					File Type
				</label>
				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 focus:border-neutral-500 focus:ring-neutral-500"
					defaultValue={source || DocSource.websiteUrl}
					onChange={async (e) => {
						setSource(e.target.value as DocSource);
					}}
				>
					{Object.entries(DocSource).map((tab) => (
						<option key={tab[0]}>{tab[1]}</option>
					))}
				</select>
			</div>
			<div className="flex items-center gap-1">
				<div className="grow">
					{(source === DocSource.websiteUrl || source === DocSource.pdfUrl) && (
						// TODO: let user add setting for recursive, branch, ignoreFiles, etc
						<>
							<label htmlFor="url" className="sr-only">
								URL
							</label>
							<input
								type="url"
								name="url"
								id="url"
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
								placeholder="URL"
								value={text}
								autoComplete="off"
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
											setNotificationMessage,
										);
										setChatbotDocuments((prev) => [
											...(prev || []),
											{
												name: text,
											},
										]);
										setText('');
										setNotificationMessage(
											'Successfully uploaded website url',
											'success',
										);
									}
								}}
							/>
						</>
					)}
					{source === DocSource.pdf && (
						<>
							{/* file select */}
							<label
								className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
								htmlFor="file_input"
							>
								Upload file
							</label>
							<input
								accept=".txt,.pdf"
								onChange={handleFileChange}
								className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none "
								aria-describedby="file_input_help"
								id="file_input"
								type="file"
							/>
							<p className="mt-1 text-sm text-gray-500 " id="file_input_help">
								MAX. 5MB{' '}
								{file && (
									<span>
										File: <strong>{file.name}</strong>
									</span>
								)}
							</p>
						</>
					)}
				</div>

				<div className=" flex items-center gap-2">
					<a
						className={conditionalClassNames(
							isLoading && 'pointer-events-none opacity-50',
							'group grow cursor-pointer items-center rounded-md border-2 border-neutral-400 bg-neutral-200 p-2 text-center font-medium text-neutral-800 hover:bg-neutral-300',
						)}
						onClick={async () => {
							if (source === DocSource.websiteUrl || source === DocSource.pdfUrl) {
								await uploadWebsiteUrl(
									session,
									source,
									text,
									chatbot,
									setIsLoading,
									setNotificationMessage,
								);
								setChatbotDocuments((prev) => [
									...(prev || []),
									{
										name: text,
									},
								]);
								setText('');
								setNotificationMessage(
									'Successfully uploaded website url',
									'success',
								);
							} else if (source === DocSource.pdf && file) {
								await uploadFile(
									session,
									source,
									chatbot,
									file,
									setIsLoading,
									setNotificationMessage,
								);
								setChatbotDocuments((prev) => [
									...(prev || []),
									{
										name: file,
									},
								]);
								setText('');
								setNotificationMessage(
									'Successfully uploaded website url',
									'success',
								);
							}
						}}
					>
						{isDone ? 'Done loading!' : 'Upload Doc'}
					</a>
					{isLoading && <Loading className="h-5 w-5 animate-spin text-black" />}
				</div>
			</div>
		</div>
	);
}

export default DocumentUploader;
