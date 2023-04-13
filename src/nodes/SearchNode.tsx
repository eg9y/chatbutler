import { memo, FC, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { SearchDataType } from './types/NodeTypes';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const Search: FC<NodeProps<SearchDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showFullScreen, setShowFullScreen] = useState(false);

	const { documents, updateNode } = useStore(selector, shallow);

	useEffect(() => {
		const documentId = data.document?.id;
		const isDocumentDeleted = documents.find((document) => document.id === documentId);
		if (!isDocumentDeleted) {
			updateNode(id, {
				...data,
				document: documents[0],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [documents]);

	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg `,
				)}
			>
				<NodeTemplate
					{...props}
					title="Search"
					fieldName="File"
					color="sky"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{() => (
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
							<p className="text-2xl pt-4 pb-1">Search Query:</p>
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
							<div className="flex items-center gap-2 pt-4">
								<p className="text-2xl">Total Results:</p>
								<input
									type="text"
									value={data.results}
									className="nodrag w-16 text-2xl text-center border-2 border-slate-400 rounded-md"
									onChange={(e) => {
										updateNode(id, {
											...data,
											results: parseInt(e.target.value),
										});
									}}
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
