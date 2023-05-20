// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function conditionalClassNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}
