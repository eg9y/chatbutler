import { Switch } from '@headlessui/react';
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

	const { updateNode } = useStore(selector, shallow);

	const [returnSource, setReturnSource] = useState<boolean>(data.returnSource);

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
				style={{
					left: '-5.2rem',
					backgroundColor: 'rgb(248 250 252)',
					top: '33.333333%',
				}}
				className="flex h-10 gap-1 border-1 border-slate-700"
			>
				<div className=" pointer-events-none h-full w-5 bg-sky-300"></div>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-xl font-bold">
					Inputs
				</p>
			</Handle>
			<Handle
				type="target"
				position={Position.Left}
				id="search-input-doc"
				style={{
					left: '-3.8rem',
					backgroundColor: 'rgb(248 250 252)',
					top: '66.666667%',
				}}
				className=" flex h-10 gap-1 border-1 border-slate-700"
			>
				<div className=" pointer-events-none h-full w-5 bg-sky-300"></div>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-xl font-bold">
					Doc
				</p>
			</Handle>
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
