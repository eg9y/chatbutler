import { Disclosure } from '@headlessui/react';
import { SignalIcon, ClipboardIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import { CombineDataType } from './types/NodeTypes';
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
					`m-3 bg-slate-100 shadow-lg`,
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
							<div className="flex flex-col gap-2 text-md pointer-events-none">
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
				className="top-1/2 h-10 flex gap-1 border-1 border-slate-700"
			>
				<div className=" bg-sky-300 w-5 h-full pointer-events-none"></div>
				<p className="bg-transparent  border-slate-700 text-xl font-bold self-center -z-10 pointer-events-none p-1">
					Files
				</p>
			</Handle>
			<Handle
				type="source"
				position={Position.Right}
				id="combine-output"
				className="w-4 h-4"
			/>
		</>
	);
};

export default memo(Combine);
