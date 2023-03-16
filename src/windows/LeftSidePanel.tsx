import { Cog6ToothIcon, Bars3CenterLeftIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';
import useStore, { selector } from '../store/useStore';
import { NodeTypesEnum } from '../nodes/types/NodeTypes';

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

export default function LeftSidePanel({
	onAdd,
}: {
	onAdd: (type: NodeTypesEnum, x: number | undefined, y: number | undefined) => void;
}) {
	const { openAIKey, setOpenAiKey } = useStore(selector, shallow);

	return (
		<aside
			style={{
				height: '100vh',
			}}
			className="bg-slate-50 w-full shadow-lg"
		>
			<div className="flex flex-col justify-between h-full py-1 border-1">
				<div className="space-y-1">
					<div className="pb-4 px-2">
						<h1 className="font-bold text-lg">PromptSandbox.io</h1>
						<p className="text-xs">
							Create intricate workflows with Open AI APIs through visual programming.
						</p>
					</div>
					<div>
						<div className="bg-slate-200 flex justify-between">
							<p className="text-start text-slate-900 font-semibold text-md pr-2 pl-4 py-1">
								Nodes
							</p>
							{/* <button
                onClick={() => setTopDivCollapsed(!topDivCollapsed)}
                className=" text-slate-900 font-semibold text-md px-2 py-1"
              >
                {topDivCollapsed ? (
                  <ChevronUpIcon
                    className={
                      "text-slate-600 group-hover:text-gray-500 h-full mx-auto"
                    }
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDownIcon
                    className={
                      "text-slate-600 group-hover:text-gray-500 h-full mx-auto"
                    }
                    aria-hidden="true"
                  />
                )}
              </button> */}
						</div>
						<div className="flex flex-col gap-1 px-2 py-2">
							<a
								className={
									'text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer ring-2 ring-inset ring-emerald-300'
								}
								onClick={() => onAdd(NodeTypesEnum.textInput, centerX, centerY)}
							>
								<Bars3CenterLeftIcon
									className={
										'text-gray-400 group-hover:text-gray-500 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
									}
									aria-hidden="true"
								/>
								<span className="truncate">Text Input</span>
							</a>
							<a
								className={
									'text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer ring-2 ring-inset ring-yellow-300'
								}
								onClick={() => onAdd(NodeTypesEnum.llmPrompt, centerX, centerY)}
							>
								<DocumentTextIcon
									className={
										'text-gray-400 group-hover:text-gray-500 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
									}
									aria-hidden="true"
								/>
								<span className="truncate">LLM Prompt</span>
							</a>

							<a
								className={
									'text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer ring-2 ring-inset ring-blue-300'
								}
								onClick={() => onAdd(NodeTypesEnum.textInput, centerX, centerY)}
							>
								<Bars3CenterLeftIcon
									className={
										'text-gray-400 group-hover:text-gray-500 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
									}
									aria-hidden="true"
								/>
								<span className="truncate">Code</span>
							</a>
						</div>
					</div>
				</div>
				<div className="px-2">
					<div className="mt-1 space-y-1" aria-labelledby="projects-headline">
						<a
							className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 bg-slate-100 hover:text-gray-900 cursor-pointer border-2 border-slate-400"
							onClick={() => {
								const newOpenAIKey = window.prompt(
									'Enter your OpenAI Key here',
									openAIKey,
								);
								if (newOpenAIKey) {
									setOpenAiKey(newOpenAIKey);
								}
							}}
						>
							<Cog6ToothIcon
								className={
									'text-gray-400 group-hover:text-gray-500 -ml-1 mr-3 h-6 w-6 flex-shrink-0'
								}
								aria-hidden="true"
							/>
							<span className="truncate">OpenAI Key</span>
						</a>
					</div>
				</div>
			</div>
		</aside>
	);
}
