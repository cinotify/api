import { describe, it, expect, vi, beforeAll } from 'vitest';
import { input } from './test';
import { mail, payload } from './mail';

// https://docs.sendgrid.com/api-reference/mail-send/mail-send#body
const fixture = {
  attachments: input.attachments,
  content: [
    {
      type: 'text/html',
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
    global.fetch.mockResolvedValue({ json: () => '{}' });
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
  it('logs', async () => {
    global.fetch.mockResolvedValue({ json: () => '{}', status: 200 });
    await mail({
      ...input,
      to: 'one@example.com,two@example.com',
      userAgent: 'custom-user-agent 1.0',
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.logsnag.com/v1/log',
      expect.objectContaining({
        body: JSON.stringify({
          project: 'cinotify',
          channel: 'api',
          event: 'mail',
          icon: '📬',
          user_id: 'one@example.com',
          tags: {
            attachments: true,
            contentType: 'text/html',
            status: 200,
            userAgent: 'custom-user-agent 1.0',
          },
        }),
      }),
    );
  });
});

describe('payload', () => {
  it('supports a type', () => {
    input.type = 'text/html';
    expect(payload(input).content[0].type).toBe('text/html');
    input.type = 'text/plain';
    expect(payload(input).content[0].type).toBe('text/plain');
  });
  it('supports multiple recipients', () => {
    expect(
      payload({ to: 'one@example.com,two@example.com' }).personalizations[0].to,
    ).toStrictEqual([
      { email: 'one@example.com' },
      { email: 'two@example.com' },
    ]);
  });
});
