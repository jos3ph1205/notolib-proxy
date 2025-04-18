addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
	const jsUrl = 'https://yourcdn.com/path/to/your/script.js';  // URL to your JS file

	// Fetch the external JS file
	const jsResponse = await fetch(jsUrl);

	// Check if the fetch was successful
	if (!jsResponse.ok) {
		return new Response('JS file not found', { status: 404 });
	}

	// Clone the response so we can add headers
	const clonedResponse = jsResponse.clone();

	// Set custom headers
	const headers = clonedResponse.headers;
	headers.set('Content-Type', 'application/javascript');
	headers.set('Cache-Control', 'max-age=3600');  // Adjust as necessary
	headers.set('X-Custom-Header', 'SomeCustomValue'); // Add any other headers

	// Return the JS file with custom headers
	return new Response(clonedResponse.body, {
		headers: headers
	});
}
