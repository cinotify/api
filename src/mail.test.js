import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { mail } from './mail';

const originalFetch = global.fetch;

describe('mail', () => {
  beforeAll(() => {
    global.fetch = vi.fn();
  });
  afterAll(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });
  it('makes a request to the sendgrid api', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => '{}' });
    const to = 'ex@mple.com';
    const subject = 'hello';
    await mail({ to, subject });
    expect(global.fetch).toHaveBeenCalledWith('https://api.sendgrid.com/v3/mail/send', {
      headers: {
        Authorization: expect.any(String),
      },
      method: 'POST',
      body: JSON.stringify({ to, subject }),
    });
  });
});
