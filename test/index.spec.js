import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('API', () => {
	it('errors for missing required parameters', async () => {
		const request = new Request('http://example.com/api/notify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.json()).toEqual({
			errors: ["missing required parameter 'subject'", "missing required parameter 'to'"],
		});
		expect(response.status).toEqual(400);
	});
	it('does not error if the required parameters are present', async () => {
		const request = new Request('http://example.com/api/notify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				to: 'example@example.com',
				subject: 'hello world',
			}),
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.json()).toEqual(expect.not.objectContaining({ errors: [] }));
		expect(response.status).toEqual(200);
	});
});
