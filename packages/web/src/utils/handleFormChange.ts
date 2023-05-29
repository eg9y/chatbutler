import { DefaultNodeDataType } from '@chatbutler/shared/src/index';

export function handleChange(
	event:
		| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
		| {
				target: {
					name: string;
					value: string[];
					type: null;
				};
		  },
	nodeId: string,
	data: DefaultNodeDataType,

	updateNode: (id: string, data: any) => void,
) {
	let name = event.target.name;
	let updatedValue: string | string[] | number = event.target.value;

	// if there's a -slider at the end of name, remove it
	if (name.endsWith('-slider')) {
		name = name.slice(0, -7);
		const input = document.querySelector(`input[name=${name}]`) as HTMLInputElement;
		input.value = event.target.value.toString();
		updatedValue = parseFloat(event.target.value.toString());
	}

	if (event.target.type === 'number') {
		const range = document.querySelector(`input[name=${name}-slider]`) as HTMLInputElement;
		range.value = event.target.value;
		updatedValue = parseFloat(event.target.value.toString());
	}

	// get range value
	updateNode(nodeId, {
		...data,
		[name]: updatedValue,
	});
}
