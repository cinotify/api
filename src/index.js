import { mail } from './mail';

const validate = async (request) => {
  const contentType = request.headers.get('content-type');
  const required = ['subject', 'to'];
  let data = {};
  try {
    if (contentType === 'application/json') {
      data = (await request.json()) ?? {};
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      data = Object.fromEntries(
        new URLSearchParams((await request.text()) ?? ''),
      );
    }
  } catch (e) {
    data = {};
  }

  data.errors = required.reduce(
    (acc, el) =>
      data?.[el] ? acc : [...acc, `missing required parameter '${el}'`],
    [],
  );

  return data;
};

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/notify' && request.method === 'POST') {
      const { subject, to, errors = [] } = await validate(request);
      const body = await mail({
        env,
        subject,
        to,
      });
      const response = {
        ...body,
        ...(errors.length && { errors }),
      };
      return new Response(JSON.stringify(response), {
        status: errors.length ? 400 : 200,
      });
    }
    return new Response(
      JSON.stringify(
        {
          message: 'Not Found',
          documentation_url: 'https://www.cinotify.cc/docs',
        },
        null,
        2,
      ),
      { status: 404 },
    );
  },
};
