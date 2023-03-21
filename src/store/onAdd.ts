import { addEdge, MarkerType, Node } from 'reactflow';
import { Inputs } from '../nodes/types/Input';
import { NodeTypesEnum, CustomNode, PlaceholderDataType } from '../nodes/types/NodeTypes';
import { RFState, UseStoreSetType } from './useStore';

const makeId = (length = 5) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
};

const generateUniqueId = (type: NodeTypesEnum) => {
	return `${type}-${makeId()}`;
};

const onAdd = (
	get: () => RFState,
	set: UseStoreSetType,
	type: NodeTypesEnum,
	position: {
		x: number;
		y: number;
	},
	parentNode?: string,
) => {
	const x = position.x;
	const y = position.y;

	const nodes = get().nodes;

	// TODO: set different defaults based on the node type (e.g. text input won't include a prompt field)
	const nodeLength = nodes.length + 1;

	let node: CustomNode | null = null;
	if (type === NodeTypesEnum.llmPrompt) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `test prompt ${nodeLength}`,
				text: `This is a test prompt ${nodeLength}`,
				isLoading: false,
				model: 'text-davinci-003',
				temperature: 0.7,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
				best_of: 1,
				inputs: new Inputs(),
				response: '',
				isBreakpoint: false,
				stop: [],
			},
		};
	} else if (type === NodeTypesEnum.textInput) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `test input ${nodeLength}`,
				text: `This is a test input ${nodeLength}`,
				inputs: new Inputs(),
				response: `This is a test input ${nodeLength}`,
				isLoading: false,
				isBreakpoint: false,
			},
		};
	} else if (type === NodeTypesEnum.chatPrompt) {
		const nodeId = generateUniqueId(type);
		node = {
			id: nodeId,
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `test prompt ${nodeLength}`,
				text: `this is a system message ${nodeLength}`,
				isLoading: false,
				model: 'gpt-4',
				temperature: 0.7,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
				best_of: 1,
				inputs: new Inputs(),
				response: '',
				isBreakpoint: false,
				stop: [],
			},
		};
		if (parentNode) {
			node.parentNode = parentNode;
		}

		const nodeChanges = nodes.concat(node);
		set({
			nodes: nodeChanges,
		});

		return;
	} else if (type === NodeTypesEnum.chatMessage) {
		const nodeId = generateUniqueId(type);
		node = {
			id: nodeId,
			type,
			position: {
				x,
				y,
			},
			parentNode,
			data: {
				childrenChat: [],
				role: 'user',
				name: `chat message ${nodeLength}`,
				// name: `test chat message ${nodeLength}`,
				text: `This is a chat message ${nodeLength}`,
				inputs: new Inputs(),
				response: `This is a chat message ${nodeLength}`,
				isLoading: false,
				isBreakpoint: false,
			},
		} as CustomNode;

		const nodeChanges = nodes.concat(node);
		set({
			nodes: nodeChanges,
		});

		const placeHolderId = generateUniqueId(NodeTypesEnum.placeholder);
		const placeHolderNode: Node<PlaceholderDataType> = {
			id: placeHolderId,
			type: NodeTypesEnum.placeholder,
			parentNode: nodeId,
			position: {
				x: 800,
				y: 0,
			},
			data: {
				typeToCreate: NodeTypesEnum.chatPrompt,
				name: `placeholder ${nodeId}`,
				text: `placeholder ${nodeId}`,
				inputs: new Inputs(),
				response: `placeholder ${nodeId}`,
				isLoading: false,
				isBreakpoint: false,
			},
		};

		set({
			nodes: nodeChanges.concat(placeHolderNode),
		});

		const edges = get().edges;

		const edge = {
			id: `${nodeId}-${placeHolderId}`,
			source: nodeId,
			target: placeHolderId,
			type: 'smoothstep',
			animated: false,
			style: {
				strokeWidth: 2,
				stroke: '#808080',
				strokeDasharray: '5,5',
			},
			markerEnd: {
				type: MarkerType.Arrow,
				width: 20,
				height: 20,
				color: 'rgb(0,0,0,0)',
			},
		};

		set({
			edges: addEdge(edge, edges),
		});
		return;
	}

	if (node) {
		set({
			nodes: nodes.concat(node),
		});
	}
};

export default onAdd;
