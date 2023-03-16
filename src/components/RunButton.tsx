import { PlayIcon } from '@heroicons/react/20/solid';
import { InputNode, LLMPromptNodeDataType } from '../nodes/types/NodeTypes';

export default function RunButton({
	id,
	data,
	updateNode,
}: {
	id: string;
	data: LLMPromptNodeDataType;
	inputNodes: InputNode[];
	updateNode: (id: string, data: any) => void;
}) {
	return (
		<button
			className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-2 my-2 rounded flex items-center"
			onClick={async () => {
				// const response = await getOpenAIResponse(
				//   data,
				//   data.inputs.inputNodes
				// );
				// console.log(JSON.stringify(response, null, 2));
				// const completion = response.data.choices[0].text;
				// if (completion) {
				//   data.response = completion;
				// }
				data.response = 'test output';
				console.log(data.response);
				updateNode(id, data);
			}}
		>
			<PlayIcon
				className={'text-blue-300 -ml-1 mr-1 h-5 w-5 flex-shrink-0'}
				aria-hidden="true"
			/>
			<span>Run</span>
		</button>
	);
}
