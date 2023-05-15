import React, { useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import uploadFile from './uploadFile';
import { ReactComponent as Loading } from '../../assets/loading.svg';
import useSupabase from '../../auth/supabaseClient';
import { useStoreSecret, selectorSecret } from '../../store';
import { RFState } from '../../store/useStore';

type DropZoneProps = {
	documents: RFState['documents'];
	setDocuments: RFState['setDocuments'];
};

const Dropzone: React.FC<DropZoneProps> = ({ documents, setDocuments }) => {
	const dropzoneRef = useRef<HTMLDivElement>(null);
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);
	const { session } = useStoreSecret(selectorSecret, shallow);
	const supabase = useSupabase();

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		handleFiles(files);
	};

	const handleClick = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = true;
		input.addEventListener('change', () => {
			const files = input.files;
			if (files) {
				handleFiles(files);
			}
		});
		input.click();
	};

	const handleFiles = async (files: FileList) => {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const newDocument = await uploadFile(file, setUploadProgress, supabase);
			if (newDocument) {
				setDocuments([...documents, newDocument]);
			}
		}
		alert(`Your file has been uploaded`);
	};

	return (
		<div
			ref={dropzoneRef}
			className="flex h-24 w-1/2 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-slate-400 bg-slate-50 text-center"
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={() => {
				if (!session) {
					alert(`You must be logged in to upload a file`);
					return;
				}
				handleClick();
			}}
		>
			{uploadProgress ? (
				<Loading className="-ml-1 mr-3 h-7 w-7 animate-spin text-black" />
			) : (
				<p>Drag and drop files here or click to upload</p>
			)}
		</div>
	);
};

export default Dropzone;
