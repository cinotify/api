import { describe, it, expect, beforeAll, vi } from 'vitest';
import { handler } from './handlers';

describe('handlers', () => {
  beforeAll(() => {
    global.fetch = vi.fn();
  });

  it('400', async () => {
    const request = new Request('http://example.com/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await handler({ request });
    expect(await response.status).toEqual(400);
    expect(await response.json()).toEqual(
      expect.objectContaining({ errors: expect.any(Array) }),
    );
  });

  it('404', async () => {
    const request = new Request('http://example.com/undefined-route');
    const response = await handler({ request });
    expect(response.status).toEqual(404);
  });

  it('postNotify', async () => {
    const request = new Request('http://example.com/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: 'example@example.com', subject: 'ok' }),
    });
    await handler({ request });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sendgrid.com/v3/mail/send',
      expect.anything(),
    );
  });
});
