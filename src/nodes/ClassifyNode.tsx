import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { ClassifyNodeDataType, NodeTypesEnum } from './types/NodeTypes';
import { conditionalClassNames } from '../utils/classNames';
import { Disclosure } from '@headlessui/react';
import { ArrowsPointingOutIcon, SignalIcon } from '@heroicons/react/20/solid';
import RunnableToolbarTemplate from './templates/RunnableToolbarTemplate';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import InputNodesList from './templates/InputNodesList';
import ShowPromptSwitch from '../components/ShowPromptSwitch';
import FullScreenEditor from '../components/FullScreenEditor';
import { handleChange } from '../utils/handleFormChange';

const Classify: FC<NodeProps<ClassifyNodeDataType>> = (props) => {
	const { data, selected, id } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;
	const [textType, { set: setTextType }] = useUndo(data.textType);
	const { present: presentTextType } = textType;

	const { updateNode } = useStore(selector, shallow);
	const [showPrompt, setShowPrompt] = useState(true);
	const [showFullScreen, setShowFullScreen] = useState(false);

	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<div className="">
			<div
				style={{
					width: '40rem',
				}}
				className={`my-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-rose-600' : 'border-slate-400'
				} flex flex-col `}
			>
				{RunnableToolbarTemplate(data, selected, updateNode, id)}
				{/* how to spread  */}
				<div className="">
					<div className="flex flex-col h-full">
						<div
							className={`p-4 flex justify-between items-center border-b-1 border-slate-400 text-2xl bg-rose-200`}
						>
							<div className="flex gap-2 items-center">
								<h1 className="text-start">
									<span className="font-semibold">Classification:</span>{' '}
									{data.name}
								</h1>
								{data.isLoading && (
									<svg
										className="animate-spin -ml-1 mr-3 h-7 w-7 text-black"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								)}
							</div>
							{ShowPromptSwitch(showPrompt, setShowPrompt)}
						</div>
						<div className="px-4 gap-1 w-full flex justify-between items-center h-14">
							<>
								<label
									htmlFor="text"
									className="block font-medium leading-6 text-2xl"
								>
									Text to classify:
								</label>
								<p className="truncate text-start flex-grow">
									{!showPrompt && presentText}
								</p>
							</>
							<ArrowsPointingOutIcon
								className={
									'text-slate-500 hover:text-slate-800  h-8 w-8 flex-shrink-0'
								}
								aria-hidden="true"
								onClick={() => {
									setShowFullScreen(!showFullScreen);
								}}
							/>
						</div>
						<div>
							{showPrompt && (
								<Content
									showPrompt={showPrompt}
									presentText={presentText}
									setText={setText}
									presentTextType={presentTextType}
									setTextType={setTextType}
									data={data}
									id={id}
									updateNode={updateNode}
								></Content>
							)}
							<FullScreenEditor
								heading="Classify"
								showFullScreen={showFullScreen}
								setShowFullScreen={setShowFullScreen}
							>
								<Content
									showPrompt={showPrompt}
									presentText={presentText}
									setText={setText}
									presentTextType={presentTextType}
									setTextType={setTextType}
									data={data}
									id={id}
									updateNode={updateNode}
								></Content>
							</FullScreenEditor>
						</div>
					</div>
				</div>
			</div>
			<Disclosure
				as="div"
				className="space-y-1 absolute w-full"
				defaultOpen={data.response.length > 0}
			>
				{({ open }) => (
					<div className="mx-3">
						<Disclosure.Button
							className={conditionalClassNames(
								open ? 'border-b-slate-300' : '',
								'flex justify-between border-1 border-slate-400 bg-slate-200 text-slate-900 group px-2 w-full items-center rounded-t-md py-2 pr-2 text-left text-md font-semibold',
							)}
							disabled={data.response.length === 0}
						>
							<p className="flex gap-1 items-center pl-2">
								<SignalIcon
									className={conditionalClassNames(
										data.response.length > 0
											? 'text-green-500'
											: 'text-slate-400',
										' -ml-1 mr-1 h-7 w-7 flex-shrink-0',
									)}
									aria-hidden="true"
								/>
								<span
									className={conditionalClassNames(
										data.response.length === 0 && 'text-slate-400',
									)}
								>
									Current results:
								</span>
							</p>

							{/* expand svg */}
							{data.response.length > 0 && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={conditionalClassNames(
										open ? 'transform rotate-180' : '',
										'h-6 w-6',
									)}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 15.75l7.5-7.5 7.5 7.5"
									/>
								</svg>
							)}
						</Disclosure.Button>
						<Disclosure.Panel className="space-y-1 mb-10">
							<div
								className="p-3 bg-slate-50 border-1 border-t-0 
							border-slate-400 rounded-b-lg flex flex-col justify-between gap-4 items-end"
							>
								<p className="text-start w-full">{data.response}</p>
								<ClipboardIcon
									className={conditionalClassNames(
										' -ml-1 mr-1 h-7 w-7 flex-shrink-0 cursor-pointer text-slate-500 hover:text-slate-900 active:scale-50',
									)}
									aria-hidden="true"
									onClick={() => {
										navigator.clipboard.writeText(data.response);
									}}
								/>
							</div>
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>
			<Handle
				type="target"
				position={Position.Left}
				id="text-input"
				className="w-4 h-4"
			></Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="classify"
				className="bg-transparent"
			/>
		</div>
	);
};

const Content: FC<{
	showPrompt: boolean;
	presentText: string;
	setText: (newPresent: string, checkpoint?: boolean | undefined) => void;
	data: ClassifyNodeDataType;
	id: string;
	updateNode: any;
	presentTextType: string;
	setTextType: (newPresent: string, checkpoint?: boolean | undefined) => void;
}> = ({ presentText, setText, data, id, updateNode, showPrompt, presentTextType, setTextType }) => {
	return (
		<div
			style={{
				height: showPrompt ? '35rem' : '0rem',
			}}
		>
			{/* list of data.inputs string Set */}
			<div className="h-full flex flex-col gap-1 px-4 pb-4 text-slate-900">
				<textarea
					rows={4}
					name="text"
					id={`text-${id}`}
					className="nowheel nodrag grow text-xl w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-1 focus:ring-inset focus:ring-slate-400 sm:leading-6"
					value={presentText}
					onFocus={(e) => {
						e.target.selectionStart = 0;
						e.target.selectionEnd = 0;
					}}
					onChange={(e) => {
						setText(e.target.value);
						handleChange(e, id, data, updateNode);
					}}
				/>
				<div className="grow-0 flex flex-col gap-2 text-md ">
					<InputNodesList
						data={data}
						id={id}
						setText={setText}
						updateNode={updateNode}
						type={NodeTypesEnum.classify}
					/>
				</div>
				<div className="py-1">
					<div className="h-14 flex items-center">
						<label
							htmlFor="textType"
							className="grow block font-medium leading-6 text-2xl"
						>
							Text Type:
						</label>
					</div>
					<input
						type="text"
						name="textType"
						className="nodrag block h-16 w-full rounded-md border-0 text-slate-900 shadow-sm ring-inset ring-slate-300 placeholder:text-slate-400 ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6"
						value={presentTextType}
						onChange={(e) => {
							setTextType(e.target.value);
							updateNode(id, {
								...data,
								textType: e.target.value,
							});
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(Classify);
