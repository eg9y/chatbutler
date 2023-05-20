import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { Fragment, memo, FC, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { ClassifyNodeCategoriesDataType, NodeTypesEnum } from './types/NodeTypes';
import { generateUniqueId } from '../store/onAdd';
import useStore, { selector } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

const Text: FC<NodeProps<ClassifyNodeCategoriesDataType>> = (props) => {
	const { data, id } = props;
	const { updateNode, deleteEdges, getNodes } = useStore(selector, shallow);
	const [classifications, setClassifications] = useState(data ? data.classifications : []);

	useEffect(() => {
		if (classifications && data) {
			updateNode(
				id,
				{
					...data,
					classifications: classifications,
				},
				{
					mode: 'set',
					x: 700,
					y: 260 + classifications.length * -28,
				},
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [classifications]);

	const inputNode = data ? getNodes(data.inputs.inputs)[0] : null;

	return (
		<div className="nodrag">
			<div
				style={{
					width: '25rem',
				}}
				className={`my-3 flex flex-col rounded-lg border-2 border-slate-400 bg-rose-50 shadow-lg `}
			>
				<div className="flex h-full flex-col gap-2 p-4">
					<p className="text-2xl font-semibold">Categories</p>
					<div className="relative">
						{classifications?.map(
							(classification: { id: string; value: string }, index: number) => {
								return (
									<div
										key={classification.id}
										className="flex h-14 items-center gap-1 px-1 py-2"
									>
										<XCircleIcon
											className={
												'h-10 w-10 flex-shrink-0 text-rose-400 hover:text-red-500'
											}
											aria-hidden="true"
											onClick={() => {
												// remove the classification
												deleteEdges(classification.id);
												setClassifications(
													(
														prevClassification: {
															id: string;
															value: string;
														}[],
													) => {
														const newClassifications = [
															...prevClassification,
														];
														newClassifications.splice(index, 1);
														return newClassifications;
													},
												);
												// delete all edges connected to handle with sourceHandle classification.id
											}}
										/>
										<form className="relative w-full">
											<div className="relative">
												<input
													type="text"
													name="textType"
													className={conditionalClassNames(
														'nodrag block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-2 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-xl sm:leading-6',
													)}
													value={classification.value}
													placeholder="category A"
													onChange={(e) => {
														setClassifications(
															(
																prevClassification: {
																	id: string;
																	value: string;
																}[],
															) => {
																const newClassifications = [
																	...prevClassification,
																];
																newClassifications[index].value =
																	e.target.value;
																return newClassifications;
															},
														);
														updateNode(id, {
															...data,
															classifications: classifications,
														});
													}}
												/>
												{inputNode?.data.response ===
													classification.value && (
													<CheckCircleIcon
														className={
															'absolute top-0 right-1 h-full w-6 text-green-600'
														}
														aria-hidden="true"
													/>
												)}
											</div>
											<Fragment>
												<Handle
													type="source"
													position={Position.Right}
													id={`${classification.id}::${index}`}
													className="-right-7 h-4 w-4"
												/>
											</Fragment>
										</form>
									</div>
								);
							},
						)}
					</div>
					<div className="relative">
						<p className="text-end text-xl font-semibold">None of the above</p>
						<Handle
							type="source"
							position={Position.Right}
							id={`${NodeTypesEnum.classifyCategories}::none`}
							className="-right-6 h-4 w-4 bg-red-400"
						/>
					</div>
					<button
						className="text-md rounded border-4 border-dashed border-rose-400 py-1 px-2 text-center text-xl font-medium text-rose-400 hover:bg-rose-100"
						onClick={(event) => {
							event.stopPropagation();
							event.preventDefault();
							setClassifications((prevClassification) => {
								const newClassifications = [...prevClassification];
								newClassifications.push({
									id: generateUniqueId(NodeTypesEnum.classifyCategories),
									value: '',
								});
								return newClassifications;
							});
						}}
					>
						Add Category
					</button>
				</div>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="classifyCategories-target"
				className="bg-transparent"
			></Handle>
		</div>
	);
};

export default memo(Text);
