import { Node } from 'reactflow';

import { CustomNode, DocsLoaderDataType, NodeTypesEnum } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';

function pauser(node: CustomNode, get: () => RFState): Promise<string> {
	return new Promise((resolve) => {
		const chatApp = get().chatApp;
		get().setChatApp([
			...chatApp,
			{
				role: 'assistant',
				content: 'Upload the document you want to search for',
				assistantMessageType: NodeTypesEnum.docsLoader,
			},
		]);
		get().setWaitingUserResponse(true);
		get().setPauseResolver((fileName) => {
			get().setWaitingUserResponse(false);
			node.data.response = fileName;
			return resolve(fileName);
		});
	});
}

const docsLoader = async (node: Node<DocsLoaderDataType>, get: () => RFState) => {
	if (node.data.askUser) {
		console.log('ask user');
		await pauser(node as CustomNode, get);
	} else {
		console.log('no ask user');
		node.data.response = node.data.text;
	}
	node.data = {
		...node.data,
		isLoading: false,
	};
};

export default docsLoader;
