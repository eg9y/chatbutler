export function hexToString(hex: string): string {
	// Remove the '\\x' prefix from the hexadecimal string
	const cleanedHex = hex.replace(/\\x/g, '');

	// Convert the cleaned hex string to a Uint8Array
	const hexArray = cleanedHex.match(/.{1,2}/g) ?? [];
	const uint8Array = new Uint8Array(hexArray.map((byte) => parseInt(byte, 16)));

	// Decode the Uint8Array using TextDecoder
	const decoder = new TextDecoder('utf-8');
	const decodedString = decoder.decode(uint8Array);

	return decodedString;
}
