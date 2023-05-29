import { SearchDataType } from '@chatbutler/shared/src/index';
import { Switch } from '@headlessui/react';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import DocumentSelector from '../../src/components/DocumentSelector';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const Search: FC<NodeProps<SearchDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;
	const [askUser, setAskUser] = useState<boolean>(data.askUser);
	const [openSelector, setOpenSelector] = useState(false);
	const [selectedDocuments, setSelectedDocuments] = useState<string[]>(
		data.docs.trim().length > 0 ? data.docs.split(',') : [],
	);

	const [showFullScreen, setShowFullScreen] = useState(false);

	const { updateNode } = useStore(selector, shallow);

	const [returnSource, setReturnSource] = useState<boolean>(data.returnSource);

	return (
		<div className="">
			<DocumentSelector
				open={openSelector}
				setOpen={setOpenSelector}
				selectedDocuments={selectedDocuments}
				setSelectedDocuments={setSelectedDocuments}
				updateNode={updateNode}
				data={data}
				id={id}
			/>
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg `,
				)}
			>
				<NodeTemplate
					{...props}
					title="Docs Search"
					fieldName="Search Query"
					color="sky"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{() => (
						<>
							<TextAreaTemplate
								{...props}
								presentText={presentText}
								setText={setText}
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
							<>
								<div className="py-4">
									Ask User
									<Switch.Group as="div" className="flex items-center">
										<Switch
											checked={askUser}
											onChange={() => {
												setAskUser((prev) => !prev);
												updateNode(id, {
													...data,
													askUser: !askUser,
												});
											}}
											className={conditionalClassNames(
												askUser ? 'bg-green-600' : 'bg-gray-300',
												'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2',
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
									<div className="flex flex-col gap-5">
										<div className="flex items-center justify-start pt-4">
											<button
												type="button"
												onClick={() => setOpenSelector(true)}
												className="w-2/3 rounded-md bg-sky-600 px-2.5 py-1.5 text-2xl font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
											>
												Select Docs
											</button>
										</div>
										<div className="flex flex-col">
											<p className="text-2xl">Docs to load</p>
											<ul role="list" className="divide-y divide-white/5">
												{Array.from(selectedDocuments).map((doc) => (
													<li
														key={doc}
														className={conditionalClassNames(
															'group relative flex flex-grow cursor-pointer items-center space-x-4 px-4 py-4  sm:px-6 lg:px-8',
														)}
													>
														<div className="min-w-0 grow">
															<div className="flex items-center gap-x-3">
																<div
																	className={conditionalClassNames(
																		'flex-none rounded-full p-1',
																	)}
																>
																	<div className="h-2 w-2 rounded-full bg-current" />
																</div>
																<h2 className="flex min-w-0 gap-x-2 text-xl font-semibold leading-6 text-slate-600">
																	<span className="truncate">
																		{doc}
																	</span>
																</h2>
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
									</div>
								)}
							</>
							<div className="py-4">
								<Switch.Group as="div" className="flex items-center">
									<Switch
										checked={returnSource}
										onChange={() => {
											setReturnSource((prev) => !prev);
											updateNode(id, {
												...data,
												returnSource: !returnSource,
											});
										}}
										className={conditionalClassNames(
											returnSource ? 'bg-green-600' : 'bg-gray-200',
											'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
										)}
									>
										<span
											aria-hidden="true"
											className={conditionalClassNames(
												returnSource ? 'translate-x-5' : 'translate-x-0',
												'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
											)}
										/>
									</Switch>
									<Switch.Label as="span" className="ml-3">
										<span className="text-xl font-medium text-gray-900">
											Return Source
										</span>
									</Switch.Label>
								</Switch.Group>
							</div>
						</>
					)}
				</NodeTemplate>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="search-input"
				className="h-4 w-4"
			></Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="search-output"
				className="h-4 w-4"
			/>
		</div>
	);
};

export default memo(Search);
