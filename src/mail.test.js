import { describe, it, expect, vi, beforeAll } from 'vitest';
import { input } from './test';
import { mail } from './mail';

// https://docs.sendgrid.com/api-reference/mail-send/mail-send#body
const fixture = {
  attachments: input.attachments,
  content: [
    {
      type: 'text/plain',
      value: input.body,
    },
  ],
  from: {
    email: 'app@cinotify.cc',
  },
  personalizations: [
    {
      subject: input.subject,
      to: [
        {
          email: input.to,
        },
      ],
    },
  ],
};

describe('mail', () => {
  beforeAll(() => {
    global.fetch = vi.fn();
  });
  it('makes a request to the sendgrid api', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => '{}' });
    await mail(input);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sendgrid.com/v3/mail/send',
      {
        headers: {
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(fixture),
      },
    );
  });
});
