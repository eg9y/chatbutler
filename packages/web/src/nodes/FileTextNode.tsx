import { FileTextDataType } from '@chatbutler/shared';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';
import { shallow } from 'zustand/shallow';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import { db } from '../backgroundTasks/dexieDb/db';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const FileText: FC<NodeProps<FileTextDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showFullScreen, setShowFullScreen] = useState(false);
	const { documents } = useStore(selector, shallow);

	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg`,
				)}
			>
				<NodeTemplate
					{...props}
					title="File Text"
					fieldName="File"
					color="sky"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: FileTextDataType) => void) => (
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
										<option key={document.id} value={document.name || ''}>
											{document.name}
										</option>
									))}
								</select>
							</div>
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
				</NodeTemplate>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="filetext-input"
				className="h-4 w-4"
			></Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="filetext-output"
				className="h-4 w-4"
			/>
		</div>
	);
};

export default memo(FileText);
