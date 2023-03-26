const getURL = () => {
	let url =
		process.env.VERCEL_URL ?? // Automatically set by Vercel.
		'http://localhost:3000/';
	// Make sure to include `https://` when not localhost.
	url = url.includes('http') ? url : `https://${url}`;
	// Make sure to including trailing `/`.
	url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

	return url;
};

export default getURL;
