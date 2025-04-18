export default {
	async fetch(request) {
		const origin = request.headers.get("Origin") || "";

		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": origin,
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*",
					"Access-Control-Allow-Credentials": "true"
				}
			});
		}

		const { searchParams } = new URL(request.url);
		const targetUrl = searchParams.get("url");

		if (!targetUrl) {
			return new Response("Missing `url` parameter", { status: 400 });
		}

		try {
			const jsRes = await fetch(targetUrl);

			if (!jsRes.ok) {
				return new Response("Failed to fetch target JS file", { status: 502 });
			}

			const headers = {
				"Content-Type": "application/javascript",
				"Access-Control-Allow-Origin": origin,
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "*",
				"Cache-Control": "no-cache, no-store, must-revalidate"
			};

			return new Response(await jsRes.text(), { headers });
		} catch (err) {
			return new Response("Error fetching script: " + err.message, { status: 500 });
		}
	}
};
