import { Switch } from '@headlessui/react';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import { DocSource, DocsLoaderDataType } from './types/NodeTypes';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const DocsLoader: FC<NodeProps<DocsLoaderDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showFullScreen, setShowFullScreen] = useState(false);

	const [source, setSource] = useState<DocSource>(data.source);
	const [askUser, setAskUser] = useState<boolean>(data.askUser);

	const [file, setFile] = useState<File | null>(null);
	const [blob, setBlob] = useState<string | ArrayBuffer | null>(data.fileBlob || null);

	const { documents, updateNode } = useStore(selector, shallow);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null || event.target.files.length === 0) {
			return;
		}
		const file = event.target.files[0];
		if ((file && file.type === 'text/plain') || file.type === 'application/pdf') {
			setFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target === null || e.target.result === null) {
					return;
				}
				setBlob(e.target.result);
				console.log('updating node', e.target.result);
				updateNode(id, {
					...data,
					fileBlob: blob,
				});
			};
			reader.readAsText(file);
		} else {
			setFile(null);
			setBlob(null);
		}
	};

	return (
		<div className="">
			<div className={conditionalClassNames(data.isDetailMode && 'h-[40rem] w-[35rem]')}>
				<NodeTemplate
					{...props}
					title="Docs Loader"
					fieldName="Ask user"
					color="sky"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: DocsLoaderDataType) => void) => (
						<>
							<div className="py-4">
								<Switch.Group as="div" className="flex items-center">
									<Switch
										disabled={true}
										checked={askUser}
										onChange={() => {
											setAskUser((prev) => !prev);
											updateNode(id, {
												...data,
												askUser: !askUser,
											});
											console.log('changed', askUser);
										}}
										className={conditionalClassNames(
											askUser ? 'bg-neutral-600/50' : 'bg-gray-200',
											// askUser ? 'bg-green-600' : 'bg-gray-200',
											'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
										)}
									>
										<span
											aria-hidden="true"
											className={conditionalClassNames(
												askUser ? 'translate-x-5' : 'translate-x-0',
												'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
											)}
										/>
									</Switch>
								</Switch.Group>
							</div>
							{!askUser && (
								<>
									<div className="flex items-center pt-4">
										<label
											htmlFor="textType"
											className="block grow text-2xl font-medium leading-6"
										>
											Source
										</label>
									</div>
									<select
										id="tabs"
										name="tabs"
										className="block w-full rounded-md border-gray-300 text-2xl focus:border-slate-500 focus:ring-slate-500"
										defaultValue={source || DocSource.url}
										onChange={(e) => {
											setSource(e.target.value as DocSource);
											updateNode(id, {
												...data,
												source: e.target.value as DocSource,
											});
										}}
									>
										{Object.entries(DocSource).map(([key, value]) => (
											<option key={key} value={value}>
												{value}
											</option>
										))}
									</select>

									{source === DocSource.pdfUrl && (
										<>
											<div className="flex items-center pt-4">
												<label
													htmlFor="textType"
													className="block grow text-2xl font-medium leading-6"
												>
													URL
												</label>
											</div>
											<input
												type="text"
												name="text"
												className="nodrag block h-16 w-full rounded-md border-0 text-slate-900 shadow-sm ring-2 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
												value={presentText}
												onChange={(e) => {
													setText(e.target.value);
													updateNode(id, {
														...data,
														text: e.target.value,
													});
												}}
											/>
											<div className="text-md flex flex-col gap-2 ">
												<InputNodesList
													data={data}
													id={id}
													setText={setText}
													updateNode={updateNode}
													type={type}
												/>
											</div>
										</>
									)}
									{source === DocSource.pdf && (
										<>
											{/* file select */}
											<input
												type="file"
												accept=".txt,.pdf"
												onChange={handleFileChange}
											/>
											{file && (
												<p>
													File: <strong>{file.name}</strong>
												</p>
											)}
										</>
									)}
								</>
							)}
						</>
					)}
				</NodeTemplate>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="text-input"
				className="h-4 w-4"
			></Handle>
			<Handle type="source" position={Position.Right} id="text-output" className="h-4 w-4" />
		</div>
	);
};
export default memo(DocsLoader);
