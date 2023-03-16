// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}
