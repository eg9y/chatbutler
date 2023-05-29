import {
	ClassifyNodeCategoriesDataType,
	ConditionalBooleanOperation,
	CustomNode,
	NodeTypesEnum,
	PlaceholderDataType,
	SearchDataType,
} from '@chatbutler/shared/src/index';
import { nanoid } from 'nanoid';
import { addEdge, MarkerType, Node } from 'reactflow';

import { RFState, UseStoreSetType } from './useStore';
import { Inputs } from '../nodes/types/Input';

export const generateUniqueId = (type: NodeTypesEnum) => {
	return `${type}-${nanoid()}`;
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
				children: [],
				isLoading: false,
				model: 'text-davinci-003',
				temperature: 0.7,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
				best_of: 1,
				stop: [],
				inputs: new Inputs(),
				response: '',
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	}
	if (type === NodeTypesEnum.singleChatPrompt) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `chat call`,
				text: `prompt`,
				children: [],
				isLoading: false,
				model: 'gpt-3.5-turbo',
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
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.fileText) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `file ${nodeLength}`,
				text: `This is a file text ${nodeLength}`,
				children: [],
				inputs: new Inputs(),
				response: `This is a file text ${nodeLength}`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.search) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `file ${nodeLength}`,
				text: `What is the capital of Indonesia?`,
				children: [],
				inputs: new Inputs(),
				response: `This is a file text ${nodeLength}`,
				returnSource: false,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
				model: 'gpt-3.5-turbo',
				temperature: 0.7,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
				best_of: 1,
				stop: [],
				docs: '',
				askUser: false,
			} as SearchDataType,
		};
	} else if (type === NodeTypesEnum.combine) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `file ${nodeLength}`,
				text: `This is a file text ${nodeLength}`,
				children: [],
				inputs: new Inputs(),
				response: `This is a file text ${nodeLength}`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.classify) {
		const nodeId = generateUniqueId(type);
		const classifyCategoriesId = generateUniqueId(NodeTypesEnum.classifyCategories);
		node = {
			id: nodeId,
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `classifier ${nodeLength}`,
				text: `lorem ipsum`,
				textType: '',
				children: [classifyCategoriesId],
				isLoading: false,
				// TODO: model set
				model: 'gpt-3.5-turbo',
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
				isDetailMode: true,
			},
		};

		const nodeChanges = nodes.concat(node);
		set({
			nodes: nodeChanges,
		});

		const classifyCategoriesNode: Node<ClassifyNodeCategoriesDataType> = {
			id: classifyCategoriesId,
			type: NodeTypesEnum.classifyCategories,
			parentNode: nodeId,
			position: {
				x: 700,
				y: 260,
			},
			data: {
				classifications: [],
				children: [],
				name: `category`,
				text: ``,
				inputs: new Inputs([nodeId]),
				response: ``,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};

		set({
			nodes: nodeChanges.concat(classifyCategoriesNode),
		});

		const edges = get().edges;

		const edge = {
			id: `${nodeId}-${classifyCategoriesId}`,
			source: nodeId,
			target: classifyCategoriesId,
			type: 'smoothstep',
			animated: false,
			style: {
				strokeWidth: 8,
				stroke: '#fb7185',
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				width: 10,
				height: 10,
				color: '#fb7185',
			},
		};

		set({
			edges: addEdge(edge, edges),
		});
		return;
	} else if (type === NodeTypesEnum.text) {
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
				children: [],
				inputs: new Inputs(),
				response: `This is a test input ${nodeLength}`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.counter) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `counter`,
				text: ``,
				children: [],
				inputs: new Inputs(),
				response: '-1',
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.conditional) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `test conditional ${nodeLength}`,
				text: `value`,
				booleanOperation: ConditionalBooleanOperation.EqualTo,
				value: 'value',
				valueToCompare: 'value to compare',
				children: [],
				inputs: new Inputs(),
				response: `True`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.loop) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `test loop ${nodeLength}`,
				text: `loop message`,
				loopCount: 0,
				loopMax: 3,
				children: [],
				inputs: new Inputs(),
				response: `loop message`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.inputText) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `input`,
				text: `input prompt`,
				children: [],
				inputs: new Inputs(),
				response: `input text`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
			},
		};
	} else if (type === NodeTypesEnum.outputText) {
		node = {
			id: generateUniqueId(type),
			type,
			position: {
				x,
				y,
			},
			data: {
				name: `output`,
				text: `output`,
				children: [],
				inputs: new Inputs(),
				response: `output`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
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
				model: 'gpt-3.5-turbo',
				temperature: 0.7,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
				best_of: 1,
				children: [],
				inputs: new Inputs(),
				response: '',
				isBreakpoint: false,
				stop: [],
				isDetailMode: true,
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
				children: [],
				role: 'user',
				name: `chat message ${nodeLength}`,
				// name: `test chat message ${nodeLength}`,
				text: `This is a chat message ${nodeLength}`,
				inputs: new Inputs(),
				response: `This is a chat message ${nodeLength}`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
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
				children: [],
				name: `placeholder ${nodeId}`,
				text: `placeholder ${nodeId}`,
				inputs: new Inputs(),
				response: `placeholder ${nodeId}`,
				isLoading: false,
				isBreakpoint: false,
				isDetailMode: true,
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
