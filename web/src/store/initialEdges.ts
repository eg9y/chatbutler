import { Edge } from 'reactflow';

export default [
	{
		id: 'e1-2',
		source: 'text-input',
		sourceHandle: 'text-output',
		target: 'llm-prompt-1',
		targetHandle: 'text-input',
		// label: "test",
	},
] as Edge[];
