import { LLMPromptNodeDataType, TextNodeDataType } from '@chatbutler/shared/src/index';
import { PlayIcon } from '@heroicons/react/20/solid';
import { Node } from 'reactflow';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../../../../../store/useStore';

export default function TestTab({
	selectedNode,
}: {
	selectedNode: Node<LLMPromptNodeDataType>;
	updateNode: (id: string, data: LLMPromptNodeDataType | TextNodeDataType) => void;
}) {
	const { updateInputExample } = useStore(selector, shallow);

	return (
		<>
			{selectedNode && (
				<div className="text-sm font-medium leading-6 text-slate-900">
					<div className="">
						<p className="">Test inputs</p>
						{selectedNode.data.inputs.inputExamples.map((inputExample, index) => {
							return (
								<div
									key={`${inputExample.id}-${index}`}
									className="flex flex-col gap-1 text-xs"
								>
									<form className="flex flex-col gap-2">
										{Object.keys(inputExample).map((inputId) => {
											return (
												<div key={inputId} className="">
													<label htmlFor={inputId}>
														{inputExample[inputId].name}
													</label>
													<input
														type="text"
														name={inputId}
														id={`${inputId}-${index}`}
														className="block w-full rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
														value={inputExample[inputId].value}
														onChange={(e) => {
															updateInputExample(
																selectedNode.id,
																inputId,
																e.target.value,
																index,
															);
														}}
													/>
												</div>
											);
										})}
									</form>
								</div>
							);
						})}
						<button className="my-2 flex items-center rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-600">
							<PlayIcon
								className={'-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-blue-300'}
								aria-hidden="true"
							/>
							<span>Run</span>
						</button>
						{/* add test button */}
					</div>
				</div>
			)}
		</>
	);
}
