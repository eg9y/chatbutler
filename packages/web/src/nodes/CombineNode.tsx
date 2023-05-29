import { CombineDataType } from '@chatbutler/shared/src/index';
import { Disclosure } from '@headlessui/react';
import { SignalIcon, ClipboardIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import { conditionalClassNames } from '../utils/classNames';

const Combine: FC<NodeProps<CombineDataType>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showFullScreen, setShowFullScreen] = useState(false);

	return (
		<>
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg`,
				)}
			>
				{/* how to spread  */}
				<NodeTemplate
					{...props}
					title="Combine"
					fieldName="Combine files"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					color="sky"
					selected={selected}
				>
					{(updateNode: (id: string, data: CombineDataType) => void) => (
						<>
							<div className="text-md pointer-events-none flex flex-col gap-2">
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
			<Disclosure
				as="div"
				className="absolute w-full space-y-1"
				defaultOpen={data.response.length > 0}
			>
				{({ open }) => (
					<div className="mx-3">
						<Disclosure.Button
							className={conditionalClassNames(
								open ? 'border-b-slate-300' : '',
								'text-md group flex w-full items-center justify-between rounded-t-md border-1 border-slate-400 bg-slate-200 px-2 py-2 pr-2 text-left font-semibold text-slate-900',
							)}
							disabled={data.response.length === 0}
						>
							<p className="flex items-center gap-1 pl-2">
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
										open ? 'rotate-180 transform' : '',
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
						<Disclosure.Panel className="mb-10 space-y-1">
							<div
								className="flex flex-col items-end justify-between 
							gap-4 rounded-b-lg border-1 border-t-0 border-slate-400 bg-slate-50 p-3"
							>
								<p>{data.response}</p>
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
				id="combine-input"
				style={{
					left: '-4.0rem',
					backgroundColor: 'rgb(248 250 252)',
				}}
				className="top-1/2 flex h-10 gap-1 border-1 border-slate-700"
			>
				<div className=" pointer-events-none h-full w-5 bg-sky-300"></div>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-xl font-bold">
					Files
				</p>
			</Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="combine-output"
				className="h-4 w-4"
			/>
		</>
	);
};

export default memo(Combine);
