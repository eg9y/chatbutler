import React, { useRef, useState } from 'react';

import uploadFile from './uploadFile';
import { ReactComponent as Loading } from '../../assets/loading.svg';

const Dropzone: React.FC = () => {
	const dropzoneRef = useRef<HTMLDivElement>(null);
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

	const handleFiles = (files: FileList) => {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			uploadFile(file, setUploadProgress);
		}
		alert(`Your file has been uploaded`);
	};

	return (
		<div
			ref={dropzoneRef}
			className="border-2 border-dashed bg-slate-50 border-slate-400 rounded-md h-48 flex items-center justify-center text-center cursor-pointer"
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={handleClick}
		>
			{uploadProgress ? (
				<Loading className="animate-spin -ml-1 mr-3 h-7 w-7 text-black" />
			) : (
				<p>Drag and drop files here or click to upload</p>
			)}
		</div>
	);
};

export default Dropzone;
