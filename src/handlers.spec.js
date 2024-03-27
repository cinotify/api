import { describe, it, expect, beforeAll, vi } from 'vitest';
import { handler } from './handlers';
import { input } from './test';
import { payload } from './mail';

describe('handlers', () => {
  beforeAll(() => {
    global.fetch = vi.fn().mockImplementation(() => new Response('{}'));
  });

  it('400 if missing required parameters', async () => {
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

  it('400 if invalid to: address', async () => {
    const request = new Request('http://example.com/api/notify', {
      method: 'POST',
      body: JSON.stringify({ to: 'invalid email', subject: 'valid subject' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    global.fetch.mockImplementationOnce(() => {
      return new Response(
        JSON.stringify({
          errors: [
            {
              message: 'Does not contain a valid address.',
              field: 'personalizations.0.to.0.email',
              help: 'http://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html#message.personalizations.to',
            },
          ],
        }),
        { status: 400 },
      );
    });

    const response = await handler({ request });
    expect(await response.status).toEqual(400);
    expect(await response.json()).toEqual(
      expect.objectContaining({ error: 'Does not contain a valid address.' }),
    );
  });

  it('404', async () => {
    const request = new Request('http://example.com/undefined-route');
    const response = await handler({ request });
    expect(response.status).toEqual(404);
  });

  describe('postNotify', () => {
    it('calls the sendgrid api', async () => {
      const request = new Request('http://example.com/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      await handler({ request });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        expect.anything(),
      );
    });
    it('supports multiple recipients', async () => {
      global.fetch = vi.fn();
      const request = new Request('http://example.com/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...input,
          to: 'first@example.com,second@example.com',
        }),
      });
      await handler({ request });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        {
          body: JSON.stringify(
            payload({
              ...input,
              to: 'first@example.com,second@example.com',
            }),
          ),
          headers: expect.any(Object),
          method: 'POST',
        },
      );
    });
  });
});
