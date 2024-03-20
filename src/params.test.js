import { describe, it, expect } from 'vitest';
import { params } from './params';

describe.each(['application/json', 'application/x-www-form-urlencoded'])(
  'params',
  (contentType) => {
    const body = {
      to: 'example@example.com',
      subject: 'hello world',
    };

    const format = {
      'application/json': (d) => JSON.stringify(d),
      'application/x-www-form-urlencoded': (d) => new URLSearchParams(d),
    };

    it('parses the posted data', async () => {
      const request = new Request('http://example.com/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
        },
        body: (format[contentType] ?? ((d) => d))(body),
      });

      console.log('request', request.headers.get('content-type'));

      expect(await params(request)).toEqual({
        errors: [],
        ...body,
      });
    });

    it('has errors', async () => {
      const request = {
        headers: { get: () => contentType },
      };
      const { errors } = await params(request);
      expect(errors).toEqual([
        "missing required parameter 'subject'",
        "missing required parameter 'to'",
      ]);
    });
  },
);
