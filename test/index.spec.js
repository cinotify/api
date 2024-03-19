import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

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
      errors: ["missing required parameter 'subject'", "missing required parameter 'to'"],
    });
    expect(response.status).toEqual(400);
  });
  it('responds to application/json and application/x-www-form-urlencoded', async () => {
    const jsonResponse = await send(
      new Request('http://example.com/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'example@example.com',
          subject: 'hello world',
        }),
      }),
    );
    expect(await jsonResponse.json()).toEqual({
      to: 'example@example.com',
      subject: 'hello world',
    });
    expect(jsonResponse.status).toEqual(200);

    const formResponse = await send(
      new Request('http://example.com/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'to=example@example.com&subject=hello world',
      }),
    );
    expect(await formResponse.json()).toEqual({
      to: 'example@example.com',
      subject: 'hello world',
    });
    expect(formResponse.status).toEqual(200);

    expect.assertions(4);
  });

  it('404s for undefined routes', async () => {
    const request = new Request('http://example.com/undefined-route');
    const response = await send(request);
    expect(response.status).toEqual(404);
  });
});
