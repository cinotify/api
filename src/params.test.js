import { describe, it, expect } from 'vitest';
import { params } from './params';

describe('params', () => {
  const body = {
    to: 'example@example.com',
    subject: 'hello world',
  };

  it('supports application/json', async () => {
    const request = new Request('http://example.com/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    expect(await params(request)).toEqual({
      errors: [],
      ...body,
    });
  });

  it('application/x-www-form-urlencoded', async () => {
    const formResponse = new Request('http://example.com/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body),
    });

    expect(await params(formResponse)).toEqual({
      errors: [],
      ...body,
    });
  });
});
