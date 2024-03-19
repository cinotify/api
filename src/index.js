const validate = async (request) => {
	const required = ['subject', 'to'];
	let data;
	try {
		data = (await request.json()) ?? {};
	} catch (e) {
		data = {};
	}

	data.errors = required.reduce((acc, el) => {
		if (!data[el]) {
			return [...acc, `missing required parameter '${el}'`];
		}
		return acc;
	}, []);

	return data;
};

export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);
		if (pathname === '/api/notify') {
			const { subject, to, errors } = await validate(request);
			const body = {
				subject,
				to,
			};
			const response = {
				...body,
				...(errors.length && { errors }),
			};
			return new Response(JSON.stringify(response), { status: errors.length ? 400 : 200 });
		}
		return new Response(null, { status: 404 });
	},
};
