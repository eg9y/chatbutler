import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { SearchDataType } from './types/NodeTypes';
import { db } from '../backgroundTasks/dexieDb/db';
import useStore, { selector } from '../store/useStore';

const Search: FC<NodeProps<SearchDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showPrompt, setshowPrompt] = useState(true);
	const [showFullScreen, setShowFullScreen] = useState(false);

	const { documents } = useStore(selector, shallow);

	return (
		<div className="">
			<div
				style={{
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-sky-600' : 'border-slate-400'
				} flex flex-col `}
			>
				<NodeTemplate
					{...props}
					title="Search"
					fieldName="File"
					bgColor="bg-sky-400"
					show={showPrompt}
					setShow={setshowPrompt}
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
				>
					{(updateNode: (id: string, data: SearchDataType) => void) => (
						<>
							<div className="py-1">
								<select
									id="model"
									name="fileId"
									className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-2xl sm:leading-6"
									value={data.document?.id || ''}
									onChange={async (e) => {
										const selectedDocumentId =
											e.target.selectedOptions[0].value;
										if (selectedDocumentId === '') return;
										const selectedDocument = documents.find(
											(document) =>
												document.id === parseInt(selectedDocumentId),
										);
										updateNode(id, {
											...data,
											document: selectedDocument,
										});
									}}
								>
									{documents?.map((document) => (
										<option key={document.id} value={document.id || ''}>
											{document.name}
										</option>
									))}
								</select>
							</div>
							<p className="text-2xl">Search Query:</p>
							<TextAreaTemplate
								{...props}
								presentText={presentText}
								setText={setText}
							/>
							<div className="flex flex-col gap-2 text-md ">
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
				</NodeTemplate>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="search-input"
				className="w-4 h-4"
			></Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="search-output"
				className="w-4 h-4"
			/>
		</div>
	);
};

export default memo(Search);
