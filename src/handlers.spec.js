import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker, { params } from '.';

const send = async (request) => {
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
};

describe('API', () => {
  it('errors for missing required parameters', async () => {
    const request = new Request('http://example.com/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await send(request);
    expect(await response.json()).toEqual({
      errors: [
        "missing required parameter 'subject'",
        "missing required parameter 'to'",
      ],
    });
    expect(response.status).toEqual(400);
  });

  // TODO: mock worker outbound fetch

  it('404s for undefined routes', async () => {
    const request = new Request('http://example.com/undefined-route');
    const response = await send(request);
    expect(response.status).toEqual(404);
  });
});
